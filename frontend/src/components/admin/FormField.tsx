import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface BaseProps {
  label: string;
  name: string;
  required?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  placeholder?: string;
  className?: string;
  hint?: string;
}

interface InputProps extends BaseProps {
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'password';
  min?: number;
  step?: number;
}

export function Input({ label, name, required, register, errors, placeholder, type = 'text', min, step, className, hint }: InputProps) {
  const err: any = errors?.[name];
  return (
    <div className={className}>
      <label className="form-label">{label}{required && ' *'}</label>
      <input
        type={type}
        {...register(name, { required: required ? `${label} is required` : false, valueAsNumber: type === 'number' })}
        placeholder={placeholder}
        min={min}
        step={step}
        className="form-input"
      />
      {hint && !err && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {err && <p className="text-red-500 text-xs mt-1">{err.message as string}</p>}
    </div>
  );
}

interface TextareaProps extends BaseProps {
  rows?: number;
}

export function Textarea({ label, name, required, register, errors, placeholder, rows = 3, className, hint }: TextareaProps) {
  const err: any = errors?.[name];
  return (
    <div className={className}>
      <label className="form-label">{label}{required && ' *'}</label>
      <textarea
        {...register(name, { required: required ? `${label} is required` : false })}
        placeholder={placeholder}
        rows={rows}
        className="form-input"
      />
      {hint && !err && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {err && <p className="text-red-500 text-xs mt-1">{err.message as string}</p>}
    </div>
  );
}

interface SelectProps extends BaseProps {
  options: { value: string; label: string }[];
}

export function Select({ label, name, required, register, errors, options, className, hint }: SelectProps) {
  const err: any = errors?.[name];
  return (
    <div className={className}>
      <label className="form-label">{label}{required && ' *'}</label>
      <select {...register(name, { required: required ? `${label} is required` : false })} className="form-input">
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && !err && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {err && <p className="text-red-500 text-xs mt-1">{err.message as string}</p>}
    </div>
  );
}

interface CheckboxProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  className?: string;
}

export function Checkbox({ label, name, register, className }: CheckboxProps) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${className || ''}`}>
      <input type="checkbox" {...register(name)} className="w-4 h-4 text-dwt-500" />
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </label>
  );
}
