'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Select, Checkbox } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

export default function NewStudentPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: { is_active: true, gender: 'male', education_level: 'primary', admission_date: new Date().toISOString().slice(0, 10) },
  });

  async function onSubmit(values: any) {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
        else if (v !== null && v !== undefined && v !== '') fd.append(k, v as string);
      });
      await adminApi.students.create(fd, true);
      toast.success('Student added');
      router.push('/admin/students');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add Student">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-5">
          <Input label="First Name" name="first_name" required register={register} errors={errors} />
          <Input label="Last Name" name="last_name" required register={register} errors={errors} />
          <Input label="Father Name" name="father_name" register={register} errors={errors} />
          <Select label="Gender" name="gender" register={register} errors={errors}
            options={[{value:'male',label:'Male'},{value:'female',label:'Female'},{value:'other',label:'Other'}]} />
          <Input label="Date of Birth" name="date_of_birth" type="date" register={register} errors={errors} />
          <Input label="Age" name="age" type="number" register={register} errors={errors} />
          <Select label="Education Level" name="education_level" required register={register} errors={errors}
            options={[
              {value:'pre_primary',label:'Pre-Primary'},
              {value:'primary',label:'Primary (1-5)'},
              {value:'middle',label:'Middle (6-8)'},
              {value:'secondary',label:'Secondary (9-10)'},
              {value:'higher_secondary',label:'Higher Secondary'},
              {value:'college',label:'College / University'},
            ]} />
          <Input label="Admission Date" name="admission_date" type="date" required register={register} errors={errors} />
          <Input label="Guardian Name" name="guardian_name" register={register} errors={errors} />
          <Input label="Guardian Contact" name="guardian_contact" register={register} errors={errors} />
        </div>
        <Textarea label="Address" name="address" register={register} errors={errors} className="mt-5" />
        <Textarea label="Notes" name="notes" register={register} errors={errors} className="mt-5" />
        <div className="mt-5">
          <label className="form-label">Profile Image</label>
          <input type="file" accept="image/*" {...register('profile_image')} className="form-input" />
        </div>
        <Checkbox label="Active Student" name="is_active" register={register} className="mt-5" />
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Student'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
