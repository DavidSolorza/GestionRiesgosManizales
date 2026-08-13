import { ChevronDown, Plus, Heart, LayoutDashboard, HelpCircle } from 'lucide-react';

export function TopNavbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] bg-white border-b border-slate-200 shadow-sm h-[60px] flex items-center px-4 justify-between">
      <div className="flex items-center gap-4">
        {/* Dropdown de ubicación */}
        <button className="flex items-center gap-2 px-4 py-1.5 border border-brand-600 text-brand-700 rounded-full font-semibold text-sm hover:bg-brand-50 transition-colors">
          Manizales y alrededores
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Botón Principal */}
        <button className="flex items-center gap-2 px-4 py-1.5 border border-brand-600 text-brand-700 rounded-full font-semibold text-sm hover:bg-brand-50 transition-colors">
          <Plus className="w-4 h-4" />
          Reportar necesidad
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-300 text-slate-700 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors">
          <Heart className="w-4 h-4 text-yellow-500" />
          Ofrecimientos
        </button>
        
        <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-300 text-slate-700 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors">
          <LayoutDashboard className="w-4 h-4 text-green-500" />
          Dashboard
        </button>

        <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-300 text-brand-700 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors">
          <HelpCircle className="w-4 h-4 text-red-500" />
          Ayuda
        </button>

        <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-300 text-slate-700 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors">
          Panel admin
        </button>
      </div>
    </header>
  );
}
