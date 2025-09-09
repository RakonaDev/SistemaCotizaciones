"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearch } from "@/hooks/useSearch"


interface SearchResult {
  id: number
  nombre: string
  [key: string]: any
}

interface SearchSelectProps {
  name: string
  value: number
  queryClient?: string
  onChange: (name: string, value: number) => void
  onBlur?: (name: string) => void
  placeholder?: string
  error?: boolean
  searchUrl: string
  searchParam?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  name,
  value,
  queryClient,
  onChange,
  placeholder = "Buscar...",
  error = false,
  searchUrl,
  searchParam = "search",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null)
  const [displayValue, setDisplayValue] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    query,
    setQuery,
    results,
    isLoading,
    error: searchError,
    clearSearch,
  } = useSearch({
    value: queryClient,
    url: searchUrl,
    searchParam,
    minLength: 2,
    debounceMs: 300,
  })

  // Effect para manejar el valor inicial
  useEffect(() => {
    if (value && value !== 0 && !selectedItem) {
      // Si hay un valor pero no hay selectedItem, podríamos hacer una búsqueda por ID
      // Por ahora, solo mostramos el ID
      setDisplayValue(`ID: ${value}`)
    } else if (selectedItem) {
      setDisplayValue(selectedItem.nombre)
    } else {
      setDisplayValue("")
    }
  }, [value, selectedItem])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        if (!selectedItem && query) {
          setQuery("")
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [selectedItem, query, setQuery])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    console.log(query)
    setDisplayValue(newQuery)
    setIsOpen(true)

    // Si el usuario está escribiendo, limpiar la selección actual
    if (selectedItem && newQuery !== selectedItem.nombre) {
      setSelectedItem(null)
      onChange(name, 0)
    }
  }

  const handleSelectItem = (item: SearchResult) => {
    setSelectedItem(item)
    setDisplayValue(item.nombre)
    setQuery(item.nombre)
    onChange(name, item.id)
    setIsOpen(false)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
    if (selectedItem) {
      setQuery(selectedItem.nombre)
    }
  }

  const handleClear = () => {
    setSelectedItem(null)
    setDisplayValue("")
    setQuery("")
    onChange(name, 0)
    clearSearch()
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query ?? displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2.5 pr-10 text-sm
            border rounded-lg
            bg-white
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-300 hover:border-slate-400"
            }
            ${disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "text-slate-900"}
          `}
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* Clear button */}
        {selectedItem && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Dropdown arrow */}
        {!selectedItem && !isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {/* Error state */}
            {searchError && (
              <div className="px-3 py-2 text-sm text-red-600 bg-red-50">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {searchError}
                </div>
              </div>
            )}

            {/* No results */}
            {!isLoading && !searchError && query.length >= 2 && results.length === 0 && (
              <div className="px-3 py-2 text-sm text-slate-500 text-center">
                No se encontraron resultados para &quot;{query}&quot;
              </div>
            )}

            {/* Search hint */}
            {!isLoading && !searchError && query.length < 2 && (
              <div className="px-3 py-2 text-sm text-slate-500 text-center">
                Escribe al menos 2 caracteres para buscar
              </div>
            )}

            {/* Results */}
            {results.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectItem(item)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-slate-100 last:border-b-0"
              >
                <div className="font-medium text-slate-900">{item.nombre}</div>
                {item.email && <div className="text-xs text-slate-500 mt-0.5">{item.email}</div>}
                {item.documento && <div className="text-xs text-slate-500 mt-0.5">Doc: {item.documento}</div>}
              </motion.button>
            ))}

            {/* Loading state */}
            {isLoading && (
              <div className="px-3 py-2 text-sm text-slate-500 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  Buscando...
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
