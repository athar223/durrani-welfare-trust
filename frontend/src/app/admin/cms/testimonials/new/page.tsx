'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Checkbox } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

export default function NewTestimonialPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: { is_active: true, order: 0 },
  });

  async function onSubmit(values: any) {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
        else if (v !== null && v !== undefined && v !== '') fd.append(k, v as string);
      });
      await adminApi.testimonials.create(fd, true);
      toast.success('Testimonial added');
      router.push('/admin/cms/testimonials');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add Testimonial">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <Input label="Name" name="name" required register={register} errors={errors} />
        <Input label="Role / Location" name="role" register={register} errors={errors} className="mt-5" hint='e.g. "Orphan Girl, Konodas" or "Volunteer"' />
        <Textarea label="Quote" name="quote" required register={register} errors={errors} rows={4} className="mt-5" />
        <Input label="Display Order" name="order" type="number" register={register} errors={errors} className="mt-5" />
        <div className="mt-5">
          <label className="form-label">Photo (optional)</label>
          <input type="file" accept="image/*" {...register('photo')} className="form-input" />
        </div>
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
