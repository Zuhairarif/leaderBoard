import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jtdfixvppnfzvsruloqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0ZGZpeHZwcG5menZzcnVsb3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzAwMzUsImV4cCI6MjA2ODQwNjAzNX0.foKcXIDVwO_6BejIULdVXgVFYJWjLivxeEroLsXKx5Q'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface User {
  id: string
  name: string
  total_points: number
  created_at: string
  updated_at: string
}

export interface ClaimHistory {
  id: string
  user_id: string
  points_claimed: number
  created_at: string
  user?: User
}

// Initial setup function to create tables and seed data
export const initializeDatabase = async () => {
  try {
    // Create users table
    const { error: usersTableError } = await supabase.rpc('create_users_table', {})
    if (usersTableError && !usersTableError.message.includes('already exists')) {
      console.error('Error creating users table:', usersTableError)
    }

    // Create claims_history table
    const { error: historyTableError } = await supabase.rpc('create_claims_history_table', {})
    if (historyTableError && !historyTableError.message.includes('already exists')) {
      console.error('Error creating claims_history table:', historyTableError)
    }

    // Seed initial users if table is empty
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (!existingUsers || existingUsers.length === 0) {
      const initialUsers = [
        'Rahul', 'Kamal', 'Sanak', 'Priya', 'Arjun', 
        'Sneha', 'Vikram', 'Anita', 'Ravi', 'Deepika'
      ]

      const { error: seedError } = await supabase
        .from('users')
        .insert(
          initialUsers.map(name => ({
            name,
            total_points: 0
          }))
        )

      if (seedError) {
        console.error('Error seeding users:', seedError)
      } else {
        console.log('Successfully seeded initial users')
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}