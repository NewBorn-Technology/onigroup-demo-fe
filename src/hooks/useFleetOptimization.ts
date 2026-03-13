import { useState, useCallback } from 'react'
import type { FleetOptimizationResult } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export function useFleetOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [fleetData, setFleetData] = useState<FleetOptimizationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const optimize = useCallback(async () => {
    setIsOptimizing(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/deliveries/optimize-fleet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data: FleetOptimizationResult = await res.json()
      setFleetData(data)
    } catch (err) {
      console.error('Fleet optimization failed:', err)
      setError('Failed to optimize fleet. Is the backend running?')
    } finally {
      setIsOptimizing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setFleetData(null)
    setError(null)
  }, [])

  return { isOptimizing, fleetData, error, optimize, reset }
}
