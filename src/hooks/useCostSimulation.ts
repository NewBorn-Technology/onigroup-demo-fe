import { useState, useCallback } from 'react'
import type { CostState, Mode } from '@/types'

export function useCostSimulation() {
  const [cost, setCost] = useState<CostState>({ totalCost: 0, apiCalls: 0 })

  const recordInteraction = useCallback((mode: Mode) => {
    setCost((prev) => {
      if (mode === 'standard') {
        const charge = 0.5 + Math.random() * 1.5 // $0.50 - $2.00
        return {
          totalCost: prev.totalCost + charge,
          apiCalls: prev.apiCalls + 1,
        }
      }
      // OniGroup: 20% chance of a tiny charge
      if (Math.random() < 0.2) {
        return {
          totalCost: prev.totalCost + 0.01,
          apiCalls: prev.apiCalls + 1,
        }
      }
      return { ...prev, apiCalls: prev.apiCalls + 1 }
    })
  }, [])

  const resetCost = useCallback(() => {
    setCost({ totalCost: 0, apiCalls: 0 })
  }, [])

  return { ...cost, recordInteraction, resetCost }
}
