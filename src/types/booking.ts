export interface Booking {
  id: string;
  apartmentId: string;
  apartmentName: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Apartment {
  id: string;
  name: string;
  description?: string;
  maxGuests: number;
  color: string; // Hex color for display
}

export interface BookingFormData {
  apartmentId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  resource?: Booking;
}

export interface DateRange {
  start: Date;
  end: Date;
}