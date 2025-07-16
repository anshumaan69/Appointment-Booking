"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ModeToggle } from "@/components/Dark-toggle"


export default function Dashboard() {
  const { user, isLoggedIn, logout } = useAuth()
  const router = useRouter()

  // If not logged in, redirect to login
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  // Don't show dashboard if not logged in
  if (!isLoggedIn) {
    return <div>Please log in...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={logout} variant="outline">
          Logout
        </Button> 
        <ModeToggle />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Hello, <strong>{user?.name}</strong></p>
          <p>Email: {user?.email}</p>
        </CardContent>
      </Card>
    </div>
  )
}
