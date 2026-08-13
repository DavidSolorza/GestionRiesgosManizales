import { MapView } from './features/emergency_map/infrastructure/views/MapView';
import { Sidebar } from './features/emergency_map/infrastructure/views/Sidebar';
import { TopNavbar } from './components/ui/TopNavbar';
import { AdminLoginModal } from './components/ui/AdminLoginModal';
import { DashboardModal } from './components/ui/DashboardModal';
import { HelpModal } from './components/ui/HelpModal';
import { OfferFormModal } from './components/ui/OfferFormModal';
import { GlobalToast } from './components/ui/GlobalToast';

function App() {
  return (
    <div className="w-full h-screen font-sans relative overflow-hidden bg-slate-50">
      <TopNavbar />
      
      {/* Map occupies the remaining screen space to the left of the sidebar */}
      <main className="w-full h-full pt-[60px] pr-[400px]">
        <MapView />
      </main>

      <Sidebar />
      
      {/* Modals and Global UI */}
      <AdminLoginModal />
      <DashboardModal />
      <HelpModal />
      <OfferFormModal />
      <GlobalToast />
    </div>
  );
}

export default App;
