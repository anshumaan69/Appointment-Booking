"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateTimeSlots, getNext5Days, TimeSlot } from "@/utils/timeSlots"

interface Calendar24Props {
  onDateChange?: (date: Date | null) => void
  onTimeChange?: (time: string) => void
  selectedDate?: Date | null
  selectedTime?: string
}

export function Calendar24({ 
  onDateChange, 
  onTimeChange, 
  selectedDate, 
  selectedTime 
}: Calendar24Props) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDateStr, setSelectedDateStr] = useState<string>("")

  const next5Days = getNext5Days()

  // Fetch availability when date changes
  useEffect(() => {
    if (selectedDateStr) {
      fetchAvailability(selectedDateStr)
    }
  }, [selectedDateStr])

  const fetchAvailability = async (date: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/availability?date=${date}`)
      const data = await response.json()
      
      if (response.ok) {
        const slots = generateTimeSlots(data.bookedSlots || [])
        setAvailableSlots(slots)
      } else {
        console.error('Failed to fetch availability')
        setAvailableSlots(generateTimeSlots())
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
      setAvailableSlots(generateTimeSlots())
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (dateStr: string) => {
    setSelectedDateStr(dateStr)
    const date = new Date(dateStr)
    onDateChange?.(date)
    onTimeChange?.("") // Reset time selection
  }

  const handleTimeSelect = (timeValue: string) => {
    onTimeChange?.(timeValue)
  }

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {next5Days.map((day) => (
              <Button
                key={day.value}
                variant={selectedDateStr === day.value ? "default" : "outline"}
                className="justify-start h-auto p-4"
                onClick={() => handleDateSelect(day.value)}
              >
                <div className="text-left">
                  <div className="font-medium">{day.display}</div>
                  <div className="text-sm text-muted-foreground">{day.value}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Selection */}
      {selectedDateStr && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Time</CardTitle>
            <p className="text-sm text-muted-foreground">Business Hours: 9:00 AM - 9:00 PM</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <p>Loading available times...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.value}
                    variant={selectedTime === slot.value ? "default" : "outline"}
                    className={`justify-center h-auto p-3 ${
                      !slot.available 
                        ? "opacity-50 cursor-not-allowed bg-red-50 text-red-500 border-red-200" 
                        : ""
                    }`}
                    onClick={() => slot.available && handleTimeSelect(slot.value)}
                    disabled={!slot.available}
                  >
                    <div className="text-center">
                      <div className="font-medium">{slot.display}</div>
                      {!slot.available && (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded mt-1 inline-block">
                          Booked
                        </span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
