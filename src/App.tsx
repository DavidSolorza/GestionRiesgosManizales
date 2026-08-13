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
  const { startPolling, stopPolling, reports, setSidebarOpen } = useEmergencyStore();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return (
    <div className="w-full h-screen font-sans relative overflow-hidden bg-slate-50">
      <TopNavbar />
      
      {/* Map occupies full screen on mobile, and the remaining space on desktop */}
      <main className="w-full h-full pt-[60px] lg:pr-[400px]">
        <MapView />
      </main>

      {/* Floating Action Button only on mobile to open Sidebar */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-slate-900 text-white px-6 py-3 rounded-full font-semibold shadow-2xl flex items-center gap-2 active:scale-95 transition-all"
      >
        <span>Ver </span>
        <span className="bg-brand-500 px-2 py-0.5 rounded text-xs font-bold">{reports.length}</span>
        <span> Reportes</span>
      </button>

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
