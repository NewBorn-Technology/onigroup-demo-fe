import { useEffect, useRef } from 'react'
import { useMap } from '@vis.gl/react-google-maps'
import type { DeliveryStop, Mode } from '@/types'

interface DeliveryMarkerProps {
  stop: DeliveryStop
  mode: Mode
  index?: number
}

export function DeliveryMarker({ stop, mode, index }: DeliveryMarkerProps) {
  const map = useMap()
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    if (!map) return

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker()
    }

    const isOni = mode === 'onigroup'
    const label = isOni ? String(index ?? stop.id) : ''

    markerRef.current.setOptions({
      position: { lat: stop.lat, lng: stop.lng },
      map,
      title: stop.name,
      label: label
        ? { text: label, color: '#fff', fontWeight: 'bold', fontSize: '12px' }
        : undefined,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: isOni ? '#38a169' : '#e53e3e',
        fillOpacity: 1,
        strokeColor: isOni ? '#276749' : '#c53030',
        strokeWeight: 2,
      },
    })

    return () => {
      markerRef.current?.setMap(null)
    }
  }, [map, mode, stop, index])

  return null
}
