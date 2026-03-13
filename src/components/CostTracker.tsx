import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface CostTrackerProps {
  totalCost: number
  apiCalls: number
}

const BUDGET = 50

export function CostTracker({ totalCost, apiCalls }: CostTrackerProps) {
  const pct = Math.min((totalCost / BUDGET) * 100, 100)
  const isWarning = pct > 60
  const isDanger = pct > 85

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">API Cost Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${totalCost.toFixed(2)}</span>
          <Badge variant={isDanger ? 'destructive' : isWarning ? 'secondary' : 'outline'}>
            {apiCalls} calls
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Budget used</span>
            <span>${BUDGET.toFixed(2)} limit</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>

        {isDanger && (
          <p className="text-xs text-destructive font-medium">
            Warning: Approaching budget limit!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
