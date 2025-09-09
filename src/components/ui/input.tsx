'use client'

import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  label?: string
}

export const Input: React.FC<InputProps> = ({ error, label, className = "", ...props }) => {
  console.log(label)
  return (
    <input
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
        ${props.readOnly ? "bg-slate-50 text-slate-600 cursor-not-allowed" : "text-slate-900"}
        ${className}
      `}
      {...props}
    />
  )
}
