'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Select, Checkbox } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

const ROLES = [
  {value:'admin',label:'Main Administrator'},{value:'limited_admin',label:'Limited Administrator'},
  {value:'staff',label:'Staff Member'},{value:'volunteer',label:'Volunteer'},
];

export default function NewUserPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: { role: 'staff', is_active: true },
  });

  async function onSubmit(values: any) {
    try {
      await adminApi.users.create(values);
      toast.success('User created');
      router.push('/admin/users');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add User">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-5">
          <Input label="Username" name="username" required register={register} errors={errors} />
          <Input label="Password" name="password" type="password" required register={register} errors={errors} />
          <Input label="First Name" name="first_name" register={register} errors={errors} />
          <Input label="Last Name" name="last_name" register={register} errors={errors} />
          <Input label="Email" name="email" type="email" register={register} errors={errors} />
          <Input label="Phone" name="phone" register={register} errors={errors} />
          <Select label="Role" name="role" required register={register} errors={errors} options={ROLES} />
          <Input label="Allowed Modules" name="allowed_modules" register={register} errors={errors} hint="For Limited Admin (comma-separated, e.g. students,donations)" />
        </div>
        <Checkbox label="Active" name="is_active" register={register} className="mt-5" />
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> Save User
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
