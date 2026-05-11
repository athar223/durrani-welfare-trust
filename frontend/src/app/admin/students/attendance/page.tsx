'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';

interface Student { id: number; full_name: string; education_level_display: string; }
interface Record_ { student: number; status: string; remarks: string; }

export default function StudentAttendancePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<number, Record_>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [date]);

  async function load() {
    setLoading(true);
    try {
      const [studsRes, attRes] = await Promise.all([
        adminApi.students.list({ is_active: true, page_size: 500 }),
        adminApi.studentAttendance.list({ date, page_size: 500 }),
      ]);
      const studs: Student[] = studsRes.data.results || studsRes.data;
      setStudents(studs);
      const existing: any[] = attRes.data.results || attRes.data;
      const map: Record<number, Record_> = {};
      studs.forEach((s) => { map[s.id] = { student: s.id, status: '', remarks: '' }; });
      existing.forEach((a: any) => { map[a.student] = { student: a.student, status: a.status, remarks: a.remarks || '' }; });
      setMarks(map);
    } finally { setLoading(false); }
  }

  function setMark(id: number, key: 'status' | 'remarks', value: string) {
    setMarks((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  }

  function markAll(status: string) {
    const next = { ...marks };
    Object.keys(next).forEach((id) => { next[Number(id)] = { ...next[Number(id)], status }; });
    setMarks(next);
  }

  async function save() {
    setSaving(true);
    try {
      // Delete existing for this date, then create new ones
      const existing = await adminApi.studentAttendance.list({ date, page_size: 500 });
      const existingRecords = existing.data.results || existing.data;
      await Promise.all(existingRecords.map((r: any) => adminApi.studentAttendance.delete(r.id)));

      const toCreate = Object.values(marks).filter((m) => m.status);
      await Promise.all(
        toCreate.map((m) => adminApi.studentAttendance.create({
          student: m.student, date, status: m.status, remarks: m.remarks,
        }))
      );
      toast.success(`Attendance saved for ${toCreate.length} students`);
    } catch {
      toast.error('Failed to save attendance');
    } finally { setSaving(false); }
  }

  return (
    <AdminLayout title="Student Attendance">
      <div className="bg-white rounded-xl shadow-soft p-4 mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold">Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input max-w-xs" />
        <div className="flex-1" />
        <button onClick={() => markAll('present')} className="px-3 py-1.5 text-sm bg-green-100 text-green-800 rounded-lg font-semibold">All Present</button>
        <button onClick={() => markAll('absent')} className="px-3 py-1.5 text-sm bg-rose-100 text-rose-800 rounded-lg font-semibold">All Absent</button>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-1 px-4 py-1.5 bg-dwt-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
          <Save size={14} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-16 text-center"><div className="w-10 h-10 border-4 border-dwt-200 border-t-dwt-500 rounded-full animate-spin mx-auto" /></div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No active students</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Class</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Present</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Absent</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Leave</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{i + 1}</td>
                  <td className="px-4 py-2 text-sm font-semibold">{s.full_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{s.education_level_display}</td>
                  {['present', 'absent', 'leave'].map((status) => (
                    <td key={status} className="px-4 py-2 text-center">
                      <input
                        type="radio"
                        name={`status_${s.id}`}
                        checked={marks[s.id]?.status === status}
                        onChange={() => setMark(s.id, 'status', status)}
                        className="w-4 h-4 text-dwt-500"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={marks[s.id]?.remarks || ''}
                      onChange={(e) => setMark(s.id, 'remarks', e.target.value)}
                      placeholder="Optional"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
