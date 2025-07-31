import { Apartment } from '@/types/booking';

export const apartments: Apartment[] = [
  {
    id: 'apt-1',
    name: 'Studio Montmartre',
    description: 'Charmant studio avec vue sur Sacré-Cœur',
    maxGuests: 2,
    color: '#8B5CF6'
  },
  {
    id: 'apt-2',
    name: 'Appartement Marais',
    description: 'Appartement 2 pièces dans le quartier historique',
    maxGuests: 4,
    color: '#10B981'
  },
  {
    id: 'apt-3',
    name: 'Loft Bastille',
    description: 'Grand loft moderne près de la Place de la Bastille',
    maxGuests: 6,
    color: '#F59E0B'
  },
  {
    id: 'apt-4',
    name: 'Duplex Champs-Élysées',
    description: 'Duplex de luxe sur les Champs-Élysées',
    maxGuests: 8,
    color: '#EF4444'
  },
  {
    id: 'apt-5',
    name: 'Studio Latin',
    description: 'Studio confortable dans le Quartier Latin',
    maxGuests: 2,
    color: '#3B82F6'
  }
];

export const getApartmentById = (id: string): Apartment | undefined => {
  return apartments.find(apt => apt.id === id);
};

export const getApartmentColor = (id: string): string => {
  const apartment = getApartmentById(id);
  return apartment?.color || '#6B7280';
};