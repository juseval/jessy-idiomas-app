import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
}

export function TextInput({ id, label, className = '', ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        className={`min-h-12 rounded-lg border border-line bg-white px-3.5 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${className}`}
        {...props}
      />
    </div>
  )
}
