"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Settings, Users, Calendar } from "lucide-react"

export default function AdminDashboard() {
  const { user, isLoggedIn, isAdmin, isLoading, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalServices: 0,
  totalUsers: 0,
    todayAppointments: 0,
   weeklyAppointments: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      
      const servicesResponse = await fetch('/api/services')
      const services = servicesResponse.ok ? await servicesResponse.json() : []
      
      let users = []
      try {
        const usersResponse = await fetch('/api/admin/users')
        users = usersResponse.ok ? await usersResponse.json() : []
      } catch {
        console.log('Admin users API not available yet')
      }
      
      let appointments = []
      try {
        const appointmentsResponse = await fetch('/api/admin/appointments')
        appointments = appointmentsResponse.ok ? await appointmentsResponse.json() : []
      } catch {
        console.log('Admin appointments API not available yet')
      }
      
      const today = new Date()
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
      
      const todayCount = appointments.filter((apt: {date: string}) => {
        const aptDate = new Date(apt.date)
        return aptDate >= startOfToday && aptDate < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
      }).length
      
      const weekCount = appointments.filter((apt: {date: string}) => {
        const aptDate = new Date(apt.date)
        return aptDate >= startOfWeek
      }).length
      
      setStats({
        totalServices: Array.isArray(services) ? services.length : 0,
        totalUsers: Array.isArray(users) ? users.length : 0,
        todayAppointments: todayCount,
        weeklyAppointments: weekCount
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) return
    
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    if (!isAdmin) {
      router.push('/dashboard')
      return
    }
    
    fetchStats()
  }, [isLoggedIn, isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline">View User Dashboard</Button>
              </Link>
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats.totalServices}
              </div>
              <p className="text-xs text-muted-foreground">Services available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats.todayAppointments}
              </div>
              <p className="text-xs text-muted-foreground">Appointments today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl f
  })

  // Check if user is admin using role fieldont-bold">
                {statsLoading ? '...' : stats.weeklyAppointments}
              </div>
              <p className="text-xs text-muted-foreground">Weekly bookings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/services">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Manage Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Add, edit, or remove services offered to customers
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manage Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                View and manage user accounts and permissions
              </p>
              <p className="text-xs text-gray-500 mt-2">Coming Soon</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                View All Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor and manage all customer appointments
              </p>
              <p className="text-xs text-gray-500 mt-2">Coming Soon</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity to display</p>
              <p className="text-sm">Activity will appear here as users interact with your system</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
