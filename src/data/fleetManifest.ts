export interface ManifestItem {
  id: number
  destination: string
  address: string
  constraint: string | null
  timeWindow: string
  vehicle: string | null
  status: 'pending' | 'optimized'
  distance: string | null
  eta: string | null
}

export const manifest: ManifestItem[] = [
  { id: 1, destination: 'PT Sinar Jaya', address: 'Jl. Sudirman No. 45, Jakarta', constraint: null, timeWindow: '08:00-10:00', vehicle: null, status: 'pending', distance: null, eta: null },
  { id: 2, destination: 'FreshMart Central', address: 'Jl. Thamrin No. 12, Jakarta', constraint: 'cold-chain', timeWindow: '07:00-09:00', vehicle: null, status: 'pending', distance: null, eta: null },
  { id: 3, destination: 'CV Maju Bersama', address: 'Jl. Gatot Subroto No. 88, Jakarta', constraint: null, timeWindow: '09:00-12:00', vehicle: null, status: 'pending', distance: null, eta: null },
  { id: 4, destination: 'Toko Elektronik Jaya', address: 'Jl. Rasuna Said No. 5, Jakarta', constraint: 'vip', timeWindow: '08:00-10:00', vehicle: null, status: 'pending', distance: null, eta: null },
  { id: 5, destination: 'Apotek Sehat Selalu', address: 'Jl. Casablanca No. 15, Jakarta', constraint: 'cold-chain', timeWindow: '07:30-09:30', vehicle: null, status: 'pending', distance: null, eta: null },
  { id: 6, destination: 'Warung Pak Budi', address: 'Jl. Kuningan No. 20, Jakarta', constraint: null, timeWindow: '10:00-14:00', vehicle: null, status: 'pending', distance: null, eta: null },
  { id: 7, destination: 'Mall Grand Indonesia', address: 'Jl. MH Thamrin No. 1, Jakarta', constraint: 'vip', timeWindow: '06:00-08:00', vehicle: null, status: 'pending', distance: null, eta: null },
  { id: 8, destination: 'RS Siloam Tangerang', address: 'Jl. BSD Raya, Tangerang', constraint: 'cold-chain', timeWindow: '07:00-09:00', vehicle: null, status: 'pending', distance: null, eta: null },
  { id: 9, destination: 'PT Logistics Indo', address: 'Jl. Daan Mogot No. 100, Tangerang', constraint: null, timeWindow: '09:00-13:00', vehicle: null, status: 'pending', distance: null, eta: null },
  { id: 10, destination: 'Superindo Bintaro', address: 'Jl. Bintaro Utama, Tangerang Selatan', constraint: null, timeWindow: '08:00-12:00', vehicle: null, status: 'pending', distance: null, eta: null },
]

// Simulated optimization results per row
const vehicleAssignments = [
  'TRUCK-001', 'TRUCK-001', 'TRUCK-002', 'TRUCK-003', 'TRUCK-001',
  'TRUCK-002', 'TRUCK-003', 'TRUCK-001', 'TRUCK-002', 'TRUCK-003',
]
const distances = ['4.2 km', '6.1 km', '8.7 km', '3.5 km', '5.8 km', '7.3 km', '2.9 km', '22.4 km', '15.1 km', '12.6 km']
const etas = ['07:45', '08:12', '09:30', '08:55', '07:50', '10:20', '06:40', '08:05', '10:15', '09:10']

export const vehicleColors: Record<string, string> = {
  'TRUCK-001': '#3b82f6',
  'TRUCK-002': '#10b981',
  'TRUCK-003': '#8b5cf6',
}

export function getOptimizedManifest(): ManifestItem[] {
  return manifest.map((item, i) => ({
    ...item,
    status: 'optimized' as const,
    vehicle: vehicleAssignments[i],
    distance: distances[i],
    eta: etas[i],
  }))
}
