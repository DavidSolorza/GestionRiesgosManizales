import { Plus, ShieldAlert, LayoutDashboard, HelpCircle, MapPin, Loader2, Heart, ShieldCheck, HeartHandshake, AlertTriangle, X } from 'lucide-react';
import { useEmergencyStore } from '../../features/emergency_map/application/useEmergencyStore';
import { useState } from 'react';

function PrivacyNoticeModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado amarillo */}
        <div className="bg-amber-400 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-600/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Aviso de Seguridad y Privacidad</p>
              <h2 className="text-amber-900 font-black text-lg leading-tight">Información de esta página</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-500/40 hover:bg-amber-500/60 flex items-center justify-center transition-colors"
            aria-label="Cerrar aviso de privacidad"
          >
            <X className="w-4 h-4 text-amber-900" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-5 space-y-4">
          {/* Piloto sin ánimo de lucro */}
          <div className="flex gap-3">
            <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Proyecto piloto sin ánimo de lucro</p>
              <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                Esta plataforma es un piloto <strong>completamente gratuito</strong>, desarrollado como iniciativa ciudadana. No se realiza ningún cobro, suscripción ni monetización de ningún tipo.
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Inspiración */}
          <div className="flex gap-3">
            <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Inspirado en la emergencia de Colombia</p>
              <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                Esta herramienta nació como respuesta a los eventos de emergencia ocurridos en <strong>Colombia</strong> centrado en <strong>Manizales</strong>, con el propósito de facilitar la coordinación ciudadana en situaciones de crisis.
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Privacidad de datos */}
          <div className="flex gap-3">
            <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Uso de datos</p>
              <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                La información reportada (ubicación y descripción de necesidades) se usa <strong>únicamente</strong> para mostrarla en el mapa colaborativo. No se almacenan datos personales identificables.
              </p>
            </div>
          </div>
        </div>

        {/* Pie */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 active:scale-[0.98] text-amber-900 font-bold rounded-xl text-sm transition-all"
          >
            Entendido
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">
            GestiónRiesgos · Manizales · Colombia
          </p>
        </div>
      </div>
    </div>
  );
}

export function TopNavbar() {
  const { 
    showToast, 
    setDashboardOpen, 
    setHelpOpen, 
    setOfferFormOpen,
    selectLocation 
  } = useEmergencyStore();

  const [isLocating, setIsLocating] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

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
    <>
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

          {/* Botón Aviso de Privacidad */}
          <button
            id="privacy-notice-btn"
            onClick={() => setIsPrivacyOpen(true)}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-900 rounded-full font-semibold text-xs transition-all shadow-sm"
            title="Aviso de seguridad y privacidad"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Aviso</span>
          </button>

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

      {/* Modal de Aviso de Privacidad */}
      {isPrivacyOpen && <PrivacyNoticeModal onClose={() => setIsPrivacyOpen(false)} />}
    </>
  );
}
