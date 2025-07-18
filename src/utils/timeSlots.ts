export interface TimeSlot {
  value: string;
  display: string;
  available: boolean;
}

export const generateTimeSlots = (bookedSlots: string[] = []): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  // Generate slots from 9 AM to 9 PM (30-minute intervals)
  for (let hour = 9; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip 9:30 PM and later
      if (hour === 21 && minute > 0) break;
      
      const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const timeDisplay = formatTo12Hour(timeValue);
      
      slots.push({
        value: timeValue,
        display: timeDisplay,
        available: !bookedSlots.includes(timeValue)
      });
    }
  }
  
  return slots;
};

export const formatTo12Hour = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getNext5Days = (): Array<{value: string, display: string}> => {
  const days = [];
  const today = new Date();
  
  for (let i = 1; i <= 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const value = date.toISOString().split('T')[0];
    const display = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    
    days.push({ value, display });
  }
  
  return days;
};
