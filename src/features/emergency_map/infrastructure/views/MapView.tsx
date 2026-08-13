import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEmergencyStore } from '../../application/useEmergencyStore';
import { ReportForm } from './ReportForm';
import { ConfirmationModal } from '../../../../components/ui/ConfirmationModal';
import { ToastNotification } from '../../../../components/ui/ToastNotification';
import type { EmergencySeverity } from '../../domain/EmergencyReport';

// Fix for default marker icon in leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
const LocationMarker = () => {
  const selectLocation = useEmergencyStore(state => state.selectLocation);
  const selectedLocation = useEmergencyStore(state => state.selectedLocation);

  useMapEvents({
    click(e) {
      selectLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return selectedLocation === null ? null : (
    <Marker position={selectedLocation}>
      <Popup>Nueva ubicación seleccionada.</Popup>
    </Marker>
  );
};

const MANIZALES_CENTER = { lat: 5.06889, lng: -75.51738 };

export function MapView() {
  const { reports, fetchReports, selectedLocation, clearLocation, submitReport, isSubmitting } = useEmergencyStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState<{title: string, description: string, severity: EmergencySeverity, reporterName: string, reporterPhone: string} | null>(null);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!formData) return;
    
    const success = await submitReport(formData);
    setIsModalOpen(false);
    
    if (success) {
      setShowToast(true);
      setFormData(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const sanitizeHTML = (str: string) => {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-100">
      <MapContainer 
        center={MANIZALES_CENTER} 
        zoom={14} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        
        {reports.map((report) => (
          <Marker key={report.id} position={report.coordinates}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-800 mb-1">{sanitizeHTML(report.title)}</h3>
                <p className="text-sm text-slate-600 mb-1">{sanitizeHTML(report.description)}</p>
                <div className="mb-2 text-xs text-slate-500 font-medium">
                  Reportado por: <span className="text-slate-700">{sanitizeHTML(report.reporterName)}</span>
                  <br/>
                  Tel: <a href={`tel:${sanitizeHTML(report.reporterPhone)}`} className="text-brand-600">{sanitizeHTML(report.reporterPhone)}</a>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase
                  ${report.severity === 'critical' ? 'bg-alert-100 text-alert-600' : 
                    report.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                    report.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-success-100 text-success-600'}`}>
                  {report.severity}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedLocation && !isModalOpen && (
        <ReportForm 
          onClose={clearLocation} 
          onSubmit={handleFormSubmit}
        />
      )}

      <ConfirmationModal 
        isOpen={isModalOpen}
        title="Confirmar Reporte"
        message="¿Estás seguro de registrar esta emergencia en esta ubicación? Esta acción no se puede deshacer de forma inmediata."
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isConfirming={isSubmitting}
      />

      <ToastNotification 
        isVisible={showToast}
        message="Reporte de emergencia registrado exitosamente."
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
