import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Booking, BookingFormData } from '@/types/booking';
import { apartments, getApartmentById } from '@/data/apartments';
import { CalendarIcon, UserIcon, MailIcon, PhoneIcon, HomeIcon } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData & { apartmentName: string }) => void;
  onDelete?: (id: string) => void;
  booking?: Booking;
  initialDate?: { start: string; end: string };
  initialApartmentId?: string;
}

export const BookingModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  booking,
  initialDate,
  initialApartmentId
}: BookingModalProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    apartmentId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    startDate: '',
    endDate: '',
    status: 'confirmed',
    notes: ''
  });

  // Initialize form data
  useEffect(() => {
    if (booking) {
      setFormData({
        apartmentId: booking.apartmentId,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail || '',
        guestPhone: booking.guestPhone || '',
        startDate: booking.startDate.split('T')[0],
        endDate: booking.endDate.split('T')[0],
        status: booking.status,
        notes: booking.notes || ''
      });
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        apartmentId: initialApartmentId || '',
        startDate: initialDate.start,
        endDate: initialDate.end
      }));
    }
  }, [booking, initialDate, initialApartmentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.apartmentId || !formData.guestName || !formData.startDate || !formData.endDate) {
      return;
    }

    const apartment = getApartmentById(formData.apartmentId);
    if (!apartment) return;

    const submissionData = {
      ...formData,
      apartmentName: apartment.name,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    };

    onSubmit(submissionData);
    onClose();
  };

  const handleDelete = () => {
    if (booking && onDelete) {
      onDelete(booking.id);
      onClose();
    }
  };

  const isEditMode = !!booking;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {isEditMode ? 'Modifier la réservation' : 'Nouvelle réservation'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Apartment Selection */}
          <div className="space-y-2">
            <Label htmlFor="apartment" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Appartement
            </Label>
            <Select 
              value={formData.apartmentId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, apartmentId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un appartement" />
              </SelectTrigger>
              <SelectContent>
                {apartments.map(apartment => (
                  <SelectItem key={apartment.id} value={apartment.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: apartment.color }}
                      />
                      {apartment.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guest Information */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestName" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Nom du client *
              </Label>
              <Input
                id="guestName"
                value={formData.guestName}
                onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
                placeholder="Nom complet"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestEmail" className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, guestEmail: e.target.value }))}
                  placeholder="email@exemple.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestPhone" className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  Téléphone
                </Label>
                <Input
                  id="guestPhone"
                  value={formData.guestPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, guestPhone: e.target.value }))}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date d'arrivée *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de départ *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                min={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'confirmed' | 'pending' | 'cancelled') => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes supplémentaires..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div>
              {isEditMode && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Supprimer
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" variant="gradient">
                {isEditMode ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};