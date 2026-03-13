import { useState, useEffect } from 'react'

interface GeolocationState {
  position: google.maps.LatLngLiteral | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ position: null, error: 'Geolocation not supported', loading: false })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
          loading: false,
        })
      },
      (err) => {
        setState({ position: null, error: err.message, loading: false })
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  return state
}
