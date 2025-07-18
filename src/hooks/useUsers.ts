import { useState, useEffect } from 'react'
import { supabase, User } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('total_points', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addUser = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, total_points: 0 }])
        .select()
        .single()

      if (error) throw error
      
      await fetchUsers() // Refresh the list
      toast({
        title: "Success",
        description: `User ${name} added successfully!`
      })
      
      return data
    } catch (error) {
      console.error('Error adding user:', error)
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive"
      })
      throw error
    }
  }

  const claimPoints = async (userId: string) => {
    try {
      // Generate random points between 1-10
      const pointsClaimed = Math.floor(Math.random() * 10) + 1
      
      // Get current user data
      const { data: currentUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (fetchError) throw fetchError

      // Update user's total points
      const newTotalPoints = currentUser.total_points + pointsClaimed
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          total_points: newTotalPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      // Add to claims history
      const { error: historyError } = await supabase
        .from('claims_history')
        .insert([{
          user_id: userId,
          points_claimed: pointsClaimed
        }])

      if (historyError) throw historyError

      await fetchUsers() // Refresh users to update rankings
      
      toast({
        title: "Points Claimed!",
        description: `${currentUser.name} claimed ${pointsClaimed} points!`
      })

      return { pointsClaimed, newTotalPoints }
    } catch (error) {
      console.error('Error claiming points:', error)
      toast({
        title: "Error",
        description: "Failed to claim points",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchUsers()

    // Set up real-time subscription for users table
    const usersSubscription = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        () => {
          fetchUsers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(usersSubscription)
    }
  }, [])

  return {
    users,
    loading,
    addUser,
    claimPoints,
    refetch: fetchUsers
  }
}