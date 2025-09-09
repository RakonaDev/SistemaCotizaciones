"use client"

import { Global } from "@/database/Global"
import { useState, useEffect, useCallback } from "react"

interface SearchResult {
  id: number
  nombre: string
  [key: string]: any
}

interface UseSearchOptions {
  url: string
  value?: string
  searchParam?: string
  minLength?: number
  debounceMs?: number
}

export const useSearch = ({ url, value, searchParam = "search", minLength = 2, debounceMs = 300 }: UseSearchOptions) => {
  const [query, setQuery] = useState(value ?? '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const params = new URLSearchParams()

  const searchFunction = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minLength) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        params.set(searchParam, searchQuery)

        const response = await fetch(`${Global.api}/${url}?search=${query}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        // Asumiendo que la respuesta tiene una estructura como { data: [...] } o directamente [...]
        const resultsArray = Array.isArray(data) ? data : data.data || []
        setResults(resultsArray)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error en la búsqueda")
        setResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [url, searchParam, minLength, query]
  )

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchFunction(query)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [query, searchFunction, debounceMs])

  const clearSearch = useCallback(() => {
    setQuery("")
    setResults([])
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearSearch,
  }
}
