import { NotificationDetailDocument, PhysicalCommunicationType } from '@pagopa-pn/pn-commons';
import { PaymentModel } from '../../models/NewNotification';

export interface UploadAttachmentParams {
  key: string;
  contentType: string;
  file: Uint8Array | undefined;
  sha256: string;
}

export interface UploadPayementParams {
  [key: string]: {
    pagoPaForm: UploadAttachmentParams;
    f24flatRate: UploadAttachmentParams;
    f24standard: UploadAttachmentParams;
  };
}

export interface UploadPaymentResponse {
  [key: string]: {
    pagoPaForm: NotificationDetailDocument;
    f24flatRate?: NotificationDetailDocument;
    f24standard?: NotificationDetailDocument;
  };
}

export interface PreliminaryInformationsPayload {
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
  paymentMode: PaymentModel;
}
