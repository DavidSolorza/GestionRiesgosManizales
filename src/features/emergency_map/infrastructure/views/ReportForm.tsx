import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import type { EmergencySeverity, EmergencyStatus } from '../../domain/EmergencyReport';
import { useEmergencyStore } from '../../application/useEmergencyStore';
import { Captcha } from '../../../../components/ui/Captcha';

interface ReportFormProps {
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; severity: EmergencySeverity; reporterName: string; reporterPhone: string; needs: string; status: EmergencyStatus }) => void;
}

export function ReportForm({ onClose, onSubmit }: ReportFormProps) {
  const { isSubmitting } = useEmergencyStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<EmergencySeverity>('medium');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [needs, setNeeds] = useState('Alimentos');

  // CAPTCHA State
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [showCaptchaError, setShowCaptchaError] = useState(false);

  // Prevención de XSS básica eliminando tags
  const sanitizeInput = (input: string) => {
    return input.replace(/<[^>]*>?/gm, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaValid) {
      setShowCaptchaError(true);
      return;
    }
    setShowCaptchaError(false);
    
    const cleanTitle = sanitizeInput(title.trim());
    const cleanDescription = sanitizeInput(description.trim());
    const cleanName = sanitizeInput(reporterName.trim());
    const cleanPhone = sanitizeInput(reporterPhone.trim());

    if (!cleanTitle || !cleanName || !cleanPhone) return;

    onSubmit({
      title: cleanTitle,
      description: cleanDescription,
      severity,
      reporterName: cleanName,
      reporterPhone: cleanPhone,
      needs,
      status: 'requiere_ayuda'
    });
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] w-full max-w-sm">
      <div className="bg-white/95 rounded-2xl shadow-2xl border border-white/40 p-5 animate-in slide-in-from-right-8 fade-in duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-brand-700">
            <MapPin className="w-5 h-5" />
            <h3 className="font-semibold">Reportar Emergencia</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-white/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo <span className="text-alert-600">*</span></label>
            <input 
              type="text" 
              required
              maxLength={100}
              placeholder="Ej. Juan Pérez"
              className="w-full px-3 py-2 bg-white/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono de Contacto <span className="text-alert-600">*</span></label>
            <input 
              type="tel" 
              required
              maxLength={15}
              placeholder="Ej. 300 123 4567"
              className="w-full px-3 py-2 bg-white/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título del Evento <span className="text-alert-600">*</span></label>
            <input 
              type="text" 
              required
              maxLength={100}
              placeholder="Ej. Deslizamiento en vía principal"
              className="w-full px-3 py-2 bg-white/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">¿Qué se necesita? <span className="text-alert-600">*</span></label>
            <select 
              className="w-full px-3 py-2 bg-white/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
            >
              <option value="Alimentos">Alimentos</option>
              <option value="Agua">Agua potable</option>
              <option value="Refugio">Refugio temporal</option>
              <option value="Atención Médica">Atención Médica</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea 
              rows={3}
              maxLength={500}
              placeholder="Detalles adicionales sobre la emergencia..."
              className="w-full px-3 py-2 bg-white/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Severidad</label>
            <select 
              className="w-full px-3 py-2 bg-white/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as EmergencySeverity)}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>

          <div>
            <Captcha onVerify={setIsCaptchaValid} />
            {showCaptchaError && !isCaptchaValid && (
              <p className="text-alert-600 text-xs mt-1 font-medium">Por favor completa la verificación de seguridad correctamente.</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:active:scale-100 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Enviar Reporte'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
