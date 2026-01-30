// Country model matching backend serializer
export interface Country {
  code: string;
  name: string;
  currency: string;
}

// Configuration data from backend
export interface ConfigData {
  countries: Country[];
  durations: number[];
}

export interface EstimationInputs {
  homeCountry: string;
  hostCountry: string;
  monthlySalary: number;
  durationMonths: number;
  dailyAllowance?: number | null;
  workingDaysPerMonth?: number;
}

export interface EstimationResults {
  baseSalary: number;
  perDiem: number;
  adminFees: number;
  hostTax: number;
  hostSocialSecurity: number;
  totalAdditionalCost: number;
}

// Batch job status types
export type BatchJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface BatchJob {
  id: string;
  status: BatchJobStatus;
  total_rows: number;
  processed_rows: number;
  results: EstimationResults[];
  error_message: string;
  created_at: string;
  updated_at: string;
}

export enum Tab {
  SINGLE = 'Single Engineer',
  BATCH = 'Batch Process'
}
