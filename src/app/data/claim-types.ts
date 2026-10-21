import type { ClaimTypeSetting } from '../models/claim-setting.model';
import type { ClaimType } from '../models/claim.model';

export const claimTypes: ClaimTypeSetting[] = [
  { code: 'TRV', name: 'Travel', description: 'Travel fares and business transportation expenses.', status: 'ACTIVE' },
  { code: 'MEAL', name: 'Meals', description: 'Meals purchased during approved business activities.', status: 'ACTIVE' },
  { code: 'ACCOM', name: 'Accommodation', description: 'Accommodation expenses for approved business travel.', status: 'ACTIVE' },
  { code: 'TRANS', name: 'Transportation', description: 'Parking, tolls, mileage, and other transport costs.', status: 'ACTIVE' },
  { code: 'MED', name: 'Medical', description: 'Eligible medical expenses.', status: 'ACTIVE' },
  { code: 'COMM', name: 'Communication', description: 'Business phone and data expenses.', status: 'ACTIVE' },
  { code: 'OTH', name: 'Other', description: 'Other approved business expenses.', status: 'ACTIVE' }
];

export function getClaimTypeLabel(code: ClaimType): string {
  const configuredType = claimTypes.find(item => item.code === code);
  if (configuredType) return configuredType.name;

  return code
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}
