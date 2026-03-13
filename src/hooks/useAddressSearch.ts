import { useState, useEffect, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export interface SearchResult {
  place_id: string
  name: string
  address: string
  lat: number
  lng: number
}

export function useAddressSearch(query: string, debounceMs = 400) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      return
    }

    const timeout = setTimeout(() => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setLoading(true)
      fetch(`${API_BASE}/api/deliveries/search?q=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: SearchResult[]) => {
          setResults(data)
          setLoading(false)
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Search failed:', err)
            setLoading(false)
          }
        })
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [query, debounceMs])

  const clearResults = () => setResults([])

  return { results, loading, clearResults }
}
