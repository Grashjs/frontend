export enum PlanFeature {
  PREVENTIVE_MAINTENANCE = 'PREVENTIVE_MAINTENANCE',
  CHECKLIST = 'CHECKLIST',
  FILE = 'FILE',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  METER = 'METER',
  REQUEST_CONFIGURATION = 'REQUEST_CONFIGURATION',
  ADDITIONAL_TIME = 'ADDITIONAL_TIME',
  ADDITIONAL_COST = 'ADDITIONAL_COST',
  ANALYTICS = 'ANALYTICS',
  REQUEST_PORTAL = 'REQUEST_PORTAL',
  SIGNATURE = 'SIGNATURE',
  ROLE = 'ROLE'
}
export interface SubscriptionPlan {
  id: number;
  name: string;
  monthlyCostPerUser: number;
  yearlyCostPerUser: number;
  code: 'FREE' | 'STARTER' | 'BUSINESS' | 'PROFESSIONAL';
  features: PlanFeature[];
}
