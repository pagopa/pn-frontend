import { RecipientType } from '@pagopa-pn/pn-commons';

import { randomString } from '../../__test__/test-utils';
import { NewNotificationRecipient, PaymentModel } from '../../models/NewNotification';
import {
  denominationLengthAndCharacters,
  identicalIUV,
  identicalTaxIds,
  taxIdDependingOnRecipientType,
} from '../validation.utility';

describe('test custom validation for recipients', () => {
  it('denominationLengthAndCharacters (no errors)', () => {
    const result = denominationLengthAndCharacters(randomString(5), randomString(5));
    expect(result).toBe(undefined);
  });

  it('denominationTotalLength (errors - too long)', () => {
    const result = denominationLengthAndCharacters(randomString(56), randomString(24));
    expect(result).toStrictEqual({ messageKey: 'too-long-field-error', data: { maxLength: 80 } });
  });

  it('denominationTotalLength (errors - forbidden characters)', () => {
    const result = denominationLengthAndCharacters(randomString(56), 'D’Arco');
    expect(result).toStrictEqual({ messageKey: 'forbidden-characters-denomination-error' });
  });

  it('taxIdDependingOnRecipientType (PF no errors)', () => {
    const result = taxIdDependingOnRecipientType('LVLDAA85T50G702B', RecipientType.PF);
    expect(result).toBeTruthy();
  });

  it('taxIdDependingOnRecipientType (PF errors)', () => {
    const result = taxIdDependingOnRecipientType('fakeTaxId', RecipientType.PF);
    expect(result).toBeFalsy();
  });

  it('taxIdDependingOnRecipientType (PG no errors)', () => {
    const result = taxIdDependingOnRecipientType('12345678910', RecipientType.PG);
    expect(result).toBeTruthy();
  });

  it('taxIdDependingOnRecipientType (PG errors)', () => {
    const result = taxIdDependingOnRecipientType('fakePIva', RecipientType.PG);
    expect(result).toBeFalsy();
  });

  it('identicalTaxIds (no errors)', () => {
    const result = identicalTaxIds([
      { taxId: 'taxId1' },
      { taxId: 'taxId2' },
    ] as Array<NewNotificationRecipient>);
    expect(result).toHaveLength(0);
  });

  it('identicalTaxIds (errors)', () => {
    const result = identicalTaxIds([
      { taxId: 'taxId1' },
      { taxId: 'taxId2' },
      { taxId: 'taxId1' },
    ] as Array<NewNotificationRecipient>);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      {
        messageKey: 'identical-fiscal-codes-error',
        value: { taxId: 'taxId1' },
        id: `recipients[0].taxId`,
      },
      {
        messageKey: 'identical-fiscal-codes-error',
        value: { taxId: 'taxId1' },
        id: `recipients[2].taxId`,
      },
    ]);
  });

  it('identicalIUV (no errors)', () => {
    const result = identicalIUV(
      [
        { creditorTaxId: 'creditorTaxId1', noticeCode: 'noticeCode1' },
        { creditorTaxId: 'creditorTaxId2', noticeCode: 'noticeCode2' },
      ] as Array<NewNotificationRecipient>,
      PaymentModel.PAGO_PA_NOTICE
    );
    expect(result).toHaveLength(0);
  });

  it('identicalIUV (errors)', () => {
    const result = identicalIUV(
      [
        { creditorTaxId: 'creditorTaxId1', noticeCode: 'noticeCode1' },
        { creditorTaxId: 'creditorTaxId2', noticeCode: 'noticeCode2' },
        { creditorTaxId: 'creditorTaxId1', noticeCode: 'noticeCode1' },
      ] as Array<NewNotificationRecipient>,
      PaymentModel.PAGO_PA_NOTICE
    );
    expect(result).toHaveLength(4);
    expect(result).toStrictEqual([
      {
        messageKey: 'identical-notice-codes-error',
        value: { creditorTaxId: 'creditorTaxId1', noticeCode: 'noticeCode1' },
        id: `recipients[0].noticeCode`,
      },
      {
        messageKey: '',
        value: { creditorTaxId: 'creditorTaxId1', noticeCode: 'noticeCode1' },
        id: `recipients[0].creditorTaxId`,
      },
      {
        messageKey: 'identical-notice-codes-error',
        value: { creditorTaxId: 'creditorTaxId1', noticeCode: 'noticeCode1' },
        id: `recipients[2].noticeCode`,
      },
      {
        messageKey: '',
        value: { creditorTaxId: 'creditorTaxId1', noticeCode: 'noticeCode1' },
        id: `recipients[2].creditorTaxId`,
      },
    ]);
  });
});
