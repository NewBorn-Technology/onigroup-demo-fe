import { useCallback, useMemo, useRef } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { Polyline } from './Polyline'
import { DeliveryMarker } from './DeliveryMarker'
import type { DeliveryStop, Mode } from '@/types'

interface MapViewProps {
  stops: DeliveryStop[]
  routePath: google.maps.LatLngLiteral[]
  mode: Mode
  onInteraction: () => void
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

export function MapView({ stops, routePath, mode, onInteraction }: MapViewProps) {
  const throttleRef = useRef<number>(0)

  const center = useMemo(() => {
    if (stops.length === 0) return { lat: -6.2088, lng: 106.8456 }
    const avgLat = stops.reduce((sum, s) => sum + s.lat, 0) / stops.length
    const avgLng = stops.reduce((sum, s) => sum + s.lng, 0) / stops.length
    return { lat: avgLat, lng: avgLng }
  }, [stops])

  const handleCameraChanged = useCallback(() => {
    const now = Date.now()
    if (now - throttleRef.current > 500) {
      throttleRef.current = now
      onInteraction()
    }
  }, [onInteraction])

  const polylineColor = mode === 'standard' ? '#e53e3e' : '#38a169'

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        defaultCenter={center}
        defaultZoom={14}
        className="h-full w-full"
        onCameraChanged={handleCameraChanged}
        onClick={onInteraction}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {stops.map((stop, i) => (
          <DeliveryMarker key={stop.id} stop={stop} mode={mode} index={i} />
        ))}
        <Polyline path={routePath} strokeColor={polylineColor} />
      </Map>
    </APIProvider>
  )
}
