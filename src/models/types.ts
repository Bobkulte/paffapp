export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  description?: string | null;
}

export interface EstimateLine {
  id?: string;
  designation: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalHT: number;
  order: number;
  materialId?: string | null;
}

export interface Estimate {
  id: string;
  reference: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REFUSED';
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientAddress?: string | null;
  clientCity?: string | null;
  clientZipCode?: string | null;
  date: string;
  validityDate?: string | null;
  tvaRate: number;
  notes?: string | null;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  lines: EstimateLine[];
  userId: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  email?: string | null;
  siret?: string | null;
  tvaNumber?: string | null;
  logo?: string | null;
}

export type EstimateStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REFUSED';

export const STATUS_LABELS: Record<EstimateStatus, string> = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyé',
  ACCEPTED: 'Accepté',
  REFUSED: 'Refusé',
};

export const STATUS_COLORS: Record<EstimateStatus, string> = {
  DRAFT: 'bg-iron-200 text-iron-700',
  SENT: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REFUSED: 'bg-red-100 text-red-700',
};

export const CATEGORIES = [
  'Acier',
  'Quincaillerie',
  'Finition',
  "Main d'œuvre",
  'Décoration',
  'Divers',
] as const;

export const UNITS = [
  { value: 'ml', label: 'Mètre linéaire (ml)' },
  { value: 'm²', label: 'Mètre carré (m²)' },
  { value: 'pce', label: 'Pièce (pce)' },
  { value: 'h', label: 'Heure (h)' },
  { value: 'forfait', label: 'Forfait' },
  { value: 'kg', label: 'Kilogramme (kg)' },
] as const;
