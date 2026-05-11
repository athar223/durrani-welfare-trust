'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Users, Send, CheckCircle } from 'lucide-react';
import { publicApi } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

interface FormValues {
  full_name: string;
  cnic: string;
  phone: string;
  email: string;
  address: string;
  skills: string;
  availability: string;
}

export default function VolunteerPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v ?? ''));
    if (photo) formData.append('profile_photo', photo);

    try {
      await publicApi.submitVolunteerApplication(formData);
      toast.success('Application submitted successfully!');
      setSubmitted(true);
      reset();
      setPhoto(null);
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Submission failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <PublicLayout>
        <PageHeader title="Thank You!" breadcrumb="Volunteer" />
        <section className="section-padding bg-white">
          <div className="container-page max-w-2xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
              <CheckCircle size={48} />
            </div>
            <h2 className="font-heading font-bold text-3xl mb-4">Application Received</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Thank you for your interest in volunteering with Durrani Welfare Trust. Our team will
              review your application and contact you shortly.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setSubmitted(false)} className="btn-secondary">
                Submit Another
              </button>
              <button onClick={() => router.push('/')} className="btn-primary">
                Back to Home
              </button>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <PageHeader
        title="Become a Volunteer"
        subtitle="Join our team of dedicated volunteers and help us make a difference in the community"
        breadcrumb="Get Involved"
      />

      <section className="section-padding bg-gray-50">
        <div className="container-page max-w-3xl">
          <div className="card p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
                <Users size={24} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl">Volunteer Registration Form</h2>
                <p className="text-sm text-gray-600">Fields marked * are required</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    {...register('full_name', { required: 'Full name is required' })}
                    className="form-input"
                    placeholder="Your full name"
                  />
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
                </div>
                <div>
                  <label className="form-label">CNIC</label>
                  <input
                    type="text"
                    {...register('cnic')}
                    className="form-input"
                    placeholder="12345-1234567-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone is required' })}
                    className="form-input"
                    placeholder="+92 300 1234567"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="form-input"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Address</label>
                <textarea
                  {...register('address')}
                  rows={2}
                  className="form-input"
                  placeholder="Your residential address"
                />
              </div>

              <div>
                <label className="form-label">Skills / Areas of Interest</label>
                <textarea
                  {...register('skills')}
                  rows={3}
                  className="form-input"
                  placeholder="e.g., Teaching, Medical, Field Work, Fundraising..."
                />
              </div>

              <div>
                <label className="form-label">Availability</label>
                <select {...register('availability')} className="form-input">
                  <option value="">Select availability</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="weekends">Weekends Only</option>
                  <option value="on_call">On Call / As Needed</option>
                </select>
              </div>

              <div>
                <label className="form-label">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary disabled:opacity-50"
              >
                <Send size={18} className="mr-2" />
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
