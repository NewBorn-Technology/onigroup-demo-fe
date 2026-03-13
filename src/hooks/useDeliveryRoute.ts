import { useState, useMemo, useCallback, useEffect } from 'react'
import type { DeliveryStop, Mode } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export function useDeliveryRoute() {
  const [mode, setMode] = useState<Mode>('standard')
  const [stops, setStops] = useState<DeliveryStop[]>([])
  const [optimizedOrder, setOptimizedOrder] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch stops from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/deliveries`)
      .then((res) => res.json())
      .then((data: DeliveryStop[]) => {
        setStops(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch deliveries:', err)
        setLoading(false)
      })
  }, [])

  // Call optimize endpoint when switching to onigroup mode
  useEffect(() => {
    if (mode !== 'onigroup' || stops.length < 2) return

    fetch(`${API_BASE}/api/deliveries/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stops: stops.map((s) => ({ lat: s.lat, lng: s.lng })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const waypointOrder: number[] = data.optimized_waypoint_order
        const fullOrder = [0, ...waypointOrder.map((i: number) => i + 1), 0]
        setOptimizedOrder(fullOrder)
      })
      .catch((err) => {
        console.error('Failed to optimize route:', err)
      })
  }, [mode, stops])

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'standard' ? 'onigroup' : 'standard'))
  }, [])

  // Standard mode: no route line. OniGroup mode: optimized route from backend.
  const routePath = useMemo(() => {
    if (mode !== 'onigroup' || optimizedOrder.length === 0 || stops.length < 2) return []
    return optimizedOrder.map((idx) => ({
      lat: stops[idx].lat,
      lng: stops[idx].lng,
    }))
  }, [mode, optimizedOrder, stops])

  const addStop = useCallback((name: string, address: string, lat: number, lng: number) => {
    setStops((prev) => [
      ...prev,
      {
        id: prev.length,
        name,
        address,
        lat,
        lng,
        status: 'pending',
      },
    ])
  }, [])

  return { mode, toggleMode, routePath, stops, loading, addStop }
}
