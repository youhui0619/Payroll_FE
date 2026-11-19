export interface ClaimType {
  id: string;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
  receiptRequired: boolean;
  maxAmount: string | null;
  effectiveFrom: Date;
  effectiveTo: Date | null;
}
