'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Edit, ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Badge from '@/components/admin/Badge';
import { adminApi, mediaUrl } from '@/lib/api';

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    adminApi.staff.get(Number(id)).then((r) => setStaff(r.data)).finally(() => setLoading(false));
  }, [id]);

  return (
    <AdminLayout title={staff ? staff.full_name : 'Staff'} actions={
      staff && (
        <Link href={`/admin/staff/${id}/edit`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-dwt-500 text-white rounded-lg">
          <Edit size={14} /> Edit
        </Link>
      )
    }>
      <Link href="/admin/staff" className="inline-flex items-center gap-1 text-sm text-gray-600 mb-4"><ArrowLeft size={14} /> Back</Link>
      {loading || !staff ? (
        <div className="py-20 text-center"><div className="w-10 h-10 border-4 border-dwt-200 border-t-dwt-500 rounded-full animate-spin mx-auto" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            {staff.profile_image ? (
              <img src={mediaUrl(staff.profile_image)} alt="" className="w-32 h-32 rounded-full mx-auto object-cover mb-4" />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto bg-dwt-500 text-white flex items-center justify-center font-heading font-bold text-3xl mb-4">
                {staff.first_name?.[0]}{staff.last_name?.[0]}
              </div>
            )}
            <h2 className="font-heading font-bold text-2xl">{staff.full_name}</h2>
            <p className="text-gray-500">{staff.role_display}</p>
            <Badge variant={staff.is_active ? 'success' : 'muted'}>{staff.is_active ? 'Active' : 'Inactive'}</Badge>
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6">
            <h3 className="font-heading font-bold text-lg mb-4">Staff Information</h3>
            <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <Info label="Role" value={staff.role_display} />
              <Info label="Contact" value={staff.contact_number} />
              <Info label="Email" value={staff.email} />
              <Info label="Joining Date" value={staff.joining_date} />
              <Info label="Supervisor" value={staff.supervisor} />
              <Info label="Base Salary" value={`PKR ${Number(staff.base_salary).toLocaleString()}`} />
              <Info label="Address" value={staff.address} full />
              <Info label="Notes" value={staff.notes} full />
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
