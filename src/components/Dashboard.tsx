import { useCallback } from 'react'
import { Sidebar } from './Sidebar'
import { MapView } from './MapView'
import { useDeliveryRoute } from '@/hooks/useDeliveryRoute'
import type { SearchResult } from '@/hooks/useAddressSearch'

export function Dashboard() {
  const { mode, toggleMode, routePath, stops, loading, addStop } = useDeliveryRoute()

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
        onToggle={toggleMode}
        stops={stops}
        onAddDestination={handleAddDestination}
      />
      <div className="flex-1">
        <MapView
          stops={stops}
          routePath={routePath}
          mode={mode}
          onInteraction={() => {}}
        />
      </div>
    </div>
  )
}
