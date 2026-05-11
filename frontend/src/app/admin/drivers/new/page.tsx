'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Select, Checkbox } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

const SHIFTS = [
  {value:'morning',label:'Morning'},{value:'evening',label:'Evening'},
  {value:'night',label:'Night'},{value:'rotating',label:'Rotating'},
];

export default function NewDriverPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: { is_active: true, shift: 'morning', joining_date: new Date().toISOString().slice(0,10), base_salary: 0 },
  });

  async function onSubmit(values: any) {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
        else if (v !== null && v !== undefined && v !== '') fd.append(k, v as string);
      });
      await adminApi.drivers.create(fd, true);
      toast.success('Driver added');
      router.push('/admin/drivers');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add Driver">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-5">
          <Input label="Full Name" name="name" required register={register} errors={errors} />
          <Input label="Contact" name="contact" required register={register} errors={errors} />
          <Input label="Email" name="email" type="email" register={register} errors={errors} />
          <Input label="License Number" name="license_number" register={register} errors={errors} />
          <Input label="License Expiry" name="license_expiry" type="date" register={register} errors={errors} />
          <Input label="Vehicle Assigned" name="vehicle_assigned" register={register} errors={errors} />
          <Select label="Shift" name="shift" register={register} errors={errors} options={SHIFTS} />
          <Input label="Joining Date" name="joining_date" type="date" required register={register} errors={errors} />
          <Input label="Base Salary (PKR)" name="base_salary" type="number" step={0.01} register={register} errors={errors} />
        </div>
        <Textarea label="Address" name="address" register={register} errors={errors} className="mt-5" />
        <div className="mt-5">
          <label className="form-label">Profile Image</label>
          <input type="file" accept="image/*" {...register('profile_image')} className="form-input" />
        </div>
        <Checkbox label="Active Driver" name="is_active" register={register} className="mt-5" />
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Driver'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
