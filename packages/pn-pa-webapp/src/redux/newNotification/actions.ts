import { createAction } from '@reduxjs/toolkit';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { PaymentModel } from './../../models/newNotification';

export const setPreliminaryInformations = createAction<{
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
  paymentModel: PaymentModel;
}>('setPreliminaryInformations');

export const resetNewNotificationState = createAction<void>('resetNewNotificationState');
