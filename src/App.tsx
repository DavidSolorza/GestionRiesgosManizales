import { MapView } from './features/emergency_map/infrastructure/views/MapView';
import { Sidebar } from './features/emergency_map/infrastructure/views/Sidebar';
import { TopNavbar } from './components/ui/TopNavbar';

function App() {
  return (
    <div className="w-full h-screen font-sans relative overflow-hidden bg-slate-50">
      <TopNavbar />
      
      {/* Map occupies the remaining screen space to the left of the sidebar */}
      <main className="w-full h-full pt-[60px] pr-[400px]">
        <MapView />
      </main>

      <Sidebar />
    </div>
  );
}

export default App;
