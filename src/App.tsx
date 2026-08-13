import { MapView } from './features/emergency_map/infrastructure/views/MapView';

function App() {
  return (
    <div className="w-full h-screen font-sans">
      <header className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-brand-700 tracking-tight">SismoAlert Manizales</h1>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Modo PWA Activo
          </div>
        </div>
      </header>
      
      {/* Map occupies the entire screen behind the absolute header */}
      <main className="w-full h-full pt-[72px]">
        <MapView />
      </main>
    </div>
  );
}

export default App;
