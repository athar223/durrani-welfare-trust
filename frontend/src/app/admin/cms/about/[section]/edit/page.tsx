'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Checkbox } from '@/components/admin/FormField';
import { adminApi, mediaUrl } from '@/lib/api';

export default function EditAboutSectionPage() {
  const { section } = useParams<{ section: string }>();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<any>();
  const currentImage = watch('current_image');

  useEffect(() => {
    if (!section) return;
    adminApi.aboutSections.get(section).then((r) =>
      reset({ ...r.data, current_image: r.data.image, image: undefined })
    );
  }, [section, reset]);

  async function onSubmit(values: any) {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === 'current_image' || k === 'updated_at') return;
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
        else if (v !== null && v !== undefined && v !== '' && !(v instanceof FileList) && k !== 'image') fd.append(k, v as string);
      });
      await adminApi.aboutSections.update(section, fd, true);
      toast.success('Section updated');
      router.push('/admin/cms/about');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Edit About Section">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <Input label="Title" name="title" required register={register} errors={errors} />
        <Textarea label="Content" name="content" required register={register} errors={errors} rows={10} className="mt-5" />
        <div className="mt-5">
          <label className="form-label">Image</label>
          {currentImage && <img src={mediaUrl(currentImage)} alt="" className="w-48 h-32 object-cover rounded mb-2" />}
          <input type="file" accept="image/*" {...register('image')} className="form-input" />
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
