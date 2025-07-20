"use client"

import React, { useState } from 'react'
import  { Calendar24 } from '@/components/NewDateAndTime'
import { SelectDemo } from '@/components/selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

const BookingPage = () => {
  // State to store form values
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const router = useRouter()

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    // Validate form
    if (!selectedDate) {
      setError("Please select a date")
      return
    }
    if (!selectedTime) {
      setError("Please select a time")
      return
    }
    if (!selectedService) {
      setError("Please select a service")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0],
          timeSlot: selectedTime,
          serviceId: selectedService
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Success - show success message and reset form
        setSuccess("Appointment booked successfully!")
        setSelectedDate(null)
        setSelectedTime("")
        setSelectedService("")
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        // API returned an error
        setError(data.error || "Failed to book appointment. Please try again.")
      }
      
    } catch (err) {
      console.error('Booking error:', err)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{success}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Book Your Appointment</CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-300">Choose your preferred date, time, and service</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error message */}
              {error && (
                <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <Calendar24 
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <SelectDemo 
                    onServiceChange={setSelectedService}
                    selectedService={selectedService}
                  />
                </CardContent>
              </Card>
              
              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg"
                  disabled={isSubmitting || !selectedDate || !selectedTime || !selectedService}
                >
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BookingPage