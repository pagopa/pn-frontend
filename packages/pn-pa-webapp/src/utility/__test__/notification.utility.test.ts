import { PhysicalAddressLookup } from '@pagopa-pn/pn-commons';

import {
  newNotification,
  newNotificationForBff,
  newNotificationRecipients,
} from '../../__mocks__/NewNotification.mock';
import { BffNewNotificationRequest } from '../../generated-client/notifications';
import { NewNotificationPayment, PaymentModel } from '../../models/NewNotification';
import {
  filterPaymentsByDebtPositionChange,
  getDuplicateValuesByKeys,
  newNotificationMapper,
} from '../notification.utility';

const mockArray = [
  { key1: 'value1', key2: 'value2', key3: 'value3' },
  { key1: 'valueX', key2: 'valueY', key3: 'valueZ' },
  { key1: 'value1', key2: 'value2', key3: 'value3' },
  { key1: 'value1', key2: 'value2', key3: 'value3' },
  { key1: 'valueX', key2: 'valueY', key3: 'valueZ' },
  { key1: 'value1', key2: 'valueY', key3: 'valueZ' },
];

describe('Test notification utility', () => {
  it('Map notification from presentation layer to api layer', () => {
    const result = newNotificationMapper(newNotification);
    expect(result).toEqual(newNotificationForBff);
  });

  it('Checks that getDuplicateValuesByKeys returns duplicate values', () => {
    const result = getDuplicateValuesByKeys(mockArray, ['key1', 'key2', 'key3']);
    expect(result).toEqual(['value1value2value3', 'valueXvalueYvalueZ']);
  });

  it('Checks that notificationMapper returns correct bilingualism dto', () => {
    // fe version after mapper
    const result = newNotificationMapper({
      ...newNotification,
      lang: 'other',
      additionalLang: 'de',
      additionalAbstract: 'abstract for de',
      additionalSubject: 'subject for de',
    });

    const response: BffNewNotificationRequest = {
      ...newNotificationForBff,
      subject: 'Multone esagerato|subject for de',
      abstract: 'abstract for de',
      additionalLanguages: ['DE'],
    };
    expect(result).toEqual(response);
  });

  it('Checks that notificationMapper returns correct recipient physicalAddress', () => {
    const result = newNotificationMapper({
      ...newNotification,
      recipients: newNotification.recipients.map((recipient) => ({
        ...recipient,
        physicalAddressLookup: PhysicalAddressLookup.NATIONAL_REGISTRY,
      })),
    });
    expect(result).toEqual({
      ...newNotificationForBff,
      recipients: newNotificationForBff.recipients.map((recipient) => ({
        ...recipient,
        physicalAddress: undefined,
      })),
    });
  });

  describe('Test filter payments by debt position change', () => {
    const recipientPayments = newNotificationRecipients[1].payments ?? [];

    it('should return the same payments if the debt position does not change', () => {
      const result = filterPaymentsByDebtPositionChange(
        recipientPayments,
        PaymentModel.PAGO_PA,
        PaymentModel.PAGO_PA
      );
      expect(result).toEqual(recipientPayments);
    });

    it('should return all payments when previous debt position is undefined', () => {
      const result = filterPaymentsByDebtPositionChange(
        recipientPayments,
        PaymentModel.PAGO_PA,
        undefined
      );
      expect(result).toEqual(recipientPayments);
    });

    it('should return empty array when set debt position to NOTHING', () => {
      const result = filterPaymentsByDebtPositionChange(
        recipientPayments,
        PaymentModel.NOTHING,
        PaymentModel.PAGO_PA
      );
      expect(result).toEqual([]);
    });

    it('should keep only PAGOPA payments when debt position change from PAGO_PA_F24 to PAGOPA', () => {
      const pagopaPayments = recipientPayments.reduce((acc, item) => {
        acc.push({ pagoPa: item.pagoPa });
        return acc;
      }, [] as Array<NewNotificationPayment>);

      const result = filterPaymentsByDebtPositionChange(
        recipientPayments,
        PaymentModel.PAGO_PA,
        PaymentModel.PAGO_PA_F24
      );
      expect(result).toEqual(pagopaPayments);
    });

    it('should keep only F24 payments when debt position change from PAGO_PA_F24 to F24', () => {
      const f24Payments = recipientPayments.reduce((acc, item) => {
        acc.push({ f24: item.f24 });
        return acc;
      }, [] as Array<NewNotificationPayment>);

      const result = filterPaymentsByDebtPositionChange(
        recipientPayments,
        PaymentModel.F24,
        PaymentModel.PAGO_PA_F24
      );
      expect(result).toEqual(f24Payments);
    });

    it('should clear all payments when debt position change from from PAGOPA to F24', () => {
      const result = filterPaymentsByDebtPositionChange(
        recipientPayments,
        PaymentModel.F24,
        PaymentModel.PAGO_PA
      );
      expect(result).toEqual([]);
    });

    it('should clear all payments when debt position change from F24 to PAGOPA', () => {
      const result = filterPaymentsByDebtPositionChange(
        recipientPayments,
        PaymentModel.PAGO_PA,
        PaymentModel.F24
      );
      expect(result).toEqual([]);
    });

    it('should return all payments when debt position change from NONE', () => {
      const result = filterPaymentsByDebtPositionChange(
        recipientPayments,
        PaymentModel.PAGO_PA,
        PaymentModel.NOTHING
      );
      expect(result).toEqual(recipientPayments);
    });

    it('should handle empty payments array', () => {
      const result = filterPaymentsByDebtPositionChange([], PaymentModel.PAGO_PA, PaymentModel.F24);
      expect(result).toEqual([]);
    });
  });
});
