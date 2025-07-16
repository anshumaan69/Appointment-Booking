import * as React from "react"
import { useEffect, useState } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Service type definition
interface Service {
  _id: string
  name: string
  description: string
  duration: number
  price: number
}

interface SelectDemoProps {
  onServiceChange?: (service: string) => void
  selectedService?: string
}

export function SelectDemo({ onServiceChange, selectedService }: SelectDemoProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  // Fetch services from API on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/services')
        
        if (!response.ok) {
          throw new Error('Failed to fetch services')
        }
        
        const data = await response.json()
        setServices(data)
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <Select value={selectedService} onValueChange={onServiceChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={loading ? "Loading..." : "Select a service"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Services</SelectLabel>
          {loading ? (
            <SelectItem value="loading" disabled>Loading services...</SelectItem>
          ) : error ? (
            <SelectItem value="error" disabled>Error loading services</SelectItem>
          ) : services.length === 0 ? (
            <SelectItem value="empty" disabled>No services available</SelectItem>
          ) : (
            services.map((service) => (
              <SelectItem key={service._id} value={service._id}>
                {service.name} - ${service.price} ({service.duration} min)
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
