export interface Coordinates {
  lat: number;
  lng: number;
}

export type EmergencySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface EmergencyReport {
  id: string;
  title: string;
  description: string;
  severity: EmergencySeverity;
  coordinates: Coordinates;
  reporterName: string;
  reporterPhone: string;
  createdAt: string;
}

export interface IEmergencyRepository {
  createReport(report: Omit<EmergencyReport, 'id' | 'createdAt'>): Promise<EmergencyReport>;
  getReports(): Promise<EmergencyReport[]>;
}
