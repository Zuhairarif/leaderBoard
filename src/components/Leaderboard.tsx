import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Crown, Medal, Award } from 'lucide-react'
import { User } from '@/lib/supabase'

interface LeaderboardProps {
  users: User[]
  isLoading?: boolean
}

export const Leaderboard = ({ users, isLoading = false }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-muted-foreground font-bold">#{rank}</span>
    }
  }

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default" as const
      case 2:
        return "secondary" as const
      case 3:
        return "outline" as const
      default:
        return "outline" as const
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
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

  // Sort users by total_points in descending order and add rank
  const rankedUsers = users
    .sort((a, b) => b.total_points - a.total_points)
    .map((user, index) => ({ ...user, rank: index + 1 }))

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rankedUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found. Add some users to get started!
            </div>
          ) : (
            rankedUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                  user.rank <= 3 ? 'bg-muted/30' : 'bg-background'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(user.rank)}
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Rank #{user.rank}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRankBadgeVariant(user.rank)}>
                    {user.total_points} points
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}