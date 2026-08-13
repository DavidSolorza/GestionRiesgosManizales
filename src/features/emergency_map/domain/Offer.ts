export type OfferCategory = 'Alimentos' | 'Agua' | 'Refugio' | 'Voluntariado' | 'Herramientas' | 'Atención Médica' | 'Otro';

export interface HelpOffer {
  id: string;
  providerName: string;
  providerPhone: string;
  category: OfferCategory;
  description: string;
  createdAt: string;
}
