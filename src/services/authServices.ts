import { useSupabase } from '@/composables/useSupabase'
import type { UserAuthType } from '@/types/AuthTypes'

const { supabase } = useSupabase()

const signUp = async ({ email, password, nickname }: UserAuthType) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    })
    if (error) {
      return null
    }

    return user
  } catch (error) {
    console.log(error)
  }
}

export { signUp }
