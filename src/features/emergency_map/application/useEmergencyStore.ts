import { create } from 'zustand';
import type { EmergencyReport } from '../domain/EmergencyReport';
import type { HelpOffer } from '../domain/Offer';
import { supabaseService } from '../infrastructure/supabaseService';

interface EmergencyState {
  reports: EmergencyReport[];
  offers: HelpOffer[];
  isLoading: boolean;
  isSubmitting: boolean;
  selectedLocation: { lat: number; lng: number } | null;
  activeFilter: string;
  
  // UI States
  isAdmin: boolean;
  isDashboardOpen: boolean;
  isHelpOpen: boolean;
  isOfferFormOpen: boolean;
  isAdminLoginOpen: boolean;
  isSidebarOpen: boolean;
  globalToast: { message: string, visible: boolean } | null;

  // Actions
  fetchReports: () => Promise<void>;
  fetchOffers: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  submitReport: (report: Omit<EmergencyReport, 'id' | 'createdAt' | 'coordinates'>) => Promise<boolean>;
  submitOffer: (offer: Omit<HelpOffer, 'id' | 'createdAt'>) => Promise<boolean>;
  updateReportStatus: (reportId: string, status: EmergencyReport['status']) => Promise<boolean>;
  selectLocation: (coords: { lat: number; lng: number }) => void;
  clearLocation: () => void;
  setFilter: (filter: string) => void;
  
  // UI Actions
  setIsAdmin: (value: boolean) => void;
  setDashboardOpen: (isOpen: boolean) => void;
  setHelpOpen: (isOpen: boolean) => void;
  setOfferFormOpen: (isOpen: boolean) => void;
  setAdminLoginOpen: (isOpen: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

let pollingInterval: number | null = null;

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  reports: [],
  offers: [],
  selectedLocation: null,
  isSubmitting: false,
  isLoading: false,
  activeFilter: 'all',
  
  isAdmin: false,
  isDashboardOpen: false,
  isHelpOpen: false,
  isOfferFormOpen: false,
  isAdminLoginOpen: false,
  isSidebarOpen: false,
  globalToast: null,
  
  setIsAdmin: (value) => set({ isAdmin: value }),
  setDashboardOpen: (isOpen) => set({ isDashboardOpen: isOpen }),
  setHelpOpen: (isOpen) => set({ isHelpOpen: isOpen }),
  setOfferFormOpen: (isOpen) => set({ isOfferFormOpen: isOpen }),
  setAdminLoginOpen: (isOpen) => set({ isAdminLoginOpen: isOpen }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  showToast: (message) => {
    set({ globalToast: { message, visible: true } });
    setTimeout(() => {
      set((state) => (state.globalToast?.message === message ? { globalToast: { message, visible: false } } : state));
    }, 4000);
  },
  hideToast: () => set((state) => (state.globalToast ? { globalToast: { ...state.globalToast, visible: false } } : state)),

  setFilter: (filter) => set({ activeFilter: filter }),
  selectLocation: (coords) => set({ selectedLocation: coords }),
  clearLocation: () => set({ selectedLocation: null }),

  fetchReports: async () => {
    try {
      const reports = await supabaseService.getReports();
      set({ reports, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch reports', error);
      set({ isLoading: false });
    }
  },

  fetchOffers: async () => {
    try {
      const offers = await supabaseService.getOffers();
      set({ offers });
    } catch (error) {
      console.error('Failed to fetch offers', error);
    }
  },

  startPolling: () => {
    if (pollingInterval) return;
    // Carga inicial
    set({ isLoading: true });
    get().fetchReports();
    get().fetchOffers();
    
    // Polling cada 30 segundos
    pollingInterval = window.setInterval(() => {
      get().fetchReports();
      get().fetchOffers();
    }, 30000);
  },

  stopPolling: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },

  submitReport: async (reportData) => {
    const { selectedLocation, isSubmitting } = get();
    if (!selectedLocation || isSubmitting) return false;

    set({ isSubmitting: true });
    try {
      const newReport = await supabaseService.createReport({
        ...reportData,
        coordinates: selectedLocation,
      });
      set(state => ({ 
        reports: [newReport, ...state.reports],
        selectedLocation: null,
        isSubmitting: false 
      }));
      return true;
    } catch (error) {
      console.error('Failed to submit report', error);
      get().showToast('Error al enviar el reporte.');
      set({ isSubmitting: false });
      return false;
    }
  },

  submitOffer: async (offerData) => {
    if (get().isSubmitting) return false;
    
    set({ isSubmitting: true });
    try {
      const newOffer = await supabaseService.createOffer(offerData);
      set(state => ({
        offers: [newOffer, ...state.offers],
        isSubmitting: false,
        isOfferFormOpen: false
      }));
      get().showToast('¡Gracias por tu ofrecimiento! Nos pondremos en contacto.');
      return true;
    } catch (error) {
      console.error('Failed to submit offer', error);
      get().showToast('Error al registrar el ofrecimiento.');
      set({ isSubmitting: false });
      return false;
    }
  },

  updateReportStatus: async (reportId, status) => {
    try {
      await supabaseService.updateReportStatus(reportId, status);
      // Optimistic update
      set(state => ({
        reports: state.reports.map(r => r.id === reportId ? { ...r, status } : r)
      }));
      get().showToast('Estado del reporte actualizado.');
      return true;
    } catch(error) {
      get().showToast('Error al actualizar el estado.');
      return false;
    }
  }
}));
