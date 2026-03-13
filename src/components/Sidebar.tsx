import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useAddressSearch, type SearchResult } from '@/hooks/useAddressSearch'
import type { DeliveryStop, Mode } from '@/types'

interface SidebarProps {
  mode: Mode
  onToggle: () => void
  stops: DeliveryStop[]
  onAddDestination: (result: SearchResult) => void
}

export function Sidebar({ mode, onToggle, stops, onAddDestination }: SidebarProps) {
  const isOni = mode === 'onigroup'
  const [query, setQuery] = useState('')
  const { results, loading, clearResults } = useAddressSearch(query)

  const handleSelect = (result: SearchResult) => {
    onAddDestination(result)
    setQuery('')
    clearResults()
  }

  return (
    <div className="w-80 shrink-0 border-r bg-card p-4 space-y-4 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">QuickShip</h1>
        <p className="text-sm text-muted-foreground">Logistics Dashboard</p>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Add Destination</h3>
        <div className="relative">
          <Input
            placeholder="Search address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-sm"
          />
          {loading && (
            <p className="mt-1 text-xs text-muted-foreground">Searching...</p>
          )}
          {results.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
              {results.map((r) => (
                <button
                  key={r.place_id}
                  type="button"
                  onClick={() => handleSelect(r)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md"
                >
                  <p className="font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.address}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {stops.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Selected ({stops.length})
          </h3>
          {stops.map((stop) => (
            <div
              key={stop.id}
              className="flex items-center gap-2 rounded-md border p-2 text-xs animate-in fade-in slide-in-from-left-2 duration-300"
            >
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: isOni ? '#38a169' : '#3b82f6' }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{stop.name}</p>
                <p className="text-muted-foreground truncate">{stop.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Route Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {isOni ? "Oni's Route Optimization AI" : 'Standard Routing'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isOni ? 'AI-powered route optimization' : 'Default route ordering'}
              </p>
            </div>
            <Switch checked={isOni} onCheckedChange={onToggle} />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
