import { useEffect, useRef } from 'react'
import { useMap } from '@vis.gl/react-google-maps'

interface FleetMarkerProps {
  position: google.maps.LatLngLiteral
  color: string
  label: string
  title?: string
}

export function FleetMarker({ position, color, label, title }: FleetMarkerProps) {
  const map = useMap()
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    if (!map) return

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker()
    }

    markerRef.current.setOptions({
      position,
      map,
      title,
      label: { text: label, color: '#fff', fontWeight: 'bold', fontSize: '11px' },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    })

    return () => {
      markerRef.current?.setMap(null)
    }
  }, [map, position, color, label, title])

  return null
}
