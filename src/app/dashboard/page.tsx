"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { ModeToggle } from "@/components/Dark-toggle"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Dashboard() {
  const { user, isLoggedIn, logout } = useAuth()
  const [appointments, setAppointments] = useState([] as any)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch('/api/appointments/user')
      const data = await response.json()
      1
      
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link href="/book-appointment">
            <Button>Book New Appointment</Button>
          </Link>
          <Button onClick={chatBot} variant="outline">
            ChatBot
          </Button> 
          <Button onClick={logout} variant="outline">
            Logout
          </Button> 
          <ModeToggle />
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Hello, <strong>{user?.name}</strong></p>
          <p>Email: {user?.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Appointments</CardTitle>
            <Button onClick={fetchAppointments} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8">
              <p>Loading appointments...</p>
            </div>
          )}
          
          {error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-md mb-4">
              <p>{error}</p>
              <Button onClick={fetchAppointments} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
          )}
          
          {!loading && !error && appointments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No appointments yet.</p>
              <Link href="/book-appointment">
                <Button>Book Your First Appointment</Button>
              </Link>
            </div>
          )}
          {!loading && !error && appointments.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell className="font-medium">
                      {formatDate(appointment.date)}
                    </TableCell>
                    <TableCell>{appointment.timeSlot}</TableCell>
                    <TableCell>{appointment.service?.name || 'Unknown Service'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'booked' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
