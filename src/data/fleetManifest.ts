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

export interface OptimizationDetail {
  routeReasoning: string
  alternativesConsidered: number
  fuelSaved: string
  co2Reduced: string
  costSaved: string
  timeWindowFit: string
  constraintHandling: string | null
  clusterGroup: string
  sequencePosition: string
  loadUtilization: string
  trafficAdjustment: string
  riskScore: 'Low' | 'Medium' | 'High'
}

export const optimizationDetails: Record<number, OptimizationDetail> = {
  1: {
    routeReasoning: 'Grouped with Jl. Thamrin & Casablanca cluster — same corridor, minimizes backtracking by 62%',
    alternativesConsidered: 14,
    fuelSaved: '2.1 L',
    co2Reduced: '4.8 kg',
    costSaved: '€2.20',
    timeWindowFit: '97% confidence within 08:00-10:00 window',
    constraintHandling: null,
    clusterGroup: 'Central Jakarta A',
    sequencePosition: '2nd of 4 stops on TRUCK-001',
    loadUtilization: '78%',
    trafficAdjustment: 'Routed via Jl. Sudirman flyover to avoid 08:30 congestion peak',
    riskScore: 'Low',
  },
  2: {
    routeReasoning: 'Prioritized as first stop — cold-chain items require earliest delivery to maintain temperature integrity',
    alternativesConsidered: 8,
    fuelSaved: '1.8 L',
    co2Reduced: '4.1 kg',
    costSaved: '€1.85',
    timeWindowFit: '99% confidence within 07:00-09:00 window',
    constraintHandling: 'Cold-chain: Assigned to refrigerated TRUCK-001. Scheduled as first delivery to minimize thermal exposure to < 45 min',
    clusterGroup: 'Central Jakarta A',
    sequencePosition: '1st of 4 stops on TRUCK-001',
    loadUtilization: '78%',
    trafficAdjustment: 'Early departure at 06:30 avoids morning rush on Jl. Thamrin',
    riskScore: 'Low',
  },
  3: {
    routeReasoning: 'Wide time window allows flexible sequencing — placed after Kuningan stop to create efficient south-loop',
    alternativesConsidered: 22,
    fuelSaved: '3.4 L',
    co2Reduced: '7.8 kg',
    costSaved: '€3.50',
    timeWindowFit: '100% confidence within 09:00-12:00 window',
    constraintHandling: null,
    clusterGroup: 'South Jakarta Loop',
    sequencePosition: '2nd of 3 stops on TRUCK-002',
    loadUtilization: '85%',
    trafficAdjustment: 'Scheduled post-09:00 to leverage reduced traffic on Gatot Subroto after morning peak',
    riskScore: 'Low',
  },
  4: {
    routeReasoning: 'VIP priority — assigned dedicated vehicle with shortest path and buffer time for premium service',
    alternativesConsidered: 6,
    fuelSaved: '0.9 L',
    co2Reduced: '2.1 kg',
    costSaved: '€0.92',
    timeWindowFit: '99.5% confidence within 08:00-10:00 window',
    constraintHandling: 'VIP: Assigned to TRUCK-003 with 15-min arrival buffer. Driver notified for white-glove handling protocol',
    clusterGroup: 'Priority Express',
    sequencePosition: '1st of 3 stops on TRUCK-003',
    loadUtilization: '62%',
    trafficAdjustment: 'Direct route via Jl. Rasuna Said — no detours to preserve SLA guarantee',
    riskScore: 'Low',
  },
  5: {
    routeReasoning: 'Cold-chain batch with FreshMart — consolidated on same refrigerated vehicle, sequential stops save 3.2 km',
    alternativesConsidered: 11,
    fuelSaved: '2.6 L',
    co2Reduced: '6.0 kg',
    costSaved: '€2.68',
    timeWindowFit: '96% confidence within 07:30-09:30 window',
    constraintHandling: 'Cold-chain: Batched with stop #2 on TRUCK-001. Continuous cold-chain maintained — no warm gap between deliveries',
    clusterGroup: 'Central Jakarta A',
    sequencePosition: '3rd of 4 stops on TRUCK-001',
    loadUtilization: '78%',
    trafficAdjustment: 'Casablanca corridor accessed from Thamrin without re-entering main highway',
    riskScore: 'Low',
  },
  6: {
    routeReasoning: 'Wide window + no constraints — ideal "filler" stop placed between fixed-time deliveries to maximize route density',
    alternativesConsidered: 18,
    fuelSaved: '2.9 L',
    co2Reduced: '6.7 kg',
    costSaved: '€2.98',
    timeWindowFit: '100% confidence within 10:00-14:00 window',
    constraintHandling: null,
    clusterGroup: 'South Jakarta Loop',
    sequencePosition: '1st of 3 stops on TRUCK-002',
    loadUtilization: '85%',
    trafficAdjustment: 'Post-morning routing via Kuningan — traffic normalized by 10:00',
    riskScore: 'Low',
  },
  7: {
    routeReasoning: 'Earliest window in manifest — scheduled as first departure across entire fleet at 06:15',
    alternativesConsidered: 4,
    fuelSaved: '0.7 L',
    co2Reduced: '1.6 kg',
    costSaved: '€0.72',
    timeWindowFit: '98% confidence within 06:00-08:00 window',
    constraintHandling: 'VIP: Early-morning priority dispatch. TRUCK-003 pre-loaded night before to enable 06:15 departure',
    clusterGroup: 'Priority Express',
    sequencePosition: '2nd of 3 stops on TRUCK-003',
    loadUtilization: '62%',
    trafficAdjustment: 'Pre-rush hour departure — clear roads on Thamrin corridor',
    riskScore: 'Low',
  },
  8: {
    routeReasoning: 'Cross-city Tangerang delivery — batched with other Tangerang stops to justify highway toll cost',
    alternativesConsidered: 9,
    fuelSaved: '5.1 L',
    co2Reduced: '11.7 kg',
    costSaved: '€5.25',
    timeWindowFit: '94% confidence within 07:00-09:00 window',
    constraintHandling: 'Cold-chain: TRUCK-001 completes Jakarta cold-chain stops first, then proceeds to Tangerang with remaining cold capacity',
    clusterGroup: 'Tangerang Corridor',
    sequencePosition: '4th of 4 stops on TRUCK-001',
    loadUtilization: '78%',
    trafficAdjustment: 'Toll road via Jakarta-Tangerang expressway — avoids Daan Mogot surface traffic',
    riskScore: 'Medium',
  },
  9: {
    routeReasoning: 'Tangerang cluster — grouped with Bintaro stop on TRUCK-002 for western corridor efficiency',
    alternativesConsidered: 15,
    fuelSaved: '4.2 L',
    co2Reduced: '9.7 kg',
    costSaved: '€4.34',
    timeWindowFit: '100% confidence within 09:00-13:00 window',
    constraintHandling: null,
    clusterGroup: 'Tangerang Corridor',
    sequencePosition: '3rd of 3 stops on TRUCK-002',
    loadUtilization: '85%',
    trafficAdjustment: 'Daan Mogot approach scheduled after 10:00 — congestion drops 40% post-morning rush',
    riskScore: 'Low',
  },
  10: {
    routeReasoning: 'Bintaro positioned as final stop on TRUCK-003 — vehicle returns to depot via southern expressway',
    alternativesConsidered: 12,
    fuelSaved: '3.6 L',
    co2Reduced: '8.3 kg',
    costSaved: '€3.72',
    timeWindowFit: '99% confidence within 08:00-12:00 window',
    constraintHandling: null,
    clusterGroup: 'Tangerang South',
    sequencePosition: '3rd of 3 stops on TRUCK-003',
    loadUtilization: '62%',
    trafficAdjustment: 'Bintaro Utama access via JORR toll — 8 min faster than surface route',
    riskScore: 'Low',
  },
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
