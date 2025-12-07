import type { AuthError, Session, User } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { supabase } from '../lib/supabaseClient'

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
  login: (provider: 'google' | 'github') => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  //console.log('AuthProvider', { user, session, loading, error });

  useEffect(() => {
    const syncSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setError(sessionError)
      } else {
        setSession(data.session)
        setUser(data.session?.user ?? null)
      }
      setLoading(false)
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      //console.log('Auth state changed:', _event, newSession);
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setError(null)
      setLoading(false)
    })

    void syncSession()

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (provider: 'google' | 'github') => {
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (signInError) {
      setError(signInError)
    }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(signOutError)
    }
  }, [])

  const value = useMemo(
    () => ({ user, session, loading, error, login, logout }),
    [user, session, loading, error, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
