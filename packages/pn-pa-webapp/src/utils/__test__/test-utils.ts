import { DigitalDomicileType, RecipientType } from '@pagopa-pn/pn-commons';

export const formRecipients = [
  {
    idx: 1,
    recipientType: RecipientType.PF,
    taxId: 'AAAAAA11A11A111A',
    creditorTaxId: '01234567890',
    noticeCode: '12345678',
    firstName: 'TestNome',
    lastName: 'TestCognome',
    type: DigitalDomicileType.PEC,
    digitalDomicile: 'test@email.it',
    at: 'somewhere',
    address: 'Via di qua',
    houseNumber: '1',
    addressDetails: 'address details',
    zip: '12345',
    municipality: 'Comune',
    municipalityDetails: 'Fraction',
    province: 'Province',
    foreignState: 'Foreign State',
    showDigitalDomicile: false,
    showPhysicalAddress: false,
  },
];

export const formattedRecipients = [
  {
    denomination: `TestNome TestCognome`,
    recipientType: RecipientType.PF,
    taxId: 'AAAAAA11A11A111A',
    creditorTaxId: '01234567890',
    token: '12345678',
    digitalDomicile: {
      type: DigitalDomicileType.PEC,
      address: 'test@email.it',
    },
    physicalAddress: {
      at: 'somewhere',
      address: `Via di qua 1`,
      addressDetails: 'address details',
      zip: '12345',
      municipality: 'Comune',
      municipalityDetails: 'Fraction',
      province: 'Province',
      foreignState: 'Foreign State',
    },
  },
];
