import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  manifest,
  getOptimizedManifest,
  vehicleColors,
  type ManifestItem,
} from '@/data/fleetManifest'
import { useFleetOptimization } from '@/hooks/useFleetOptimization'

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

            return (
              <div
                key={row.id}
                className={`
                  grid grid-cols-[2.5rem_1fr_1fr_6rem_6rem_7rem_5rem_4rem] gap-2 px-4 py-2.5 text-xs border-t
                  transition-all duration-500 ease-out
                  ${isOptimized ? 'bg-card' : 'bg-background'}
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
            )
          })}
        </div>
      </div>
    </div>
  )
}
