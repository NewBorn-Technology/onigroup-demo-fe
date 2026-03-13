import { useEffect, useMemo, useRef } from 'react'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { Polyline } from './Polyline'
import type { FleetRoute } from '@/types'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''
const JAKARTA_CENTER = { lat: -6.2088, lng: 106.8456 }

interface FleetMarkerProps {
  lat: number
  lng: number
  color: string
  label: string
  title: string
}

function FleetMarker({ lat, lng, color, label, title }: FleetMarkerProps) {
  const map = useMap()
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    if (!map) return

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker()
    }

    markerRef.current.setOptions({
      position: { lat, lng },
      map,
      title,
      label: { text: label, color: '#fff', fontWeight: 'bold', fontSize: '11px' },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    })

    return () => {
      markerRef.current?.setMap(null)
    }
  }, [map, lat, lng, color, label, title])

  return null
}

interface ManifestStop {
  lat: number
  lng: number
  name: string
}

interface FleetMapViewProps {
  routes: FleetRoute[] | null
  manifestStops?: ManifestStop[]
}

export function FleetMapView({ routes, manifestStops }: FleetMapViewProps) {
  const center = useMemo(() => {
    if (routes && routes.length > 0) {
      const allPoints = routes.flatMap((r) => r.route_geometry)
      if (allPoints.length > 0) {
        const avgLat = allPoints.reduce((s, p) => s + p.lat, 0) / allPoints.length
        const avgLng = allPoints.reduce((s, p) => s + p.lng, 0) / allPoints.length
        return { lat: avgLat, lng: avgLng }
      }
    }
    return JAKARTA_CENTER
  }, [routes])

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        defaultCenter={center}
        defaultZoom={12}
        className="h-full w-full"
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {routes
          ? routes.map((route) => (
              <Polyline
                key={route.vehicle_id}
                path={route.route_geometry}
                strokeColor={route.color_hex}
                strokeWeight={5}
                strokeOpacity={0.85}
              />
            ))
          : manifestStops?.map((stop, i) => (
              <FleetMarker
                key={i}
                lat={stop.lat}
                lng={stop.lng}
                color="#94a3b8"
                label={String(i + 1)}
                title={stop.name}
              />
            ))}
      </Map>
    </APIProvider>
  )
}
