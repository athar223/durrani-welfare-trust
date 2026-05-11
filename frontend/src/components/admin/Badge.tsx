import clsx from 'clsx';

type Variant = 'success' | 'danger' | 'warning' | 'info' | 'muted' | 'primary';

const styles: Record<Variant, string> = {
  success: 'bg-green-100 text-green-800',
  danger: 'bg-rose-100 text-rose-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-blue-100 text-blue-800',
  muted: 'bg-gray-100 text-gray-700',
  primary: 'bg-dwt-100 text-dwt-800',
};

export default function Badge({ children, variant = 'muted' }: { children: React.ReactNode; variant?: Variant }) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', styles[variant])}>
      {children}
    </span>
  );
}

export function statusVariant(status: string): Variant {
  const s = status?.toLowerCase();
  if (['active', 'present', 'paid', 'confirmed', 'approved', 'enrolled', 'completed', 'ongoing'].includes(s)) return 'success';
  if (['inactive', 'absent', 'rejected', 'cancelled'].includes(s)) return 'danger';
  if (['leave', 'pending', 'planned', 'on_leave'].includes(s)) return 'warning';
  return 'muted';
}
