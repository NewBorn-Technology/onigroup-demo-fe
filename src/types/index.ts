export interface DeliveryStop {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  status: 'pending' | 'delivered'
}

export type Mode = 'standard' | 'onigroup'

export interface CostState {
  totalCost: number
  apiCalls: number
}

// Fleet Optimization types

export interface FleetRoute {
  vehicle_id: string
  color_hex: string
  route_geometry: google.maps.LatLngLiteral[]
}

export interface FleetOptimizationResult {
  success: boolean
  optimization_summary: {
    total_stops_processed: number
    vehicles_utilized: number
    estimated_fuel_savings_percent: number
    sla_compliance: string
  }
  fleet_routes: FleetRoute[]
}
