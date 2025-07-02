"use client"

import { type ReactNode, useState, useRef, useEffect } from "react"

interface DropdownMenuProps {
  children: ReactNode
}

interface DropdownMenuTriggerProps {
  children: ReactNode
  asChild?: boolean
}

interface DropdownMenuContentProps {
  children: ReactNode
  align?: "start" | "end"
  className?: string
}

interface DropdownMenuItemProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{Array.isArray(children) ? children[0] : children}</div>
      {isOpen && Array.isArray(children) && children[1]}
    </div>
  )
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  return <>{children}</>
}

export function DropdownMenuContent({ children, align = "start", className = "" }: DropdownMenuContentProps) {
  const alignClass = align === "end" ? "right-0" : "left-0"

  return (
    <div
      className={`absolute ${alignClass} top-full mt-1 w-48 bg-white rounded-md border border-gray-200 shadow-lg z-50 py-1 animate-in fade-in-0 zoom-in-95 ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, className = "", onClick }: DropdownMenuItemProps) {
  return (
    <div
      className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
