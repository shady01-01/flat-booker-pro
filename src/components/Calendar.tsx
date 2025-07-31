import { useState, useRef, useCallback } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, PrinterIcon } from 'lucide-react';
import { Booking } from '@/types/booking';
import { apartments, getApartmentColor } from '@/data/apartments';
import { BookingModal } from './BookingModal';
import { useBookings } from '@/hooks/useBookings';

interface CalendarProps {
  bookings: Booking[];
  onBookingUpdate: () => void;
}

export const Calendar = ({ bookings, onBookingUpdate }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBookingData, setNewBookingData] = useState<{
    start: string;
    end: string;
    apartmentId?: string;
  } | null>(null);
  const [dragState, setDragState] = useState<{
    bookingId: string;
    originalEndDate: string;
    newEndDate: string;
  } | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);
  const { addBooking, updateBooking, deleteBooking } = useBookings();

  // Calculate week dates
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Navigation
  const goToPrevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const goToToday = () => setCurrentDate(new Date());

  // Get bookings for a specific day and apartment
  const getBookingForDayAndApartment = (date: Date, apartmentId: string) => {
    return bookings.find(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return booking.apartmentId === apartmentId && 
             date >= start && 
             date < end &&
             booking.status !== 'cancelled';
    });
  };

  // Handle cell double click for new booking
  const handleCellDoubleClick = (date: Date, apartmentId: string) => {
    const existingBooking = getBookingForDayAndApartment(date, apartmentId);
    
    if (existingBooking) {
      // Edit existing booking
      setSelectedBooking(existingBooking);
      setNewBookingData(null);
    } else {
      // Create new booking
      const startDate = format(date, 'yyyy-MM-dd');
      const endDate = format(addDays(date, 1), 'yyyy-MM-dd');
      setNewBookingData({ start: startDate, end: endDate, apartmentId });
      setSelectedBooking(null);
    }
    setIsModalOpen(true);
  };

  // Handle drag to extend booking
  const handleMouseDown = (e: React.MouseEvent, booking: Booking) => {
    e.preventDefault();
    setDragState({
      bookingId: booking.id,
      originalEndDate: booking.endDate,
      newEndDate: booking.endDate
    });
  };

  const handleMouseEnter = (date: Date) => {
    if (dragState) {
      const newEndDate = addDays(date, 1).toISOString();
      setDragState(prev => prev ? { ...prev, newEndDate } : null);
    }
  };

  const handleMouseUp = () => {
    if (dragState) {
      setDragState(null);
    }
  };

  // Save extended booking
  const saveDraggedBooking = () => {
    if (dragState) {
      const success = updateBooking(dragState.bookingId, { 
        endDate: dragState.newEndDate 
      });
      if (success) {
        onBookingUpdate();
      }
      setDragState(null);
    }
  };

  // Cancel drag
  const cancelDrag = () => {
    setDragState(null);
  };

  // Handle modal submit
  const handleModalSubmit = (data: any) => {
    if (selectedBooking) {
      const success = updateBooking(selectedBooking.id, data);
      if (success) onBookingUpdate();
    } else {
      const success = addBooking(data);
      if (success) onBookingUpdate();
    }
    setIsModalOpen(false);
    setSelectedBooking(null);
    setNewBookingData(null);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    deleteBooking(id);
    onBookingUpdate();
  };

  // Print calendar
  const handlePrint = async () => {
    if (typeof window !== 'undefined') {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      if (calendarRef.current) {
        const canvas = await html2canvas(calendarRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgWidth = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`calendrier-${format(currentDate, 'yyyy-MM-dd')}.pdf`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Calendrier des Réservations
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Aujourd'hui
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <PrinterIcon className="h-4 w-4" />
            Imprimer PDF
          </Button>
          
          <Button variant="outline" size="sm" onClick={goToPrevWeek}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          <span className="text-lg font-medium min-w-[200px] text-center">
            {format(weekStart, 'dd MMM', { locale: fr })} - {format(weekEnd, 'dd MMM yyyy', { locale: fr })}
          </span>
          
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Drag Controls */}
      {dragState && (
        <Card className="p-4 border-warning bg-warning/5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-warning-foreground">
              Faites glisser pour prolonger la réservation. Nouvelle fin : {format(new Date(dragState.newEndDate), 'dd/MM/yyyy', { locale: fr })}
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveDraggedBooking} variant="success">
                Sauvegarder
              </Button>
              <Button size="sm" variant="outline" onClick={cancelDrag}>
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Calendar */}
      <Card ref={calendarRef} className="calendar-container overflow-hidden">
        <div className="grid grid-cols-8 min-h-[600px]">
          {/* Apartment Names Column */}
          <div className="bg-muted/50 border-r border-border">
            <div className="h-12 border-b border-border flex items-center px-4 font-medium bg-muted">
              Appartements
            </div>
            {apartments.map(apartment => (
              <div
                key={apartment.id}
                className="h-20 border-b border-border flex items-center px-4 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: apartment.color }}
                  />
                  <span className="font-medium">{apartment.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {weekDays.map(day => (
            <div key={day.toISOString()} className="border-r border-border last:border-r-0">
              {/* Day Header */}
              <div className={`h-12 border-b border-border flex flex-col items-center justify-center text-sm ${
                isToday(day) ? 'bg-primary/10 text-primary font-bold' : 'bg-muted/30'
              }`}>
                <span className="font-medium">
                  {format(day, 'EEE', { locale: fr })}
                </span>
                <span className="text-xs">
                  {format(day, 'dd', { locale: fr })}
                </span>
              </div>

              {/* Apartment Rows */}
              {apartments.map(apartment => {
                const booking = getBookingForDayAndApartment(day, apartment.id);
                const isDragTarget = dragState && 
                  new Date(dragState.newEndDate) > day && 
                  bookings.find(b => b.id === dragState.bookingId)?.apartmentId === apartment.id;

                return (
                  <div
                    key={`${day.toISOString()}-${apartment.id}`}
                    className={`h-20 border-b border-border relative cursor-pointer transition-colors ${
                      booking ? 'booking-item' : 'hover:bg-muted/20'
                    } ${isDragTarget ? 'bg-primary/20' : ''}`}
                    onDoubleClick={() => handleCellDoubleClick(day, apartment.id)}
                    onMouseEnter={() => handleMouseEnter(day)}
                    onMouseUp={handleMouseUp}
                  >
                    {booking && (
                      <div
                        className={`absolute inset-1 rounded p-2 text-xs overflow-hidden ${
                          booking.status === 'confirmed' ? 'booking-item reserved' :
                          booking.status === 'pending' ? 'booking-item pending' :
                          'booking-item bg-muted text-muted-foreground'
                        }`}
                        style={{
                          backgroundColor: booking.status === 'confirmed' ? getApartmentColor(booking.apartmentId) : undefined
                        }}
                        onMouseDown={(e) => handleMouseDown(e, booking)}
                      >
                        <div className="font-medium truncate">{booking.guestName}</div>
                        <div className="opacity-80 truncate">{booking.status}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
          setNewBookingData(null);
        }}
        onSubmit={handleModalSubmit}
        onDelete={handleDelete}
        booking={selectedBooking || undefined}
        initialDate={newBookingData ? {
          start: newBookingData.start,
          end: newBookingData.end
        } : undefined}
        initialApartmentId={newBookingData?.apartmentId}
      />
    </div>
  );
};