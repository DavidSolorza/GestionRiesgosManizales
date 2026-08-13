import { Plus, ShieldAlert, LayoutDashboard, HelpCircle, MapPin, Loader2, Heart } from 'lucide-react';
import { useEmergencyStore } from '../../features/emergency_map/application/useEmergencyStore';
import { useState } from 'react';

export function TopNavbar() {
  const { 
    showToast, 
    setDashboardOpen, 
    setHelpOpen, 
    setOfferFormOpen,
    selectLocation 
  } = useEmergencyStore();

  const [isLocating, setIsLocating] = useState(false);

  const handleReportWithLocation = () => {
    if (!navigator.geolocation) {
      showToast('Tu navegador no soporta geolocalización. Haz clic en el mapa manualmente.');
      return;
    }

    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        selectLocation({ 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        });
        showToast('Ubicación obtenida correctamente. Completa tu reporte.');
      },
      (error) => {
        setIsLocating(false);
        console.error("Error obteniendo ubicación:", error);
        showToast('No pudimos acceder a tu ubicación. Por favor, haz clic directamente en el mapa.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm h-[60px] flex items-center px-6 justify-between">
      
      {/* Lado izquierdo */}
      <div className="flex items-center gap-6">
        
        {/* Logo / Título sutil */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-md shadow-brand-200">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-slate-800 tracking-tight text-lg hidden sm:block">
            Gestión<span className="text-brand-600">Riesgos</span>
          </span>
        </div>

        {/* Separador */}
        <div className="w-px h-6 bg-slate-200 hidden md:block"></div>

        {/* Indicador de Ubicación */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-full text-slate-600">
          <MapPin className="w-4 h-4 text-brand-500" />
          <span className="font-medium text-sm">Manizales y alrededores</span>
        </div>
      </div>

      {/* Lado derecho (Acciones) */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button 
          onClick={() => setOfferFormOpen(true)}
          className="flex items-center gap-2 px-2 sm:px-4 py-2 text-slate-600 rounded-full font-medium text-sm hover:bg-slate-100 transition-colors"
          title="Ofrecimientos"
        >
          <Heart className="w-5 h-5 sm:w-4 sm:h-4 text-orange-500" />
          <span className="hidden sm:inline">Ofrecimientos</span>
        </button>

        <button 
          onClick={() => setDashboardOpen(true)}
          className="flex items-center gap-2 px-2 sm:px-4 py-2 text-slate-600 rounded-full font-medium text-sm hover:bg-slate-100 transition-colors"
          title="Dashboard"
        >
          <LayoutDashboard className="w-5 h-5 sm:w-4 sm:h-4 text-green-500" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <button 
          onClick={() => setHelpOpen(true)}
          className="flex items-center gap-2 px-2 sm:px-4 py-2 text-slate-600 rounded-full font-medium text-sm hover:bg-slate-100 transition-colors"
          title="Ayuda"
        >
          <HelpCircle className="w-5 h-5 sm:w-4 sm:h-4 text-red-500" />
          <span className="hidden sm:inline">Ayuda</span>
        </button>

        {/* Separador */}
        <div className="w-px h-6 bg-slate-200 mx-1 sm:mx-2"></div>

        {/* Botón Principal (Reportar con GPS) */}
        <button 
          onClick={handleReportWithLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white rounded-full font-semibold text-sm hover:bg-brand-700 active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:active:scale-100"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>Reportar <span className="hidden sm:inline">necesidad</span></span>
        </button>
      </div>
    </header>
  );
}
