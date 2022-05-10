import { createAction } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';

export const resetNewNotificationState = createAction<void>('resetNewNotificationState');

export const saveRecipients = createAction<FormikValues>('saveRecipients');
