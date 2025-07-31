import { useState, useEffect, useCallback } from 'react';
import { Booking, BookingFormData } from '@/types/booking';
import { toast } from 'sonner';

const STORAGE_KEY = 'booking-calendar-data';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save bookings to localStorage
  const saveToStorage = useCallback((newBookings: Booking[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        bookings: newBookings,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving bookings:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  }, []);

  // Check for booking conflicts
  const hasConflict = useCallback((newBooking: BookingFormData, excludeId?: string) => {
    const newStart = new Date(newBooking.startDate);
    const newEnd = new Date(newBooking.endDate);

    return bookings.some(booking => {
      if (booking.id === excludeId) return false;
      if (booking.apartmentId !== newBooking.apartmentId) return false;
      if (booking.status === 'cancelled') return false;

      const existingStart = new Date(booking.startDate);
      const existingEnd = new Date(booking.endDate);

      // Check for overlap
      return (newStart < existingEnd && newEnd > existingStart);
    });
  }, [bookings]);

  // Add new booking
  const addBooking = useCallback((bookingData: BookingFormData & { apartmentName: string }) => {
    if (hasConflict(bookingData)) {
      toast.error('Conflit détecté : cet appartement est déjà réservé sur cette période');
      return false;
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      ...bookingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newBookings = [...bookings, newBooking];
    setBookings(newBookings);
    saveToStorage(newBookings);
    toast.success('Réservation créée avec succès');
    return true;
  }, [bookings, hasConflict, saveToStorage]);

  // Update booking
  const updateBooking = useCallback((id: string, bookingData: Partial<BookingFormData & { apartmentName: string }>) => {
    const existingBooking = bookings.find(b => b.id === id);
    if (!existingBooking) {
      toast.error('Réservation introuvable');
      return false;
    }

    const updatedBookingData = { 
      apartmentId: existingBooking.apartmentId,
      guestName: existingBooking.guestName,
      startDate: existingBooking.startDate,
      endDate: existingBooking.endDate,
      status: existingBooking.status,
      ...bookingData 
    };
    
    if (hasConflict(updatedBookingData, id)) {
      toast.error('Conflit détecté : cet appartement est déjà réservé sur cette période');
      return false;
    }

    const newBookings = bookings.map(booking =>
      booking.id === id
        ? { ...booking, ...bookingData, updatedAt: new Date().toISOString() }
        : booking
    );

    setBookings(newBookings);
    saveToStorage(newBookings);
    toast.success('Réservation mise à jour');
    return true;
  }, [bookings, hasConflict, saveToStorage]);

  // Delete booking
  const deleteBooking = useCallback((id: string) => {
    const newBookings = bookings.filter(booking => booking.id !== id);
    setBookings(newBookings);
    saveToStorage(newBookings);
    toast.success('Réservation supprimée');
  }, [bookings, saveToStorage]);

  // Extend booking dates
  const extendBooking = useCallback((id: string, newEndDate: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return false;

    const updatedData = { ...booking, endDate: newEndDate };
    return updateBooking(id, updatedData);
  }, [bookings, updateBooking]);

  return {
    bookings,
    loading,
    addBooking,
    updateBooking,
    deleteBooking,
    extendBooking,
    hasConflict
  };
};