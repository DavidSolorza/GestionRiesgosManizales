import { create } from 'zustand';
import type { EmergencyReport } from '../domain/EmergencyReport';
import type { HelpOffer } from '../domain/Offer';
import { emergencyService } from '../infrastructure/emergencyService';

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
  globalToast: { message: string, visible: boolean } | null;

  // Actions
  fetchReports: () => Promise<void>;
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
  showToast: (message: string) => void;
  hideToast: () => void;
}

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
  globalToast: null,
  
  setIsAdmin: (value) => set({ isAdmin: value }),
  setDashboardOpen: (isOpen) => set({ isDashboardOpen: isOpen }),
  setHelpOpen: (isOpen) => set({ isHelpOpen: isOpen }),
  setOfferFormOpen: (isOpen) => set({ isOfferFormOpen: isOpen }),
  setAdminLoginOpen: (isOpen) => set({ isAdminLoginOpen: isOpen }),
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
    set({ isLoading: true });
    try {
      const reports = await emergencyService.getReports();
      set({ reports, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch reports', error);
      set({ isLoading: false });
    }
  },

  submitReport: async (reportData) => {
    const { selectedLocation } = get();
    if (!selectedLocation) return false;

    set({ isSubmitting: true });
    try {
      const newReport = await emergencyService.createReport({
        ...reportData,
        coordinates: selectedLocation,
      });
      set(state => ({ 
        reports: [...state.reports, newReport],
        selectedLocation: null,
        isSubmitting: false 
      }));
      return true;
    } catch (error) {
      console.error('Failed to submit report', error);
      set({ isSubmitting: false });
      return false;
    }
  },

  submitOffer: async (offerData) => {
    set({ isSubmitting: true });
    try {
      // simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      const newOffer: HelpOffer = {
        ...offerData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      set(state => ({
        offers: [...state.offers, newOffer],
        isSubmitting: false,
        isOfferFormOpen: false
      }));
      get().showToast('¡Gracias por tu ofrecimiento! Nos pondremos en contacto.');
      return true;
    } catch (error) {
      console.error('Failed to submit offer', error);
      set({ isSubmitting: false });
      return false;
    }
  },

  updateReportStatus: async (reportId, status) => {
    try {
      set(state => ({
        reports: state.reports.map(r => r.id === reportId ? { ...r, status } : r)
      }));
      get().showToast('Estado del reporte actualizado.');
      return true;
    } catch(error) {
      return false;
    }
  }
}));
