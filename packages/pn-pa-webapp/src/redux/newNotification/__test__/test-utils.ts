import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NewNotificationFe, PaymentModel } from './../../../models/newNotification';

export const newNotification: NewNotificationFe = {
  paProtocolNumber: '',
  subject: '',
  cancelledIun: '',
  recipients: [],
  documents: [],
  physicalCommunicationType: '' as PhysicalCommunicationType,
  paymentMode: '' as PaymentModel,
  group: ''
};