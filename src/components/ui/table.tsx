/*
import type { ReactNode, HTMLAttributes } from "react"

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode
}

export function Table({ children, className = "", ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className = "", ...props }: TableProps) {
  return (
    <thead className={`[&_tr]:border-b ${className}`} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = "", ...props }: TableProps) {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = "", ...props }: TableProps) {
  return (
    <tr
      className={`border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50 ${className}`}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, className = "", ...props }: TableProps) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className = "", ...props }: TableProps) {
  return (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
    </td>
  )
}
*/

import type { ReactNode, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes , TableHTMLAttributes } from "react"

// Propiedades para el componente Table (que renderiza <table>)
interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

// Propiedades para el componente TableHeader (que renderiza <thead>)
// HTMLTableSectionElement es el tipo para <thead>, <tbody>, <tfoot>
interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

// Propiedades para el componente TableBody (que renderiza <tbody>)
interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

// Propiedades para el componente TableRow (que renderiza <tr>)
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

// Propiedades para el componente TableHead (que renderiza <th>)
interface TableHeadProps extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: ReactNode;
}

// Propiedades para el componente TableCell (que renderiza <td>)
interface TableCellProps extends TdHTMLAttributes<HTMLTableDataCellElement> {
  children: ReactNode;
}

/**
 * Componente principal de la tabla.
 * Envuelve el elemento <table> y proporciona estilos básicos.
 */
export function Table({ children, className = "", ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto rounded-lg shadow-sm">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  )
}

/**
 * Componente para el encabezado de la tabla.
 * Envuelve el elemento <thead>.
 */
export function TableHeader({ children, className = "", ...props }: TableHeaderProps) {
  return (
    <thead className={`[&_tr]:border-b bg-gray-100 dark:bg-gray-800 ${className}`} {...props}>
      {children}
    </thead>
  )
}

/**
 * Componente para el cuerpo de la tabla.
 * Envuelve el elemento <tbody>.
 */
export function TableBody({ children, className = "", ...props }: TableBodyProps) {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
      {children}
    </tbody>
  )
}

/**
 * Componente para una fila de la tabla.
 * Envuelve el elemento <tr>.
 */
export function TableRow({ children, className = "", ...props }: TableRowProps) {
  return (
    <tr
      className={`border-b border-gray-200 transition-all ${className}`}
      {...props}
    >
      {children}
    </tr>
  )
}

/**
 * Componente para una celda de encabezado de la tabla.
 * Envuelve el elemento <th>.
 */
export function TableHead({ children, className = "", ...props }: TableHeadProps) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-semibold text-gray-700 dark:text-gray-300 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}

/**
 * Componente para una celda de datos de la tabla.
 * Envuelve el elemento <td>.
 */
export function TableCell({ children, className = "", ...props }: TableCellProps) {
  return (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
    </td>
  )
}