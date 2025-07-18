import { useState, useEffect } from 'react'
import { supabase, ClaimHistory } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useClaimsHistory = () => {
  const [claimsHistory, setClaimsHistory] = useState<ClaimHistory[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchClaimsHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('claims_history')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false })
        .limit(50) // Show last 50 claims

      if (error) throw error
      setClaimsHistory(data || [])
    } catch (error) {
      console.error('Error fetching claims history:', error)
      toast({
        title: "Error",
        description: "Failed to fetch claims history",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClaimsHistory()

    // Set up real-time subscription for claims_history table
    const historySubscription = supabase
      .channel('claims-history-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'claims_history' },
        () => {
          fetchClaimsHistory()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(historySubscription)
    }
  }, [])

  return {
    claimsHistory,
    loading,
    refetch: fetchClaimsHistory
  }
}