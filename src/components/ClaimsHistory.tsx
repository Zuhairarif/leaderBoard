import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { History, Clock } from 'lucide-react'
import { ClaimHistory } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'

interface ClaimsHistoryProps {
  claimsHistory: ClaimHistory[]
  isLoading?: boolean
}

export const ClaimsHistory = ({ claimsHistory, isLoading = false }: ClaimsHistoryProps) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Claims History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Claims History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96 px-6 pb-6">
          <div className="space-y-2">
            {claimsHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No claims yet. Start claiming points!
              </div>
            ) : (
              claimsHistory.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {claim.user?.name || 'Unknown User'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(claim.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    +{claim.points_claimed}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}