import { useState } from 'react';
import { X, Heart, Loader2 } from 'lucide-react';
import { useEmergencyStore } from '../../features/emergency_map/application/useEmergencyStore';
import type { OfferCategory } from '../../features/emergency_map/domain/Offer';

export function OfferFormModal() {
  const { isOfferFormOpen, setOfferFormOpen, submitOffer, isSubmitting } = useEmergencyStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<OfferCategory>('Alimentos');
  const [description, setDescription] = useState('');

  if (!isOfferFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !description) return;

    await submitOffer({
      providerName: name.trim(),
      providerPhone: phone.trim(),
      category,
      description: description.trim()
    });

    // Reset form after successful submission
    setName('');
    setPhone('');
    setCategory('Alimentos');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-brand-50">
          <div className="flex items-center gap-2 text-brand-700">
            <Heart className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Ofrecer Ayuda</h2>
          </div>
          <button 
            onClick={() => setOfferFormOpen(false)}
            className="text-brand-400 hover:text-brand-600 hover:bg-brand-100 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Gracias por tu solidaridad. Registra tu ofrecimiento y nuestro equipo se pondrá en contacto contigo cuando se requiera.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="300 000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
                  value={category}
                  onChange={e => setCategory(e.target.value as OfferCategory)}
                >
                  <option value="Alimentos">Alimentos no perecederos</option>
                  <option value="Agua">Agua potable</option>
                  <option value="Refugio">Refugio temporal</option>
                  <option value="Voluntariado">Voluntariado (Mano de obra)</option>
                  <option value="Herramientas">Herramientas / Maquinaria</option>
                  <option value="Atención Médica">Atención Médica</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Detalles del ofrecimiento</label>
              <textarea 
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe brevemente qué puedes aportar y en qué cantidades o disponibilidad horaria."
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOfferFormOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center min-w-[120px]"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrar Ofrecimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
