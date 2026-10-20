export type CompanyFinancialYearStartMonth =
  | 'JANUARY'
  | 'FEBRUARY'
  | 'MARCH'
  | 'APRIL'
  | 'MAY'
  | 'JUNE'
  | 'JULY'
  | 'AUGUST'
  | 'SEPTEMBER'
  | 'OCTOBER'
  | 'NOVEMBER'
  | 'DECEMBER';

export interface Company {
  id: string;
  name: string;
  registrationNo: string;
  contactNo: string;
  email: string;
  sstNo?: string;
  taxNo?: string;
  website?: string;
  logo?: string;
  financialStartingMonth: CompanyFinancialYearStartMonth;
  businessAddressLine1: string;
  businessAddressLine2: string;
  businessCity: string;
  businessPostcode: string;
  businessState: string;
  businessCountry: string;
}
