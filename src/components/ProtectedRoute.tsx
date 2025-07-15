"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user !== null && !isLoggedIn) {
      router.push(redirectTo)
    }
  }, [isLoggedIn, user, router, redirectTo])

  // Don't render children if not authenticated
  if (!isLoggedIn) {
    return null
  }

  return <>{children}</>
}
