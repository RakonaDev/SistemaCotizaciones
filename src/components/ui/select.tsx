import type React from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options: { value: string | number | undefined; label: string }[]
  placeholder?: string
}

export const Select: React.FC<SelectProps> = ({ error, options, placeholder, className = "", ...props }) => {
  return (
    <select
      className={`
        w-full px-3 py-2.5 text-sm
        border rounded-lg
        bg-white
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-300 hover:border-slate-400"
        }
        text-slate-900
        ${className}
      `}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
