import { create } from 'zustand';
import type { Coordinates, EmergencyReport } from '../domain/EmergencyReport';
import { emergencyService } from '../infrastructure/emergencyService';

interface EmergencyState {
  reports: EmergencyReport[];
  selectedLocation: Coordinates | null;
  isSubmitting: boolean;
  isLoading: boolean;
  selectLocation: (coords: Coordinates) => void;
  clearLocation: () => void;
  fetchReports: () => Promise<void>;
  submitReport: (reportData: Omit<EmergencyReport, 'id' | 'createdAt' | 'coordinates'>) => Promise<boolean>;
}

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  reports: [],
  selectedLocation: null,
  isSubmitting: false,
  isLoading: false,

  selectLocation: (coords) => set({ selectedLocation: coords }),
  clearLocation: () => set({ selectedLocation: null }),

  fetchReports: async () => {
    set({ isLoading: true });
    try {
      const data = await emergencyService.getReports();
      set({ reports: data });
    } catch (error) {
      console.error("Error fetching reports", error);
    } finally {
      set({ isLoading: false });
    }
  },

  submitReport: async (reportData) => {
    const { selectedLocation, reports } = get();
    if (!selectedLocation) return false;

    set({ isSubmitting: true });
    try {
      const newReport = await emergencyService.createReport({
        ...reportData,
        coordinates: selectedLocation,
      });
      
      set({ 
        reports: [...reports, newReport],
        selectedLocation: null 
      });
      return true;
    } catch (error) {
      console.error("Error submitting report", error);
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  }
}));
