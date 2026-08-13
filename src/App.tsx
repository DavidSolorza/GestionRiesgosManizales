import { useEffect } from 'react';
import { MapView } from './features/emergency_map/infrastructure/views/MapView';
import { Sidebar } from './features/emergency_map/infrastructure/views/Sidebar';
import { TopNavbar } from './components/ui/TopNavbar';
import { DashboardModal } from './components/ui/DashboardModal';
import { HelpModal } from './components/ui/HelpModal';
import { OfferFormModal } from './components/ui/OfferFormModal';
import { GlobalToast } from './components/ui/GlobalToast';
import { useEmergencyStore } from './features/emergency_map/application/useEmergencyStore';

function App() {
  const { startPolling, stopPolling } = useEmergencyStore();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return (
    <div className="w-full h-screen font-sans relative overflow-hidden bg-slate-50">
      <TopNavbar />
      
      {/* Map occupies the remaining screen space to the left of the sidebar on desktop, and top on mobile */}
      <main className="w-full h-full pt-[60px] lg:pr-[400px] pb-[45vh] lg:pb-0">
        <MapView />
      </main>

      <Sidebar />
      
      {/* Modals and Global UI */}
      <DashboardModal />
      <HelpModal />
      <OfferFormModal />
      <GlobalToast />
    </div>
  );
}

export default App;
