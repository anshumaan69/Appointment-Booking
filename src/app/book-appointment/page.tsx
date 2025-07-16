"use client"

import React, { useState } from 'react'
import  { Calendar24 } from '@/components/DateAndTime'
import { SelectDemo } from '@/components/selector'
import { Button } from '@/components/ui/button'

const BookingPage = () => {
  // State to store form values
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

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
      // TODO: This will be updated when we implement appointment booking API
      console.log("Booking data:", {
        date: selectedDate,
        time: selectedTime,
        serviceId: selectedService  // Now this contains the service ID from database
      })
      
      setSuccess("Appointment booked successfully!")
      
      // Reset form
      setSelectedDate(null)
      setSelectedTime("")
      setSelectedService("")
      
    } catch (err) {
      console.error('Booking error:', err)
      setError("Failed to book appointment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {/* Success message */}
        {success && (
          <div className="text-green-600 bg-green-50 p-3 rounded-md text-sm">
            {success}
          </div>
        )}

        {/* Date and Time Picker */}
        <Calendar24 
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
        
        {/* Service Selector */}
        <SelectDemo 
          onServiceChange={setSelectedService}
          selectedService={selectedService}
        />
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </Button>
        
        {/* Debug info - remove this later */}
        <div className="text-sm text-gray-500 mt-4">
          <p>Selected Date: {selectedDate?.toLocaleDateString() || "None"}</p>
          <p>Selected Time: {selectedTime || "None"}</p>
          <p>Selected Service: {selectedService || "None"}</p>
        </div>
      </form>
    </div>
  )
}

export default BookingPage