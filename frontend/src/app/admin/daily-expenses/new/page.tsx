'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Select } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

const CATS = [
  {value:'breakfast',label:'Breakfast'},{value:'lunch',label:'Lunch'},{value:'snacks',label:'Snacks'},
  {value:'health_checkup',label:'Health Checkup'},{value:'medicine',label:'Medicine'},
  {value:'cleaning',label:'Cleaning'},{value:'stationery',label:'Stationery'},
  {value:'transport',label:'Transport'},{value:'miscellaneous',label:'Miscellaneous'},
];

export default function NewDailyExpensePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: { category: 'miscellaneous', date: new Date().toISOString().slice(0,10) },
  });

  async function onSubmit(values: any) {
    try {
      await adminApi.dailyExpenses.create(values);
      toast.success('Entry added');
      router.push('/admin/daily-expenses');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add Daily Expense">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-5">
          <Input label="Date" name="date" type="date" required register={register} errors={errors} />
          <Select label="Category" name="category" required register={register} errors={errors} options={CATS} />
          <Input label="Amount (PKR)" name="amount" type="number" step={0.01} required register={register} errors={errors} />
          <Input label="Paid By" name="paid_by" register={register} errors={errors} />
          <Input label="Receipt Number" name="receipt_number" register={register} errors={errors} />
        </div>
        <Textarea label="Description" name="description" register={register} errors={errors} className="mt-5" />
        <Textarea label="Notes" name="notes" register={register} errors={errors} className="mt-5" />
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
