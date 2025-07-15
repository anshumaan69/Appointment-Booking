import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectDemoProps {
  onServiceChange?: (service: string) => void
  selectedService?: string
}

export function SelectDemo({ onServiceChange, selectedService }: SelectDemoProps) {
  return (
    <Select value={selectedService} onValueChange={onServiceChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a service" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Services</SelectLabel>
          <SelectItem value="general-checkup">General Checkup</SelectItem>
          <SelectItem value="dental-cleaning">Dental Cleaning</SelectItem>
          <SelectItem value="consultation">Consultation</SelectItem>
          <SelectItem value="vaccination">Vaccination</SelectItem>
          <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
