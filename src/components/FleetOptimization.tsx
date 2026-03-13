import { useState, useEffect, useCallback, useMemo } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Polyline } from './Polyline'
import { FleetMarker } from './FleetMarker'
import {
  manifest,
  getOptimizedManifest,
  vehicleColors,
  optimizationDetails,
  type ManifestItem,
} from '@/data/fleetManifest'
import { useFleetOptimization } from '@/hooks/useFleetOptimization'
import type { FleetRoute } from '@/types'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

function ConstraintBadge({ constraint }: { constraint: string | null }) {
  if (!constraint) return null
  if (constraint === 'cold-chain') {
    return (
      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
        Cold Chain
      </Badge>
    )
  }
  if (constraint === 'vip') {
    return (
      <Badge variant="destructive" className="text-[10px] px-1.5 py-0 shrink-0">
        VIP
      </Badge>
    )
  }
  return null
}

function StatusDot({ vehicle }: { vehicle: string | null }) {
  if (!vehicle) {
    return <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30 shrink-0" />
  }
  return (
    <div
      className="h-2.5 w-2.5 rounded-full shrink-0"
      style={{ backgroundColor: vehicleColors[vehicle] ?? '#94a3b8' }}
    />
  )
}

export function FleetOptimization() {
  const { isOptimizing, fleetData, error, optimize } = useFleetOptimization()
  const [rows, setRows] = useState<ManifestItem[]>(manifest)
  const [revealedCount, setRevealedCount] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [showMapRow, setShowMapRow] = useState<number | null>(null)

  // After API returns, animate rows one by one
  useEffect(() => {
    if (!fleetData) return

    const optimized = getOptimizedManifest()
    setAnimating(true)
    setRevealedCount(0)

    let i = 0
    const interval = setInterval(() => {
      if (i >= optimized.length) {
        clearInterval(interval)
        setAnimating(false)
        return
      }
      const idx = i
      setRows((prev) => {
        const next = [...prev]
        if (idx < next.length) {
          next[idx] = optimized[idx]
        }
        return next
      })
      setRevealedCount((c) => c + 1)
      i++
    }, 200)

    return () => clearInterval(interval)
  }, [fleetData])

  const handleOptimize = useCallback(() => {
    setRows(manifest)
    setRevealedCount(0)
    optimize()
  }, [optimize])

  const summary = fleetData?.optimization_summary
  const allRevealed = revealedCount >= manifest.length

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto bg-background p-6">
      {/* Header */}
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Upcoming Delivery Schedules</h1>
            <p className="text-sm text-muted-foreground">
              Tomorrow's Manifest &middot; {manifest.length} Deliveries Pending
            </p>
          </div>
          <button
            onClick={handleOptimize}
            disabled={isOptimizing || animating}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-all"
          >
            {isOptimizing ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing constraints...
              </span>
            ) : animating ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Routing fleet...
              </span>
            ) : (
              'Upload Manifest & Run Fleet AI'
            )}
          </button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Progress bar during animation */}
        {animating && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Optimizing routes...</span>
              <span>{revealedCount}/{manifest.length}</span>
            </div>
            <Progress value={(revealedCount / manifest.length) * 100} className="h-1.5" />
          </div>
        )}

        {/* Summary cards - appear after all rows revealed */}
        {summary && allRevealed && (
          <div className="grid grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{summary.total_stops_processed}</p>
                <p className="text-xs text-muted-foreground mt-1">Stops Processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{summary.vehicles_utilized}</p>
                <p className="text-xs text-muted-foreground mt-1">Vehicles Used</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{summary.estimated_fuel_savings_percent}%</p>
                <p className="text-xs text-muted-foreground mt-1">Fuel Savings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{summary.sla_compliance}</p>
                <p className="text-xs text-muted-foreground mt-1">SLA Compliance</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vehicle legend */}
        {summary && allRevealed && (
          <div className="flex gap-4 animate-in fade-in duration-500">
            {Object.entries(vehicleColors).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
        )}

        <Separator />

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[2.5rem_1fr_1fr_6rem_6rem_7rem_5rem_4rem] gap-2 px-4 py-2.5 bg-muted/50 text-xs font-medium text-muted-foreground">
            <span>#</span>
            <span>Destination</span>
            <span>Address</span>
            <span>Window</span>
            <span>Constraint</span>
            <span>Vehicle</span>
            <span>Distance</span>
            <span>ETA</span>
          </div>

          {/* Data rows */}
          {rows.filter(Boolean).map((row, i) => {
            const isOptimized = row.status === 'optimized'
            const justRevealed = isOptimized && i === revealedCount - 1
            const isExpanded = expandedRow === row.id
            const detail = optimizationDetails[row.id]

            return (
              <div key={row.id}>
                <div
                  onClick={() => isOptimized && setExpandedRow(isExpanded ? null : row.id)}
                  className={`
                    grid grid-cols-[2.5rem_1fr_1fr_6rem_6rem_7rem_5rem_4rem] gap-2 px-4 py-2.5 text-xs border-t
                    transition-all duration-500 ease-out
                    ${isOptimized ? 'bg-card cursor-pointer hover:bg-accent/50' : 'bg-background'}
                    ${justRevealed ? 'animate-in fade-in slide-in-from-left-4 duration-400' : ''}
                  `}
                  style={isOptimized ? {
                    borderLeft: `3px solid ${vehicleColors[row.vehicle!] ?? '#94a3b8'}`,
                  } : undefined}
                >
                  <span className="text-muted-foreground font-mono flex items-center">{row.id}</span>

                  <div className="flex items-center gap-2 min-w-0">
                    <StatusDot vehicle={row.vehicle} />
                    <span className="font-medium truncate">{row.destination}</span>
                    {isOptimized && (
                      <svg
                        className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  <span className="text-muted-foreground truncate flex items-center">{row.address}</span>

                  <span className="text-muted-foreground flex items-center">{row.timeWindow}</span>

                  <div className="flex items-center">
                    <ConstraintBadge constraint={row.constraint} />
                    {!row.constraint && <span className="text-muted-foreground/40">—</span>}
                  </div>

                  <div className="flex items-center">
                    {isOptimized ? (
                      <span
                        className="font-semibold transition-all duration-300"
                        style={{ color: vehicleColors[row.vehicle!] ?? '#94a3b8' }}
                      >
                        {row.vehicle}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">Unassigned</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    {isOptimized ? (
                      <span className="font-medium">{row.distance}</span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    {isOptimized ? (
                      <span className="font-medium">{row.eta}</span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && detail && (
                  <div
                    className="border-t bg-muted/30 px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{ borderLeft: `3px solid ${vehicleColors[row.vehicle!] ?? '#94a3b8'}` }}
                  >
                    {/* AI Reasoning + Map button */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                          <svg className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a6 6 0 00-6 6c0 1.887.87 3.568 2.23 4.668A2 2 0 017 14.5V16a2 2 0 002 2h2a2 2 0 002-2v-1.5a2 2 0 00.77-1.832A6.001 6.001 0 0010 2z" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-primary">AI Route Reasoning</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {detail.alternativesConsidered} alternatives analyzed
                        </Badge>

                        {/* Map icon button */}
                        {(() => {
                          const vehicleRoute = fleetData?.fleet_routes?.find(
                            (r: FleetRoute) => r.vehicle_id === row.vehicle
                          )
                          if (!vehicleRoute) return null
                          const isMapOpen = showMapRow === row.id
                          return (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowMapRow(isMapOpen ? null : row.id)
                              }}
                              className={`ml-auto flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                                isMapOpen
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-muted-foreground/20 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5'
                              }`}
                              title="View route on map"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM14 5.586v12.828l2.293-2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707L14 1.586v4z" clipRule="evenodd" />
                              </svg>
                              {isMapOpen ? 'Hide Route' : 'View Route'}
                            </button>
                          )
                        })()}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed pl-7">{detail.routeReasoning}</p>
                    </div>

                    {/* Inline route map */}
                    {showMapRow === row.id && (() => {
                      const vehicleRoute = fleetData?.fleet_routes?.find(
                        (r: FleetRoute) => r.vehicle_id === row.vehicle
                      )
                      if (!vehicleRoute || !vehicleRoute.route_geometry?.length) return null
                      const geo = vehicleRoute.route_geometry
                      const centerLat = geo.reduce((s, p) => s + p.lat, 0) / geo.length
                      const centerLng = geo.reduce((s, p) => s + p.lng, 0) / geo.length
                      return (
                        <div className="mb-4 rounded-lg border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center justify-between bg-card px-3 py-2 border-b">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: vehicleRoute.color_hex }}
                              />
                              <span className="text-xs font-semibold">{vehicleRoute.vehicle_id} Route</span>
                              <span className="text-[10px] text-muted-foreground">
                                {geo.length} waypoints
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {row.destination}
                            </span>
                          </div>
                          <div className="h-64">
                            <APIProvider apiKey={API_KEY}>
                              <Map
                                defaultCenter={{ lat: centerLat, lng: centerLng }}
                                defaultZoom={12}
                                className="h-full w-full"
                                gestureHandling="cooperative"
                                disableDefaultUI
                              >
                                <Polyline
                                  path={geo}
                                  strokeColor={vehicleRoute.color_hex}
                                  strokeWeight={4}
                                />
                                <FleetMarker
                                  position={geo[0]}
                                  color={vehicleRoute.color_hex}
                                  label="S"
                                  title="Start"
                                />
                                <FleetMarker
                                  position={geo[geo.length - 1]}
                                  color={vehicleRoute.color_hex}
                                  label="E"
                                  title="End"
                                />
                              </Map>
                            </APIProvider>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Constraint handling (if applicable) */}
                    {detail.constraintHandling && (
                      <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-3 py-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <svg className="h-3.5 w-3.5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.345 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Constraint Handling</span>
                        </div>
                        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{detail.constraintHandling}</p>
                      </div>
                    )}

                    {/* Metrics grid */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="rounded-md border bg-card p-2.5 text-center">
                        <p className="text-lg font-bold text-green-600">{detail.fuelSaved}</p>
                        <p className="text-[10px] text-muted-foreground">Fuel Saved</p>
                      </div>
                      <div className="rounded-md border bg-card p-2.5 text-center">
                        <p className="text-lg font-bold text-green-600">{detail.co2Reduced}</p>
                        <p className="text-[10px] text-muted-foreground">CO₂ Reduced</p>
                      </div>
                      <div className="rounded-md border bg-card p-2.5 text-center">
                        <p className="text-lg font-bold text-green-600">{detail.costSaved}</p>
                        <p className="text-[10px] text-muted-foreground">Cost Saved</p>
                      </div>
                      <div className="rounded-md border bg-card p-2.5 text-center">
                        <p className="text-lg font-bold">{detail.timeWindowFit.split(' ')[0]}</p>
                        <p className="text-[10px] text-muted-foreground">On-Time Confidence</p>
                      </div>
                    </div>

                    {/* Detail rows */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cluster Group</span>
                        <span className="font-medium">{detail.clusterGroup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sequence</span>
                        <span className="font-medium">{detail.sequencePosition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Load Utilization</span>
                        <span className="font-medium">{detail.loadUtilization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Score</span>
                        <Badge
                          variant={detail.riskScore === 'Low' ? 'secondary' : 'destructive'}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {detail.riskScore}
                        </Badge>
                      </div>
                      <div className="col-span-2 flex justify-between">
                        <span className="text-muted-foreground">Traffic Adjustment</span>
                        <span className="font-medium text-right max-w-[70%]">{detail.trafficAdjustment}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
