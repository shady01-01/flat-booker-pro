import { useState, useEffect } from 'react';
import { Dashboard } from "@/components/Dashboard";
import { BookingsManagement } from "@/pages/BookingsManagement";
import { Navigation } from "@/components/Navigation";
import { initializeSampleData } from "@/data/sampleBookings";

const Index = () => {
  const [currentView, setCurrentView] = useState<'calendar' | 'bookings'>('calendar');

  // Initialize sample data on first load
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="container mx-auto px-4 py-6">
        {currentView === 'calendar' ? <Dashboard /> : <BookingsManagement />}
      </main>
    </div>
  );
};

export default Index;
