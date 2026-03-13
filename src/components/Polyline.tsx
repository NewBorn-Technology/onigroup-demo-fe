import { useEffect, useRef } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

interface PolylineProps {
  path: google.maps.LatLngLiteral[]
  strokeColor: string
  strokeWeight?: number
  strokeOpacity?: number
}

export function Polyline({
  path,
  strokeColor,
  strokeWeight = 4,
  strokeOpacity = 0.8,
}: PolylineProps) {
  const map = useMap()
  const coreLib = useMapsLibrary('core')
  const polylineRef = useRef<google.maps.Polyline | null>(null)

  useEffect(() => {
    if (!map || !coreLib) return

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline()
    }

    polylineRef.current.setOptions({
      path,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      geodesic: true,
    })

    polylineRef.current.setMap(map)

    return () => {
      polylineRef.current?.setMap(null)
    }
  }, [map, coreLib, path, strokeColor, strokeWeight, strokeOpacity])

  return null
}
