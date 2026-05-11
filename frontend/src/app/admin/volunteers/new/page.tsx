'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Select } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

const ROLES = [
  {value:'field_worker',label:'Field Worker'},{value:'medical',label:'Medical'},
  {value:'teaching',label:'Teaching'},{value:'coordinator',label:'Coordinator'},
  {value:'fundraiser',label:'Fundraiser'},{value:'other',label:'Other'},
];
const STATUS = [{value:'active',label:'Active'},{value:'inactive',label:'Inactive'},{value:'on_leave',label:'On Leave'}];
const AVAIL = [
  {value:'full_time',label:'Full Time'},{value:'part_time',label:'Part Time'},
  {value:'weekends',label:'Weekends'},{value:'on_call',label:'On Call'},
];

export default function NewVolunteerPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: { status: 'active', role: 'field_worker', availability: 'part_time', joining_date: new Date().toISOString().slice(0,10) },
  });

  async function onSubmit(values: any) {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (v !== null && v !== undefined && v !== '') fd.append(k, v as string);
      });
      await adminApi.volunteers.create(fd, true);
      toast.success('Volunteer added');
      router.push('/admin/volunteers');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add Volunteer">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-5">
          <Input label="Full Name" name="name" required register={register} errors={errors} />
          <Input label="Contact" name="contact" required register={register} errors={errors} />
          <Input label="Email" name="email" type="email" register={register} errors={errors} />
          <Select label="Role" name="role" register={register} errors={errors} options={ROLES} />
          <Select label="Status" name="status" register={register} errors={errors} options={STATUS} />
          <Select label="Availability" name="availability" register={register} errors={errors} options={AVAIL} />
          <Input label="Joining Date" name="joining_date" type="date" required register={register} errors={errors} />
        </div>
        <Textarea label="Address" name="address" register={register} errors={errors} className="mt-5" />
        <Textarea label="Skills / Areas of Interest" name="skills" register={register} errors={errors} className="mt-5" />
        <div className="mt-5">
          <label className="form-label">Profile Image</label>
          <input type="file" accept="image/*" {...register('profile_image')} className="form-input" />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Volunteer'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
