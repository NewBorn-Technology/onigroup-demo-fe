import { useCallback } from 'react'
import { Sidebar } from './Sidebar'
import { MapView } from './MapView'
import { useDeliveryRoute } from '@/hooks/useDeliveryRoute'
import { useCostSimulation } from '@/hooks/useCostSimulation'
import type { SearchResult } from '@/hooks/useAddressSearch'

export function Dashboard() {
  const { mode, toggleMode, routePath, stops, loading, addStop } = useDeliveryRoute()
  const { totalCost, apiCalls, recordInteraction, resetCost } = useCostSimulation()

  const handleToggle = useCallback(() => {
    toggleMode()
    resetCost()
  }, [toggleMode, resetCost])

  const handleInteraction = useCallback(() => {
    recordInteraction(mode)
  }, [recordInteraction, mode])

  const handleAddDestination = useCallback(
    (result: SearchResult) => {
      addStop(result.name, result.address, result.lat, result.lng)
    },
    [addStop],
  )

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading deliveries...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <Sidebar
        mode={mode}
        onToggle={handleToggle}
        totalCost={totalCost}
        apiCalls={apiCalls}
        onAddDestination={handleAddDestination}
      />
      <div className="flex-1">
        <MapView
          stops={stops}
          routePath={routePath}
          mode={mode}
          onInteraction={handleInteraction}
        />
      </div>
    </div>
  )
}
