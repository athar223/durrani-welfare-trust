'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Select } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

const CATS = [
  {value:'general',label:'General'},{value:'zakat',label:'Zakat'},{value:'sadqa',label:'Sadqa'},
  {value:'fitrana',label:'Fitrana'},{value:'education',label:'Education'},
  {value:'healthcare',label:'Healthcare'},{value:'other',label:'Other'},
];
const METHODS = [
  {value:'cash',label:'Cash'},{value:'bank_transfer',label:'Bank Transfer'},
  {value:'cheque',label:'Cheque'},{value:'online',label:'Online'},
];

export default function NewDonationPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: { category: 'general', payment_method: 'cash', date: new Date().toISOString().slice(0, 10) },
  });

  async function onSubmit(values: any) {
    try {
      await adminApi.donations.create(values);
      toast.success('Donation recorded');
      router.push('/admin/donations');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add Donation">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-5">
          <Input label="Donor Name" name="donor_name" required register={register} errors={errors} />
          <Input label="Amount (PKR)" name="amount" type="number" step={0.01} required register={register} errors={errors} />
          <Input label="Contact" name="contact" register={register} errors={errors} />
          <Input label="Email" name="email" type="email" register={register} errors={errors} />
          <Input label="Date" name="date" type="date" required register={register} errors={errors} />
          <Select label="Category" name="category" required register={register} errors={errors} options={CATS} />
          <Select label="Payment Method" name="payment_method" required register={register} errors={errors} options={METHODS} />
          <Input label="Reference Number" name="reference_number" register={register} errors={errors} />
        </div>
        <Textarea label="Notes" name="notes" register={register} errors={errors} className="mt-5" />
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Donation'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
