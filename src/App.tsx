import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { FleetOptimization } from './components/FleetOptimization'

type Tab = 'live-routing' | 'fleet-optimization'

function App() {
  const [tab, setTab] = useState<Tab>('live-routing')

  return (
    <div className="flex h-screen flex-col">
      <div className="flex shrink-0 border-b bg-card">
        <button
          onClick={() => setTab('live-routing')}
          className={`px-5 py-2.5 text-sm font-medium transition-colors ${
            tab === 'live-routing'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Live Routing
        </button>
        <button
          onClick={() => setTab('fleet-optimization')}
          className={`px-5 py-2.5 text-sm font-medium transition-colors ${
            tab === 'fleet-optimization'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Fleet Optimization
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === 'live-routing' ? <Dashboard /> : <FleetOptimization />}
      </div>
    </div>
  )
}

export default App
