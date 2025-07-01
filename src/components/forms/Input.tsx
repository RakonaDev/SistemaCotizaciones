
'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  errores?: any[]
  touched?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, errores, error, touched, ...props }, ref) => {
  const isDisabled = props.disabled

  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${isDisabled ? 'text-gray-400' : 'text-secondary'}`}>{label}</label>
      <div className="relative">
        <input
          className={`
              w-full pl-3 pr-4 py-3 rounded-lg placeholder-primary focus:outline-none
              transition-all duration-300
              bg-slate-200 text-secondary
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400
              ${className || ''}
            `}
          // className="w-full pl-12 pr-4 py-3 bg-slate-200 rounded-lg text-secondary placeholder-primary focus:outline-none  transition-all duration-300"
          {...props}
        />
      </div>
      {
        error && touched && (
          <span className="text-xs text-red-400 italic">{error}</span>
        )
      }
      {
        errores && errores?.map((item, index) => (
          <span key={index} className="text-xs text-red-400 italic">{item}</span>
        ))
      }
    </div>
  )
})

Input.displayName = "Input"

export { Input }
