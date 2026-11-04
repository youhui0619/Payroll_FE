import type { WorkLocation } from '../../models/workforce/work-location.model';

export const workLocations: WorkLocation[] = [
  {
    id: 'LOC-0001',
    code: 'HQ-KL',
    name: 'Kuala Lumpur Head Office',
    type: 'OFFICE',
    remark: 'Main corporate and administration office.',
    addressLine1: '12 Jalan Sultan Ismail',
    addressLine2: 'Level 8, Menara Sentral',
    city: 'Kuala Lumpur',
    postcode: '50250',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    country: 'MALAYSIA'
  },
  {
    id: 'LOC-0002',
    code: 'BR-PEN',
    name: 'Penang Branch',
    type: 'BRANCH',
    remark: 'Regional sales and customer support branch.',
    addressLine1: '28 Lebuh Pantai',
    addressLine2: 'Suite 3A',
    city: 'George Town',
    postcode: '10300',
    state: 'Pulau Pinang',
    country: 'MALAYSIA'
  },
  {
    id: 'LOC-0003',
    code: 'WH-JB',
    name: 'Johor Bahru Warehouse',
    type: 'WAREHOUSE',
    remark: 'Regional inventory storage and fulfilment location.',
    addressLine1: '45 Jalan Kempas Lama',
    addressLine2: 'Kawasan Perindustrian Kempas',
    city: 'Johor Bahru',
    postcode: '81200',
    state: 'Johor',
    country: 'MALAYSIA'
  }
];
