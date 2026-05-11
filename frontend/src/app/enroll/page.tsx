'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { GraduationCap, Send, CheckCircle } from 'lucide-react';
import { publicApi } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

interface FormValues {
  full_name: string;
  father_name: string;
  cnic_or_bform: string;
  gender: string;
  date_of_birth: string;
  grade: string;
  school_name: string;
  previous_education: string;
  address: string;
  district: string;
  city: string;
  parent_phone: string;
  whatsapp_number: string;
  email: string;
  financial_status: string;
  scholarship_required: boolean;
  reason_for_support: string;
}

export default function EnrollPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [docs, setDocs] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (typeof v === 'boolean') formData.append(k, v ? 'true' : 'false');
      else formData.append(k, v ?? '');
    });
    if (photo) formData.append('profile_photo', photo);
    if (docs) formData.append('documents', docs);

    try {
      await publicApi.submitStudentApplication(formData);
      toast.success('Application submitted successfully!');
      setSubmitted(true);
      reset();
      setPhoto(null);
      setDocs(null);
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
        <PageHeader title="Thank You!" breadcrumb="Student Enrollment" />
        <section className="section-padding bg-white">
          <div className="container-page max-w-2xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
              <CheckCircle size={48} />
            </div>
            <h2 className="font-heading font-bold text-3xl mb-4">Application Received</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Thank you for applying to Durrani Welfare Trust's student support program. Our team
              will review the application and contact you within 7 working days.
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
        title="Student Enrollment"
        subtitle="Apply for educational support, scholarships, and student programs"
        breadcrumb="Get Involved"
      />

      <section className="section-padding bg-gray-50">
        <div className="container-page max-w-4xl">
          <div className="card p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
                <GraduationCap size={24} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl">Enrollment Application</h2>
                <p className="text-sm text-gray-600">Fields marked * are required</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Student Details */}
              <div>
                <h3 className="font-heading font-bold text-lg text-dwt-700 mb-4 pb-2 border-b border-dwt-100">
                  Student Details
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      {...register('full_name', { required: 'Required' })}
                      className="form-input"
                    />
                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Father's Name *</label>
                    <input
                      type="text"
                      {...register('father_name', { required: 'Required' })}
                      className="form-input"
                    />
                    {errors.father_name && <p className="text-red-500 text-xs mt-1">{errors.father_name.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">CNIC / B-Form</label>
                    <input
                      type="text"
                      {...register('cnic_or_bform')}
                      className="form-input"
                      placeholder="12345-1234567-1"
                    />
                  </div>
                  <div>
                    <label className="form-label">Gender *</label>
                    <select {...register('gender', { required: 'Required' })} className="form-input">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Date of Birth *</label>
                    <input
                      type="date"
                      {...register('date_of_birth', { required: 'Required' })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Class / Grade</label>
                    <input
                      type="text"
                      {...register('grade')}
                      className="form-input"
                      placeholder="e.g., Class 5"
                    />
                  </div>
                  <div>
                    <label className="form-label">School / College Name</label>
                    <input type="text" {...register('school_name')} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Previous Education</label>
                    <input
                      type="text"
                      {...register('previous_education')}
                      className="form-input"
                      placeholder="e.g., Passed Class 4 from..."
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="form-label">Address *</label>
                  <textarea
                    {...register('address', { required: 'Required' })}
                    rows={2}
                    className="form-input"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="form-label">District</label>
                    <input type="text" {...register('district')} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <input type="text" {...register('city')} className="form-input" />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="form-label">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="font-heading font-bold text-lg text-dwt-700 mb-4 pb-2 border-b border-dwt-100">
                  Contact Details
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Parent Phone Number *</label>
                    <input
                      type="tel"
                      {...register('parent_phone', { required: 'Required' })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">WhatsApp Number</label>
                    <input type="tel" {...register('whatsapp_number')} className="form-input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Email Address</label>
                    <input type="email" {...register('email')} className="form-input" />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="font-heading font-bold text-lg text-dwt-700 mb-4 pb-2 border-b border-dwt-100">
                  Additional Details
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Financial Status</label>
                    <select {...register('financial_status')} className="form-input">
                      <option value="">Select</option>
                      <option value="low_income">Low Income</option>
                      <option value="middle_income">Middle Income</option>
                      <option value="orphan">Orphan</option>
                      <option value="single_parent">Single Parent</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-7">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('scholarship_required')}
                        className="w-4 h-4 text-dwt-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">Scholarship Required</span>
                    </label>
                  </div>
                </div>
                <div className="mt-5">
                  <label className="form-label">Reason for Support</label>
                  <textarea
                    {...register('reason_for_support')}
                    rows={4}
                    className="form-input"
                    placeholder="Please describe why you need our support..."
                  />
                </div>
                <div className="mt-5">
                  <label className="form-label">Documents (CNIC, results, etc.)</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setDocs(e.target.files?.[0] || null)}
                    className="form-input"
                  />
                </div>
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
