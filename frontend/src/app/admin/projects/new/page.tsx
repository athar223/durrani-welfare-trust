'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Select } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

const STATUS = [{value:'planned',label:'Planned'},{value:'ongoing',label:'Ongoing'},{value:'completed',label:'Completed'},{value:'cancelled',label:'Cancelled'}];
const CATS = [
  {value:'education',label:'Education'},{value:'healthcare',label:'Healthcare'},
  {value:'infrastructure',label:'Infrastructure'},{value:'relief',label:'Relief'},
  {value:'water_sanitation',label:'Water & Sanitation'},{value:'other',label:'Other'},
];

export default function NewProjectPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: { status: 'planned', category: 'education', start_date: new Date().toISOString().slice(0, 10), budget: 0, expenses: 0, beneficiaries_count: 0 },
  });

  async function onSubmit(values: any) {
    try {
      await adminApi.projects.create(values);
      toast.success('Project created');
      router.push('/admin/projects');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add Project">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <Input label="Project Name" name="name" required register={register} errors={errors} />
        <Textarea label="Description" name="description" register={register} errors={errors} className="mt-5" />
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <Input label="Location" name="location" register={register} errors={errors} />
          <Select label="Category" name="category" required register={register} errors={errors} options={CATS} />
          <Input label="Start Date" name="start_date" type="date" required register={register} errors={errors} />
          <Input label="End Date" name="end_date" type="date" register={register} errors={errors} />
          <Input label="Budget (PKR)" name="budget" type="number" step={0.01} required register={register} errors={errors} />
          <Input label="Expenses Spent" name="expenses" type="number" step={0.01} register={register} errors={errors} />
          <Input label="Beneficiaries Count" name="beneficiaries_count" type="number" register={register} errors={errors} />
          <Select label="Status" name="status" required register={register} errors={errors} options={STATUS} />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
