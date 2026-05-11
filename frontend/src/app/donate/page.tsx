'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Heart, Send, CheckCircle } from 'lucide-react';
import { publicApi } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

interface FormValues {
  donor_name: string;
  contact: string;
  email: string;
  amount: number;
  category: string;
  payment_method: string;
  reference_number: string;
  notes: string;
  is_anonymous: boolean;
}

const presetAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <DonateForm />
    </Suspense>
  );
}

function DonateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignSlug = searchParams.get('campaign');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      category: 'general',
      payment_method: 'bank_transfer',
      is_anonymous: false,
    },
  });

  const currentAmount = watch('amount');

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await publicApi.submitDonation({ ...values, amount: Number(values.amount) });
      toast.success('Donation pledge received! We will contact you shortly.');
      setSubmitted(true);
      reset();
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
        <PageHeader title="Thank You!" breadcrumb="Donation" />
        <section className="section-padding bg-white">
          <div className="container-page max-w-2xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
              <CheckCircle size={48} />
            </div>
            <h2 className="font-heading font-bold text-3xl mb-4">Donation Received</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Thank you for your generous contribution. Our team will verify your donation and
              send you a confirmation receipt shortly.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setSubmitted(false)} className="btn-secondary">
                Donate Again
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
        title="Make a Donation"
        subtitle="Your contribution helps us continue our mission of serving humanity"
        breadcrumb="Donate"
      />

      <section className="section-padding bg-gray-50">
        <div className="container-page max-w-3xl">
          <div className="card p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <Heart size={24} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl">Donation Form</h2>
                <p className="text-sm text-gray-600">All donations are tax-deductible</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Quick amounts */}
              <div>
                <label className="form-label">Choose Amount (PKR) *</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setValue('amount', amt)}
                      className={`px-4 py-3 rounded-lg border-2 font-bold transition-all ${
                        currentAmount == amt
                          ? 'border-dwt-500 bg-dwt-50 text-dwt-700'
                          : 'border-gray-200 hover:border-dwt-300'
                      }`}
                    >
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  {...register('amount', { required: 'Amount is required', min: 1 })}
                  className="form-input"
                  placeholder="Or enter custom amount"
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="form-label">Donation Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    ['general', 'General'],
                    ['zakat', 'Zakat'],
                    ['sadqa', 'Sadqa'],
                    ['fitrana', 'Fitrana'],
                    ['education', 'Education'],
                    ['healthcare', 'Healthcare'],
                    ['other', 'Other'],
                  ].map(([val, label]) => (
                    <label key={val} className="cursor-pointer">
                      <input
                        type="radio"
                        value={val}
                        {...register('category')}
                        className="peer sr-only"
                      />
                      <div className="px-3 py-2.5 text-center text-sm font-semibold rounded-lg border-2 border-gray-200 peer-checked:border-dwt-500 peer-checked:bg-dwt-50 peer-checked:text-dwt-700 transition-all">
                        {label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    {...register('donor_name', { required: 'Required' })}
                    className="form-input"
                  />
                  {errors.donor_name && <p className="text-red-500 text-xs mt-1">{errors.donor_name.message}</p>}
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input type="tel" {...register('contact')} className="form-input" />
                </div>
              </div>

              <div>
                <label className="form-label">Email</label>
                <input type="email" {...register('email')} className="form-input" />
              </div>

              <div>
                <label className="form-label">Payment Method *</label>
                <select {...register('payment_method', { required: true })} className="form-input">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>

              <div>
                <label className="form-label">Reference Number (if available)</label>
                <input
                  type="text"
                  {...register('reference_number')}
                  className="form-input"
                  placeholder="Bank transfer ID, cheque number, etc."
                />
              </div>

              <div>
                <label className="form-label">Notes / Message</label>
                <textarea {...register('notes')} rows={3} className="form-input" />
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_anonymous')}
                  className="w-4 h-4 text-dwt-500"
                />
                <span className="text-sm text-gray-700">I wish to remain anonymous</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary disabled:opacity-50"
              >
                <Send size={18} className="mr-2" />
                {submitting ? 'Submitting...' : 'Submit Donation'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Note: This form records your donation pledge. Our team will verify and confirm
                receipt of funds via your chosen payment method.
              </p>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
