'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Select } from '@/components/admin/FormField';
import { adminApi } from '@/lib/api';

const TYPES = [{value:'staff',label:'Staff'},{value:'driver',label:'Driver'}];
const STATUS = [{value:'pending',label:'Pending'},{value:'paid',label:'Paid'},{value:'cancelled',label:'Cancelled'}];
const METHODS = [{value:'cash',label:'Cash'},{value:'bank_transfer',label:'Bank Transfer'},{value:'cheque',label:'Cheque'}];

export default function NewSalaryPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: {
      employee_type: 'staff', status: 'pending',
      month: new Date().toISOString().slice(0, 7) + '-01',
      base_salary: 0, allowances: 0, deductions: 0, bonus: 0, overtime_hours: 0, overtime_rate: 0,
    },
  });

  async function onSubmit(values: any) {
    try {
      await adminApi.salaries.create(values);
      toast.success('Salary record created');
      router.push('/admin/salaries');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Add Salary Record">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-5">
          <Select label="Employee Type" name="employee_type" required register={register} errors={errors} options={TYPES} />
          <Input label="Employee Name" name="employee_name" required register={register} errors={errors} />
          <Input label="Employee ID" name="employee_id" type="number" register={register} errors={errors} />
          <Input label="Month" name="month" type="date" required register={register} errors={errors} hint="First day of the month (e.g. 2026-05-01)" />
          <Input label="Base Salary" name="base_salary" type="number" step={0.01} required register={register} errors={errors} />
          <Input label="Allowances" name="allowances" type="number" step={0.01} register={register} errors={errors} />
          <Input label="Deductions" name="deductions" type="number" step={0.01} register={register} errors={errors} />
          <Input label="Bonus" name="bonus" type="number" step={0.01} register={register} errors={errors} />
          <Input label="Overtime Hours" name="overtime_hours" type="number" step={0.01} register={register} errors={errors} />
          <Input label="Overtime Rate / hr" name="overtime_rate" type="number" step={0.01} register={register} errors={errors} />
          <Select label="Status" name="status" required register={register} errors={errors} options={STATUS} />
          <Select label="Payment Method" name="payment_method" register={register} errors={errors} options={METHODS} />
          <Input label="Payment Date" name="payment_date" type="date" register={register} errors={errors} />
        </div>
        <Textarea label="Notes" name="notes" register={register} errors={errors} className="mt-5" />
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Salary'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
