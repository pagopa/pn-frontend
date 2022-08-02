import { createAction } from '@reduxjs/toolkit';
import {
    FormRecipient,
    FormAttachment
} from '../../models/NewNotification';

export const setRecipients = createAction<{recipients: Array<FormRecipient>}>('setRecipients');
export const setAttachments = createAction<{documents: Array<FormAttachment>}>('setAttachments');
