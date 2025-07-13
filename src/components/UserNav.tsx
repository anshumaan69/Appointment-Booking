"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export function UserNav() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        Welcome, <span className="font-medium">{user.name}</span>
      </div>
      <Button onClick={logout} variant="outline" size="sm">
        Logout
      </Button>
    </div>
  )
}
