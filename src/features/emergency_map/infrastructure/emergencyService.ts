import type { EmergencyReport, IEmergencyRepository } from '../domain/EmergencyReport';

class EmergencyService implements IEmergencyRepository {
  private reports: EmergencyReport[] = [];

  async createReport(report: Omit<EmergencyReport, 'id' | 'createdAt'>): Promise<EmergencyReport> {
    // Simulando latencia de red (preparando para consumir HTTP puro a Supabase después)
    await new Promise(resolve => setTimeout(resolve, 800));

    const newReport: EmergencyReport = {
      ...report,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.reports.push(newReport);
    return newReport;
  }

  async getReports(): Promise<EmergencyReport[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.reports];
  }
}

export const emergencyService = new EmergencyService();
