"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode
  redirectTo?: string
}

export function RedirectIfAuthenticated({ 
  children, 
  redirectTo = '/dashboard' 
}: RedirectIfAuthenticatedProps) {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn && user) {
      router.push(redirectTo)
    }
  }, [isLoggedIn, user, router, redirectTo])

  // Don't render children if authenticated (will redirect)
  if (isLoggedIn) {
    return null
  }

  return <>{children}</>
}
