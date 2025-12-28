import { useEffect, useState } from "react"
import type { Session } from "next-auth"
import { getSession } from "./getSession"

type SessionStatus = "loading" | "authenticated" | "unauthenticated"

type User = Session["user"]
type UserRole = NonNullable<User>["role"]

interface UseSessionReturn {
  session: Session | null
  status: SessionStatus
  isLoading: boolean
  isAuthenticated: boolean
  user: User | null
  role: UserRole | null
  refreshSession: () => Promise<void>
  clearSession: () => void
}

export const useSession = (): UseSessionReturn => {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<SessionStatus>("loading")

  const refreshSession = async () => {
    try {
      const sessionData = await getSession()

      if (sessionData?.user) {
        setSession(sessionData)
        setStatus("authenticated")
      } else {
        setSession(null)
        setStatus("unauthenticated")
      }
    } catch (error) {
      console.error("Error fetching session:", error)
      setSession(null)
      setStatus("unauthenticated")
    }
  }

  const clearSession = () => {
    setSession(null)
    setStatus("unauthenticated")
  }

  useEffect(() => {
    let mounted = true

    const fetchSession = async () => {
      try {
        const sessionData = await getSession()

        if (!mounted) return

        if (sessionData?.user) {
          setSession(sessionData)
          setStatus("authenticated")
        } else {
          setSession(null)
          setStatus("unauthenticated")
        }
      } catch (error) {
        console.error("Error fetching session:", error)
        if (mounted) {
          setSession(null)
          setStatus("unauthenticated")
        }
      }
    }

    fetchSession()

    return () => {
      mounted = false
    }
  }, [])

  return {
    session,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    user: session?.user ?? null,
    role: session?.user?.role ?? null,
    refreshSession,
    clearSession,
  }
}
