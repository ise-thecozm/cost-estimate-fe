
export interface EstimationInputs {
  homeCountry: string;
  hostCountry: string;
  monthlySalary: number;
  durationMonths: number;
  dailyAllowance: number;
  workingDaysPerMonth: number;
}

export interface EstimationResults {
  baseSalary: number;
  perDiem: number;
  adminFees: number;
  hostTax: number;
  hostSocialSecurity: number;
  totalAdditionalCost: number;
}

export enum Tab {
  SINGLE = 'Single Engineer',
  BATCH = 'Batch Process'
}
