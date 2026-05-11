'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Select, Checkbox } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

const CATS = [
  {value:'news',label:'News'},{value:'announcement',label:'Announcement'},
  {value:'event',label:'Event'},{value:'campaign',label:'Campaign'},{value:'story',label:'Story'},
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function NewNewsPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<any>({
    defaultValues: { is_published: true, is_featured: false, category: 'news', author: 'DWT Team' },
  });
  const title = watch('title');

  async function onSubmit(values: any) {
    try {
      if (!values.slug) values.slug = slugify(values.title);
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
        else if (v !== null && v !== undefined && v !== '') fd.append(k, v as string);
      });
      await adminApi.cmsNews.create(fd, true);
      toast.success('Post created');
      router.push('/admin/cms/news');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="New Post">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-4xl">
        <Input label="Title" name="title" required register={register} errors={errors} />
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <Input label="URL Slug" name="slug" register={register} errors={errors} hint={title ? `Auto: ${slugify(title)}` : 'Leave empty to auto-generate'} />
          <Select label="Category" name="category" required register={register} errors={errors} options={CATS} />
          <Input label="Author" name="author" register={register} errors={errors} />
        </div>
        <Textarea label="Summary" name="summary" register={register} errors={errors} rows={2} className="mt-5" hint="Short preview text" />
        <Textarea label="Content" name="content" required register={register} errors={errors} rows={10} className="mt-5" />
        <div className="mt-5">
          <label className="form-label">Cover Image</label>
          <input type="file" accept="image/*" {...register('cover_image')} className="form-input" />
        </div>
        <div className="flex gap-6 mt-5">
          <Checkbox label="Featured" name="is_featured" register={register} />
          <Checkbox label="Published" name="is_published" register={register} />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
