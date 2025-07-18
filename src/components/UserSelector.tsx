import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Plus, Trophy } from 'lucide-react'
import { User as UserType } from '@/lib/supabase'

interface UserSelectorProps {
  users: UserType[]
  selectedUserId: string | null
  onUserSelect: (userId: string) => void
  onAddUser: (name: string) => void
  onClaimPoints: () => void
  isLoading?: boolean
}

export const UserSelector = ({
  users,
  selectedUserId,
  onUserSelect,
  onAddUser,
  onClaimPoints,
  isLoading = false
}: UserSelectorProps) => {
  const [newUserName, setNewUserName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddUser = async () => {
    if (!newUserName.trim()) return
    
    setIsAdding(true)
    try {
      await onAddUser(newUserName.trim())
      setNewUserName('')
    } catch (error) {
      console.error('Error adding user:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const selectedUser = users.find(user => user.id === selectedUserId)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Selection Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="user-select">Select User</Label>
          <Select value={selectedUserId || ''} onValueChange={onUserSelect}>
            <SelectTrigger id="user-select">
              <SelectValue placeholder="Choose a user..." />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{user.name}</span>
                    <span className="text-muted-foreground ml-2">
                      {user.total_points} pts
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected User Info */}
        {selectedUser && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">{selectedUser.name}</span>
              <span className="text-sm text-muted-foreground">
                {selectedUser.total_points} points
              </span>
            </div>
          </div>
        )}

        {/* Claim Points Button */}
        <Button 
          onClick={onClaimPoints}
          disabled={!selectedUserId || isLoading}
          className="w-full"
          size="lg"
        >
          <Trophy className="h-4 w-4 mr-2" />
          {isLoading ? 'Claiming...' : 'Claim Random Points'}
        </Button>

        {/* Add New User Section */}
        <div className="border-t pt-4 space-y-2">
          <Label htmlFor="new-user">Add New User</Label>
          <div className="flex gap-2">
            <Input
              id="new-user"
              placeholder="Enter user name..."
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
            />
            <Button 
              onClick={handleAddUser}
              disabled={!newUserName.trim() || isAdding}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}