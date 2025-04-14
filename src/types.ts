export interface MarketingTool {
  id: string;
  name: string;
  category: string;
  cost: number;
  billingCycle: string;
  usageFrequency: string;
  usageScore: number;
  integrations: string[];
  dataFlow: string;
}

export interface Category {
  id: string;
  name: string;
}