import { useState, useEffect } from 'react'
import { UserSelector } from '@/components/UserSelector'
import { Leaderboard } from '@/components/Leaderboard'
import { ClaimsHistory } from '@/components/ClaimsHistory'
import { useUsers } from '@/hooks/useUsers'
import { useClaimsHistory } from '@/hooks/useClaimsHistory'
import { initializeDatabase } from '@/lib/supabase'
import { Trophy, Users, History } from 'lucide-react'

const Index = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isClaimingPoints, setIsClaimingPoints] = useState(false)
  
  const { users, loading: usersLoading, addUser, claimPoints } = useUsers()
  const { claimsHistory, loading: historyLoading } = useClaimsHistory()

  // Initialize database on component mount
  useEffect(() => {
    initializeDatabase()
  }, [])

  const handleClaimPoints = async () => {
    if (!selectedUserId) return
    
    setIsClaimingPoints(true)
    try {
      await claimPoints(selectedUserId)
    } catch (error) {
      console.error('Error claiming points:', error)
    } finally {
      setIsClaimingPoints(false)
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold gaming-gradient bg-clip-text text-transparent">
            Point Rally Leaderboard
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Select users, claim random points, and watch the rankings update in real-time!
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Selection Panel */}
          <div className="lg:col-span-1">
            <UserSelector
              users={users}
              selectedUserId={selectedUserId}
              onUserSelect={setSelectedUserId}
              onAddUser={addUser}
              onClaimPoints={handleClaimPoints}
              isLoading={isClaimingPoints}
            />
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard 
              users={users} 
              isLoading={usersLoading}
            />
          </div>

          {/* Claims History */}
          <div className="lg:col-span-1">
            <ClaimsHistory 
              claimsHistory={claimsHistory}
              isLoading={historyLoading}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="gaming-card rounded-lg p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          
          <div className="gaming-card rounded-lg p-6 text-center">
            <History className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{claimsHistory.length}</div>
            <div className="text-sm text-muted-foreground">Total Claims</div>
          </div>
          
          <div className="gaming-card rounded-lg p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {users.reduce((sum, user) => sum + user.total_points, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Index;
