import { MapView } from './features/emergency_map/infrastructure/views/MapView';
import { Sidebar } from './features/emergency_map/infrastructure/views/Sidebar';

function App() {
  return (
    <div className="w-full h-screen font-sans flex relative overflow-hidden bg-slate-50">
      <header className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 p-4 h-[72px]">
        <div className="max-w-full mx-auto flex items-center justify-between px-2">
          <h1 className="text-xl font-bold text-brand-700 tracking-tight">SismoAlert Manizales</h1>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Modo PWA Activo
          </div>
        </div>
      </header>
      
      <Sidebar />
      
      {/* Map occupies the remaining screen space to the right of the sidebar */}
      <main className="w-full h-full pt-[72px] pl-80">
        <MapView />
      </main>
    </div>
  );
}

export default App;
