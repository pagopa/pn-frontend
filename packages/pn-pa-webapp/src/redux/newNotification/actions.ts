import { createAction } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';
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

export const saveRecipients = createAction<FormikValues>('saveRecipients');
