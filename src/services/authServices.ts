import { useSupabase } from '@/composables/useSupabase'
import type { UserAuthType } from '@/types/AuthTypes'

const { supabase } = useSupabase()

const signUp = async ({ email, password, nickname }: UserAuthType) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Signup error:', error)
  }
}

const login = async ({ email, password }: Omit<UserAuthType, 'nickname'>) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw error

    return data
  } catch (error) {
    console.error(error)
  }
}

export { signUp, login }
