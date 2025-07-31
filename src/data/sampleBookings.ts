import { Booking } from '@/types/booking';

export const sampleBookings: Booking[] = [
  {
    id: '1',
    apartmentId: 'apt-1',
    apartmentName: 'Studio Montmartre',
    guestName: 'Marie Dubois',
    guestEmail: 'marie.dubois@email.com',
    guestPhone: '+33 1 23 45 67 89',
    startDate: new Date(2024, 11, 15).toISOString(), // 15 Décembre 2024
    endDate: new Date(2024, 11, 18).toISOString(),   // 18 Décembre 2024
    status: 'confirmed',
    notes: 'Arrivée tardive prévue',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    apartmentId: 'apt-2',
    apartmentName: 'Appartement Marais',
    guestName: 'Jean Martin',
    guestEmail: 'j.martin@email.com',
    guestPhone: '+33 6 12 34 56 78',
    startDate: new Date(2024, 11, 16).toISOString(), // 16 Décembre 2024
    endDate: new Date(2024, 11, 20).toISOString(),   // 20 Décembre 2024
    status: 'confirmed',
    notes: 'Couple avec enfant',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    apartmentId: 'apt-3',
    apartmentName: 'Loft Bastille',
    guestName: 'Sophie Lambert',
    guestEmail: 'sophie.lambert@email.com',
    startDate: new Date(2024, 11, 14).toISOString(), // 14 Décembre 2024
    endDate: new Date(2024, 11, 17).toISOString(),   // 17 Décembre 2024
    status: 'pending',
    notes: 'En attente de confirmation de paiement',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    apartmentId: 'apt-1',
    apartmentName: 'Studio Montmartre',
    guestName: 'Thomas Rousseau',
    guestEmail: 'thomas.rousseau@email.com',
    guestPhone: '+33 7 89 12 34 56',
    startDate: new Date(2024, 11, 20).toISOString(), // 20 Décembre 2024
    endDate: new Date(2024, 11, 23).toISOString(),   // 23 Décembre 2024
    status: 'confirmed',
    notes: 'Voyage d\'affaires',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    apartmentId: 'apt-4',
    apartmentName: 'Duplex Champs-Élysées',
    guestName: 'Anna Schmidt',
    guestEmail: 'anna.schmidt@email.com',
    startDate: new Date(2024, 11, 12).toISOString(), // 12 Décembre 2024
    endDate: new Date(2024, 11, 19).toISOString(),   // 19 Décembre 2024
    status: 'confirmed',
    notes: 'Touriste allemande - parle français',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initialize sample data in localStorage if not exists
export const initializeSampleData = () => {
  const stored = localStorage.getItem('booking-calendar-data');
  if (!stored) {
    localStorage.setItem('booking-calendar-data', JSON.stringify({
      bookings: sampleBookings,
      lastUpdated: new Date().toISOString()
    }));
  }
};