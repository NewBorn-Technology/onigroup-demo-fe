import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { manifest } from '@/data/fleetManifest'
import type { FleetOptimizationResult } from '@/types'

interface FleetSidebarProps {
  isOptimizing: boolean
  fleetData: FleetOptimizationResult | null
  error: string | null
  onOptimize: () => void
}

function ConstraintBadge({ constraint }: { constraint: string | null }) {
  if (!constraint) return null
  if (constraint === 'cold-chain') {
    return <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Cold Chain Required</Badge>
  }
  if (constraint === 'vip') {
    return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">VIP Customer</Badge>
  }
  return null
}

export function FleetSidebar({ isOptimizing, fleetData, error, onOptimize }: FleetSidebarProps) {
  const summary = fleetData?.optimization_summary
  const routes = fleetData?.fleet_routes

  return (
    <div className="w-80 shrink-0 border-r bg-card p-4 space-y-4 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Fleet Optimization</h1>
        <p className="text-sm text-muted-foreground">Enterprise Route Planning</p>
      </div>

      <Separator />

      {!fleetData ? (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tomorrow's Manifest: {manifest.length} Deliveries Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 max-h-64 overflow-y-auto">
              {manifest.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-2 rounded-md border p-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{item.destination}</p>
                    <p className="text-muted-foreground truncate">{item.address}</p>
                    <p className="text-muted-foreground">{item.timeWindow}</p>
                  </div>
                  <ConstraintBadge constraint={item.constraint} />
                </div>
              ))}
            </CardContent>
          </Card>

          <button
            onClick={onOptimize}
            disabled={isOptimizing}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70 transition-all"
          >
            {isOptimizing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing constraints... Routing fleet...
              </span>
            ) : (
              'Upload Manifest & Run Fleet AI'
            )}
          </button>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </>
      ) : (
        <>
          {summary && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fleet Optimization Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border p-2 text-center">
                    <p className="text-2xl font-bold">{summary.total_stops_processed}</p>
                    <p className="text-[10px] text-muted-foreground">Stops Processed</p>
                  </div>
                  <div className="rounded-md border p-2 text-center">
                    <p className="text-2xl font-bold">{summary.vehicles_utilized}</p>
                    <p className="text-[10px] text-muted-foreground">Vehicles Utilized</p>
                  </div>
                  <div className="rounded-md border p-2 text-center">
                    <p className="text-2xl font-bold text-green-600">{summary.estimated_fuel_savings_percent}%</p>
                    <p className="text-[10px] text-muted-foreground">Fuel Savings</p>
                  </div>
                  <div className="rounded-md border p-2 text-center">
                    <p className="text-2xl font-bold text-green-600">{summary.sla_compliance}</p>
                    <p className="text-[10px] text-muted-foreground">SLA Compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {routes && routes.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fleet Routes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {routes.map((route) => (
                  <div key={route.vehicle_id} className="flex items-center gap-2 text-sm">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: route.color_hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{route.vehicle_id}</p>
                      <p className="text-xs text-muted-foreground">
                        {route.route_geometry.length} waypoints
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
