'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Checkbox } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

export default function EditStatisticPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<any>();

  useEffect(() => {
    if (!id) return;
    adminApi.statistics.get(id).then((r) => reset(r.data));
  }, [id, reset]);

  async function onSubmit(values: any) {
    try {
      await adminApi.statistics.update(id, values);
      toast.success('Statistic updated');
      router.push('/admin/cms/stats');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Edit Statistic">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-2xl">
        <Input label="Value" name="value" required register={register} errors={errors} />
        <Input label="Label" name="label" required register={register} errors={errors} className="mt-5" />
        <Input label="Icon (Lucide name)" name="icon" register={register} errors={errors} className="mt-5" />
        <Input label="Display Order" name="order" type="number" register={register} errors={errors} className="mt-5" />
        <div className="flex gap-6 mt-5">
          <Checkbox label="Active" name="is_active" register={register} />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> Save
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
