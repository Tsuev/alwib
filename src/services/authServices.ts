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
    return null
  }
}

export { signUp }
