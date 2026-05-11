'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Edit, ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Badge from '@/components/admin/Badge';
import { adminApi, mediaUrl } from '@/lib/api';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    adminApi.students.get(Number(id))
      .then((r) => setStudent(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AdminLayout title={student ? student.full_name : 'Student'} actions={
      student && (
        <Link href={`/admin/students/${id}/edit`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-dwt-500 text-white rounded-lg">
          <Edit size={14} /> Edit
        </Link>
      )
    }>
      <Link href="/admin/students" className="inline-flex items-center gap-1 text-sm text-gray-600 mb-4">
        <ArrowLeft size={14} /> Back to Students
      </Link>
      {loading || !student ? (
        <div className="py-20 text-center"><div className="w-10 h-10 border-4 border-dwt-200 border-t-dwt-500 rounded-full animate-spin mx-auto" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            {student.profile_image ? (
              <img src={mediaUrl(student.profile_image)} alt="" className="w-32 h-32 rounded-full mx-auto object-cover mb-4" />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto bg-dwt-500 text-white flex items-center justify-center font-heading font-bold text-3xl mb-4">
                {student.first_name?.[0]}{student.last_name?.[0]}
              </div>
            )}
            <h2 className="font-heading font-bold text-2xl">{student.full_name}</h2>
            <p className="text-gray-500">{student.education_level_display}</p>
            <Badge variant={student.is_active ? 'success' : 'muted'}>{student.is_active ? 'Active' : 'Inactive'}</Badge>
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6">
            <h3 className="font-heading font-bold text-lg mb-4">Student Information</h3>
            <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <Info label="Father Name" value={student.father_name} />
              <Info label="Gender" value={student.gender} />
              <Info label="Date of Birth" value={student.date_of_birth} />
              <Info label="Age" value={student.age} />
              <Info label="Education" value={student.education_level_display} />
              <Info label="Admission Date" value={student.admission_date} />
              <Info label="Guardian" value={student.guardian_name} />
              <Info label="Guardian Contact" value={student.guardian_contact} />
              <Info label="Address" value={student.address} full />
              <Info label="Notes" value={student.notes} full />
            </dl>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Info({ label, value, full }: { label: string; value: any; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <dt className="text-xs uppercase text-gray-500 font-semibold">{label}</dt>
      <dd className="text-gray-900 mt-0.5">{value || '—'}</dd>
    </div>
  );
}
