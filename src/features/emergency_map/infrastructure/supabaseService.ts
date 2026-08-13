import { httpClient } from '../../../core/http/HttpClient';
import type { EmergencyReport } from '../domain/EmergencyReport';
import type { HelpOffer } from '../domain/Offer';

class SupabaseService {
  async getReports(): Promise<EmergencyReport[]> {
    const data = await httpClient.get<any[]>('reports?order=created_at.desc');
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      severity: 'high', // Dummy mapping if not in DB
      status: item.status,
      needs: item.needs,
      coordinates: {
        lat: Number(item.latitude),
        lng: Number(item.longitude),
      },
      reporterName: item.reporter_name,
      reporterPhone: item.reporter_phone,
      createdAt: item.created_at,
    }));
  }

  async createReport(report: Omit<EmergencyReport, 'id' | 'createdAt'>): Promise<EmergencyReport> {
    const data = await httpClient.post<any[]>('reports', {
      title: report.title,
      description: report.description,
      latitude: report.coordinates.lat,
      longitude: report.coordinates.lng,
      status: report.status,
      reporter_name: report.reporterName,
      reporter_phone: report.reporterPhone,
      needs: report.needs
    });
    
    const item = data[0];
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      severity: report.severity,
      status: item.status,
      needs: item.needs,
      coordinates: {
        lat: Number(item.latitude),
        lng: Number(item.longitude),
      },
      reporterName: item.reporter_name,
      reporterPhone: item.reporter_phone,
      createdAt: item.created_at,
    };
  }

  async updateReportStatus(id: string, status: string): Promise<void> {
    await httpClient.patch(`reports?id=eq.${id}`, { status });
  }

  async getOffers(): Promise<HelpOffer[]> {
    const data = await httpClient.get<any[]>('offers?order=created_at.desc');
    return data.map(item => ({
      id: item.id,
      providerName: item.provider_name,
      providerPhone: item.provider_phone,
      category: item.category,
      description: item.description,
      createdAt: item.created_at,
    }));
  }

  async createOffer(offer: Omit<HelpOffer, 'id' | 'createdAt'>): Promise<HelpOffer> {
    const data = await httpClient.post<any[]>('offers', {
      provider_name: offer.providerName,
      provider_phone: offer.providerPhone,
      category: offer.category,
      description: offer.description
    });
    
    const item = data[0];
    return {
      id: item.id,
      providerName: item.provider_name,
      providerPhone: item.provider_phone,
      category: item.category,
      description: item.description,
      createdAt: item.created_at,
    };
  }
}

export const supabaseService = new SupabaseService();
