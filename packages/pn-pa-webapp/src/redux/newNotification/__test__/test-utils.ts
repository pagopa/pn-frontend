import { PhysicalCommunicationType, RecipientType, NotificationFeePolicy } from '@pagopa-pn/pn-commons';

import { NewNotificationFe, PaymentModel } from './../../../models/newNotification';

export const newNotification: NewNotificationFe = {
  paProtocolNumber: '',
  subject: '',
  cancelledIun: '',
  recipients: [
    {
      taxId: 'mocked-taxId1',
      creditorTaxId: 'mocked-creditorTaxId1',
      denomination: 'Mario Rossi',
      token: 'mocked-token1',
      recipientType: RecipientType.PF,
    },
    {
      taxId: 'mocked-taxId2',
      creditorTaxId: 'mocked-creditorTaxId2',
      denomination: 'Sara Giallo',
      token: 'mocked-token2',
      recipientType: RecipientType.PF,
    },
  ],
  documents: [],
  physicalCommunicationType: '' as PhysicalCommunicationType,
  paymentMode: PaymentModel.PAGO_PA_NOTICE_F24,
  group: '',
  notificationFeePolicy: '' as NotificationFeePolicy
};
