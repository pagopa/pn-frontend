import { RecipientType } from '@pagopa-pn/pn-commons';

import { newNotificationF24, newNotificationPagoPa } from '../../__mocks__/NewNotification.mock';
import { randomString } from '../../__test__/test-utils';
import {
  NewNotificationRecipient,
  RecipientPaymentsFormValues,
} from '../../models/NewNotification';
import {
  checkApplyCost,
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

  it('taxIdDependingOnRecipientType (PF errors with a taxId legal person formed value)', () => {
    const result = taxIdDependingOnRecipientType('12345678910', RecipientType.PF);
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

  it('taxIdDependingOnRecipientType (PG errors with a taxId physical person formed value)', () => {
    const result = taxIdDependingOnRecipientType('LVLDAA85T50G702B', RecipientType.PG);
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
    const input: RecipientPaymentsFormValues = {
      taxId1: {
        pagoPa: [
          {
            ...newNotificationPagoPa,
            creditorTaxId: 'creditorTaxId1',
            noticeCode: 'noticeCode1',
          },
        ],
        f24: [],
      },
      taxId2: {
        pagoPa: [
          {
            ...newNotificationPagoPa,
            creditorTaxId: 'creditorTaxId2',
            noticeCode: 'noticeCode2',
          },
        ],
        f24: [],
      },
    };

    const result = identicalIUV(input);
    expect(result).toHaveLength(0);
  });

  it('identicalIuv (errors)', () => {
    const input: RecipientPaymentsFormValues = {
      taxId1: {
        pagoPa: [
          {
            ...newNotificationPagoPa,
            creditorTaxId: 'creditorTaxId1',
            noticeCode: 'noticeCode1',
          },
        ],
        f24: [],
      },
      taxId2: {
        pagoPa: [
          {
            ...newNotificationPagoPa,
            creditorTaxId: 'creditorTaxId1',
            noticeCode: 'noticeCode1',
          },
        ],
        f24: [],
      },
    };

    const result = identicalIUV(input);
    expect(result).toHaveLength(4);
    expect(result).toStrictEqual([
      {
        messageKey: 'identical-notice-codes-error',
        value: {
          ...newNotificationPagoPa,
          creditorTaxId: 'creditorTaxId1',
          noticeCode: 'noticeCode1',
          taxIdKey: 'taxId1',
        },
        id: 'recipients[taxId1].pagoPa[0].noticeCode',
      },
      {
        messageKey: '',
        value: {
          ...newNotificationPagoPa,
          creditorTaxId: 'creditorTaxId1',
          noticeCode: 'noticeCode1',
          taxIdKey: 'taxId1',
        },
        id: 'recipients[taxId1].pagoPa[0].creditorTaxId',
      },
      {
        messageKey: 'identical-notice-codes-error',
        value: {
          ...newNotificationPagoPa,
          creditorTaxId: 'creditorTaxId1',
          noticeCode: 'noticeCode1',
          taxIdKey: 'taxId2',
        },
        id: 'recipients[taxId2].pagoPa[0].noticeCode',
      },
      {
        messageKey: '',
        value: {
          ...newNotificationPagoPa,
          creditorTaxId: 'creditorTaxId1',
          noticeCode: 'noticeCode1',
          taxIdKey: 'taxId2',
        },
        id: 'recipients[taxId2].pagoPa[0].creditorTaxId',
      },
    ]);
  });

  it('checkApplyCost - at least one payment has applyCost = true for pagoPa (no errors)', () => {
    const input: RecipientPaymentsFormValues = {
      taxId1: {
        pagoPa: [
          {
            ...newNotificationPagoPa,
            applyCost: false,
            idx: 0,
          },
          {
            ...newNotificationPagoPa,
            applyCost: true,
            idx: 1,
          },
        ],
        f24: [],
      },
    };

    const result = checkApplyCost(input);
    expect(result).toHaveLength(0);
  });

  it('checkApplyCost - at least one payment has applyCost = true for f24 (no errors)', () => {
    const input: RecipientPaymentsFormValues = {
      taxId1: {
        pagoPa: [],
        f24: [
          {
            ...newNotificationF24,
            applyCost: false,
            idx: 0,
          },
          {
            ...newNotificationF24,
            applyCost: true,
            idx: 1,
          },
        ],
      },
    };

    const result = checkApplyCost(input);
    expect(result).toHaveLength(0);
  });

  it('checkApplyCost - empty payments array (no errors)', () => {
    const input: RecipientPaymentsFormValues = {
      taxId1: {
        pagoPa: [],
        f24: [],
      },
    };

    const result = checkApplyCost(input);
    expect(result).toHaveLength(0);
  });

  it('checkApplyCost - no payments have applyCost = true for pagoPa (errors)', () => {
    const input: RecipientPaymentsFormValues = {
      taxId1: {
        pagoPa: [
          {
            ...newNotificationPagoPa,
            applyCost: false,
            idx: 0,
          },
          {
            ...newNotificationPagoPa,
            applyCost: false,
            idx: 1,
          },
        ],
        f24: [],
      },
    };

    const result = checkApplyCost(input);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      {
        messageKey: 'at-least-one-applycost',
        value: input['taxId1'].pagoPa,
        id: 'recipients[taxId1].pagoPa[0].applyCost',
      },
      {
        messageKey: 'at-least-one-applycost',
        value: input['taxId1'].pagoPa,
        id: 'recipients[taxId1].pagoPa[1].applyCost',
      },
    ]);
  });

  it('checkApplyCost - no payments have applyCost = true for f24 (errors)', () => {
    const input: RecipientPaymentsFormValues = {
      taxId1: {
        pagoPa: [],
        f24: [
          {
            ...newNotificationF24,
            applyCost: false,
            idx: 0,
          },
          {
            ...newNotificationF24,
            applyCost: false,
            idx: 1,
          },
        ],
      },
    };

    const result = checkApplyCost(input);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      {
        messageKey: 'at-least-one-applycost',
        value: input['taxId1'].f24,
        id: 'recipients[taxId1].f24[0].applyCost',
      },
      {
        messageKey: 'at-least-one-applycost',
        value: input['taxId1'].f24,
        id: 'recipients[taxId1].f24[1].applyCost',
      },
    ]);
  });

  it('checkApplyCost - multiple recipients with no applyCost payments (errors)', () => {
    const input: RecipientPaymentsFormValues = {
      taxId1: {
        pagoPa: [
          {
            ...newNotificationPagoPa,
            applyCost: false,
            idx: 0,
          },
        ],
        f24: [],
      },
      taxId2: {
        pagoPa: [],
        f24: [
          {
            ...newNotificationF24,
            applyCost: false,
            idx: 0,
          },
        ],
      },
    };

    const result = checkApplyCost(input);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      {
        messageKey: 'at-least-one-applycost',
        value: input['taxId1'].pagoPa,
        id: 'recipients[taxId1].pagoPa[0].applyCost',
      },
      {
        messageKey: 'at-least-one-applycost',
        value: input['taxId2'].f24,
        id: 'recipients[taxId2].f24[0].applyCost',
      },
    ]);
  });
});
