'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Send, Mail, Phone, MapPin, Clock, CheckCircle, MessageCircle } from 'lucide-react';
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

const contactCards = [
  {
    icon: Phone,
    title: 'Call / WhatsApp',
    lines: ['03129700108'],
    href: 'tel:03129700108',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['duraniwelfaretrust@gmail.com'],
    href: 'mailto:duraniwelfaretrust@gmail.com',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: MapPin,
    title: 'Address',
    lines: ['Konodas, Gilgit-Baltistan', 'Pakistan'],
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    lines: ['Mon – Sat: 9:00 AM – 6:00 PM', 'Ambulance: 24 / 7'],
    color: 'bg-amber-50 text-amber-600',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await publicApi.submitContact(values);
      toast.success('Message sent!');
      setSubmitted(true);
      reset();
    } catch {
      toast.error('Could not send message. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicLayout>
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you — reach out by phone, email, or the form below"
        breadcrumb="Contact"
        image="/gallery/orphanage-girls.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-page">

          {/* Contact cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-card transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-base mb-2">{card.title}</h3>
                  {card.lines.map((line, i) =>
                    card.href && i === 0 ? (
                      <a key={line} href={card.href} className="block text-sm text-dwt-600 font-semibold hover:text-dwt-800 transition-colors">
                        {line}
                      </a>
                    ) : (
                      <p key={line} className="text-sm text-gray-600">{line}</p>
                    )
                  )}
                </div>
              );
            })}
          </div>

          {/* Form + info */}
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Left: extra info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-dwt-800 rounded-2xl p-8 text-white">
                <MessageCircle className="text-dwt-300 mb-4" size={36} />
                <h3 className="font-heading font-bold text-xl mb-3">Quick Help</h3>
                <ul className="space-y-4 text-sm">
                  {[
                    { q: 'Enroll an orphan girl', a: 'Call 03129700108 or use our Enrollment form.' },
                    { q: 'Emergency ambulance', a: '24/7 free ambulance - call 03129700108 immediately.' },
                    { q: 'Make a donation', a: 'Visit our Donate page or transfer directly via the bank details shown there.' },
                    { q: 'Volunteer with us', a: 'Fill the Volunteer form - we would love to have you.' },
                  ].map((item) => (
                    <li key={item.q}>
                      <div className="font-semibold text-dwt-200">{item.q}</div>
                      <div className="text-gray-300 mt-0.5">{item.a}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-heading font-bold text-lg mb-3 text-dwt-800">Location</h3>
                <p className="text-sm text-gray-600 mb-2">Konodas, Gilgit-Baltistan, Pakistan</p>
                <p className="text-xs text-gray-500">
                  The Trust primarily operates across Gilgit-Baltistan.
                  For in-person visits please call ahead to confirm availability.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dwt-50 flex items-center justify-center text-dwt-500">
                      <CheckCircle size={48} />
                    </div>
                    <h2 className="font-heading font-bold text-2xl mb-3">Message Sent!</h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for reaching out. We will reply within 24 hours.<br />
                      For urgent matters please call <a href="tel:03129700108" className="text-dwt-600 font-bold">03129700108</a>.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading font-bold text-2xl mb-1">Send Us a Message</h2>
                    <p className="text-sm text-gray-500 mb-8">We'll get back to you within 24 hours.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="form-label">Full Name *</label>
                          <input type="text" {...register('name', { required: 'Required' })} className="form-input" placeholder="Your name" />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="form-label">Email *</label>
                          <input type="email" {...register('email', { required: 'Required' })} className="form-input" placeholder="your@email.com" />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="form-label">Phone</label>
                          <input type="tel" {...register('phone')} className="form-input" placeholder="03XX XXXXXXX" />
                        </div>
                        <div>
                          <label className="form-label">Subject *</label>
                          <input type="text" {...register('subject', { required: 'Required' })} className="form-input" placeholder="How can we help?" />
                          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Message *</label>
                        <textarea {...register('message', { required: 'Required' })} rows={5} className="form-input" placeholder="Tell us what you'd like to discuss..." />
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-dwt-500 text-white font-semibold rounded-lg hover:bg-dwt-600 transition-all disabled:opacity-50"
                      >
                        <Send size={18} />
                        {submitting ? 'Sending…' : 'Send Message'}
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
