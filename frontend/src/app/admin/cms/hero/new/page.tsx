'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Checkbox } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

export default function NewHeroPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: { is_active: true, order: 0, cta_primary_text: 'Donate Now', cta_primary_link: '/donate', cta_secondary_text: 'Volunteer', cta_secondary_link: '/volunteer' },
  });

  async function onSubmit(values: any) {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
        else if (v !== null && v !== undefined && v !== '') fd.append(k, v as string);
      });
      await adminApi.heroBanners.create(fd, true);
      toast.success('Banner created');
      router.push('/admin/cms/hero');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add Hero Banner">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <Input label="Title" name="title" required register={register} errors={errors} />
        <Input label="Subtitle" name="subtitle" register={register} errors={errors} className="mt-5" />
        <Textarea label="Description" name="description" register={register} errors={errors} className="mt-5" />
        <div className="mt-5">
          <label className="form-label">Background Image *</label>
          <input type="file" accept="image/*" {...register('background_image', { required: 'Image is required' })} className="form-input" />
          {(errors as any).background_image && <p className="text-red-500 text-xs mt-1">{(errors as any).background_image.message}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <Input label="Primary Button Text" name="cta_primary_text" register={register} errors={errors} />
          <Input label="Primary Button Link" name="cta_primary_link" register={register} errors={errors} />
          <Input label="Secondary Button Text" name="cta_secondary_text" register={register} errors={errors} />
          <Input label="Secondary Button Link" name="cta_secondary_link" register={register} errors={errors} />
          <Input label="Display Order" name="order" type="number" register={register} errors={errors} />
        </div>
        <Checkbox label="Active (show on website)" name="is_active" register={register} className="mt-5" />
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Banner'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
