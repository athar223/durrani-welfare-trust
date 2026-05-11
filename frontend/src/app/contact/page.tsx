'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Send, Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';
import { publicApi } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import PublicLayout from '@/components/PublicLayout';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await publicApi.submitContact(values);
      toast.success('Message sent successfully!');
      setSubmitted(true);
      reset();
    } catch (err: any) {
      toast.error('Failed to send message');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicLayout>
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch with us — we'd love to hear from you"
        breadcrumb="Contact"
      />

      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-6">
              <div className="card p-6">
                <div className="w-12 h-12 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500 mb-3">
                  <Mail size={24} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1">Email</h3>
                <p className="text-sm text-gray-600">info@duraniwelfaretrust.org</p>
              </div>
              <div className="card p-6">
                <div className="w-12 h-12 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500 mb-3">
                  <Phone size={24} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1">Phone</h3>
                <p className="text-sm text-gray-600">+92 300 1234567</p>
                <p className="text-sm text-gray-600">+92 21 1234567</p>
              </div>
              <div className="card p-6">
                <div className="w-12 h-12 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500 mb-3">
                  <MapPin size={24} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1">Address</h3>
                <p className="text-sm text-gray-600">Durrani Welfare Trust Office, Pakistan</p>
              </div>
              <div className="card p-6">
                <div className="w-12 h-12 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500 mb-3">
                  <Clock size={24} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1">Office Hours</h3>
                <p className="text-sm text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM</p>
                <p className="text-sm text-gray-600">Sunday: Closed</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card p-8 md:p-10">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
                      <CheckCircle size={48} />
                    </div>
                    <h2 className="font-heading font-bold text-2xl mb-3">Message Sent!</h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. We'll respond to your message shortly.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="btn-primary">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading font-bold text-2xl mb-2">Send Us a Message</h2>
                    <p className="text-sm text-gray-600 mb-8">We'll get back to you within 24 hours</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="form-label">Name *</label>
                          <input
                            type="text"
                            {...register('name', { required: 'Required' })}
                            className="form-input"
                          />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="form-label">Email *</label>
                          <input
                            type="email"
                            {...register('email', { required: 'Required' })}
                            className="form-input"
                          />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Phone</label>
                        <input type="tel" {...register('phone')} className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">Subject *</label>
                        <input
                          type="text"
                          {...register('subject', { required: 'Required' })}
                          className="form-input"
                        />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                      </div>
                      <div>
                        <label className="form-label">Message *</label>
                        <textarea
                          {...register('message', { required: 'Required' })}
                          rows={6}
                          className="form-input"
                        />
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary disabled:opacity-50"
                      >
                        <Send size={18} className="mr-2" />
                        {submitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
