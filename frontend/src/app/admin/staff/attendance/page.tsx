'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';

interface StaffM { id: number; full_name: string; role_display: string; }
interface Mark { staff_member: number; status: string; remarks: string; }

export default function StaffAttendancePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [staff, setStaff] = useState<StaffM[]>([]);
  const [marks, setMarks] = useState<Record<number, Mark>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [date]);

  async function load() {
    setLoading(true);
    try {
      const [staffRes, attRes] = await Promise.all([
        adminApi.staff.list({ is_active: true, page_size: 500 }),
        adminApi.staffAttendance.list({ date, page_size: 500 }),
      ]);
      const list: StaffM[] = staffRes.data.results || staffRes.data;
      setStaff(list);
      const existing: any[] = attRes.data.results || attRes.data;
      const map: Record<number, Mark> = {};
      list.forEach((s) => { map[s.id] = { staff_member: s.id, status: '', remarks: '' }; });
      existing.forEach((a: any) => { map[a.staff_member] = { staff_member: a.staff_member, status: a.status, remarks: a.remarks || '' }; });
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
      const existing = await adminApi.staffAttendance.list({ date, page_size: 500 });
      const existingRecords = existing.data.results || existing.data;
      await Promise.all(existingRecords.map((r: any) => adminApi.staffAttendance.delete(r.id)));
      const toCreate = Object.values(marks).filter((m) => m.status);
      await Promise.all(
        toCreate.map((m) => adminApi.staffAttendance.create({ staff_member: m.staff_member, date, status: m.status, remarks: m.remarks }))
      );
      toast.success(`Attendance saved for ${toCreate.length} staff`);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  }

  return (
    <AdminLayout title="Staff Attendance">
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
        ) : staff.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No active staff</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Staff</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Role</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Present</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Absent</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Leave</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{i + 1}</td>
                  <td className="px-4 py-2 text-sm font-semibold">{s.full_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{s.role_display}</td>
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
