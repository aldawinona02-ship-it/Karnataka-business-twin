import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Business {
  ubid: string;
  name: string;
  status: 'Active' | 'Dormant' | 'Closed';
  district: string;
  healthScore: number;
  riskScore: number;
  lastInspection: string;
  sector: string;
}
