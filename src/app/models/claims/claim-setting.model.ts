export interface ClaimType {
  code: string;
  name: string;
  description: string;
  active: boolean;
  receiptRequired: boolean;
  maxAmount: string;
  effectiveFrom: string;
  effectiveTo: string;
}
