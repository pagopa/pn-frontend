import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NewNotificationFe, NewNotificationPayment, PaymentModel } from './../../../models/newNotification';

export const newNotification: NewNotificationFe = {
  paNotificationId: '',
  subject: '',
  cancelledIun: '',
  recipients: [],
  documents: [],
  payment: {} as NewNotificationPayment,
  physicalCommunicationType: '' as PhysicalCommunicationType,
  paymentMode: '' as PaymentModel,
  group: ''
};