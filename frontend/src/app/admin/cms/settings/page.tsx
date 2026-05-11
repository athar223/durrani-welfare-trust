'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea } from '@/components/admin/FormField';
import { adminApi, mediaUrl } from '@/lib/api';

export default function CMSSettingsPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<any>();
  const currentLogo = watch('current_logo');

  useEffect(() => {
    adminApi.siteSettings.get().then((r) => {
      reset({ ...r.data, current_logo: r.data.logo });
    });
  }, [reset]);

  async function onSubmit(values: any) {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === 'current_logo' || k === 'updated_at' || k === 'id') return;
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (v !== null && v !== undefined && v !== '' && !(v instanceof FileList)) fd.append(k, v as string);
      });
      await adminApi.siteSettings.update(fd, true);
      toast.success('Settings saved');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Site Settings">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-4xl space-y-6">
        <section>
          <h3 className="font-heading font-bold text-lg text-dwt-700 mb-3 pb-2 border-b border-dwt-100">Branding</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Organization Name" name="organization_name" required register={register} errors={errors} />
            <Input label="Tagline" name="tagline" register={register} errors={errors} />
          </div>
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="form-label">Logo</label>
              {currentLogo && <img src={mediaUrl(currentLogo)} alt="" className="w-20 h-20 object-contain mb-2 bg-gray-50 rounded p-2" />}
              <input type="file" accept="image/*" {...register('logo')} className="form-input" />
            </div>
            <div>
              <label className="form-label">Favicon</label>
              <input type="file" accept="image/*" {...register('favicon')} className="form-input" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-heading font-bold text-lg text-dwt-700 mb-3 pb-2 border-b border-dwt-100">Contact Details</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Email" name="email" type="email" register={register} errors={errors} />
            <Input label="Primary Phone" name="phone_primary" register={register} errors={errors} />
            <Input label="Secondary Phone" name="phone_secondary" register={register} errors={errors} />
          </div>
          <Textarea label="Address" name="address" register={register} errors={errors} className="mt-5" />
          <Textarea label="Google Maps Embed URL" name="google_maps_embed" register={register} errors={errors} className="mt-5" hint="Paste the embed URL from Google Maps" />
        </section>

        <section>
          <h3 className="font-heading font-bold text-lg text-dwt-700 mb-3 pb-2 border-b border-dwt-100">Social Media</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Facebook URL" name="facebook_url" register={register} errors={errors} />
            <Input label="Twitter URL" name="twitter_url" register={register} errors={errors} />
            <Input label="Instagram URL" name="instagram_url" register={register} errors={errors} />
            <Input label="YouTube URL" name="youtube_url" register={register} errors={errors} />
            <Input label="LinkedIn URL" name="linkedin_url" register={register} errors={errors} />
          </div>
        </section>

        <section>
          <h3 className="font-heading font-bold text-lg text-dwt-700 mb-3 pb-2 border-b border-dwt-100">SEO</h3>
          <Textarea label="Meta Description" name="meta_description" register={register} errors={errors} />
          <Input label="Meta Keywords" name="meta_keywords" register={register} errors={errors} className="mt-5" hint="Comma-separated" />
        </section>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-3 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
