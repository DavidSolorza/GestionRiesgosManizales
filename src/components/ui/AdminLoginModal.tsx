import { useState } from 'react';
import { X, Lock, ShieldAlert } from 'lucide-react';
import { useEmergencyStore } from '../../features/emergency_map/application/useEmergencyStore';
import { env } from '../../core/config/env';

export function AdminLoginModal() {
  const { isAdminLoginOpen, setAdminLoginOpen, setIsAdmin, showToast } = useEmergencyStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === env.adminPassword) {
      setIsAdmin(true);
      setAdminLoginOpen(false);
      showToast('Modo administrador activado');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800">
            <Lock className="w-5 h-5 text-brand-600" />
            <h2 className="font-semibold text-lg">Panel de Administración</h2>
          </div>
          <button 
            onClick={() => setAdminLoginOpen(false)}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Ingresa la contraseña para habilitar el modo administrador y poder cambiar el estado de los reportes.
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
              placeholder="••••••••"
              autoFocus
            />
            {error && (
              <div className="mt-2 flex items-center gap-1.5 text-alert-600 text-sm">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
}
