import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NewNotificationBilingualism, PaymentModel } from '../../models/NewNotification';

export interface PreliminaryInformationsPayload extends NewNotificationBilingualism {
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
  paymentMode: PaymentModel;
  taxonomyCode: string;
  senderDenomination?: string;
}

export interface UploadDocumentParams {
  id: string;
  key: string;
  contentType: string;
  file: Uint8Array | undefined;
  sha256: string;
}

export interface UploadPaymentResponse {
  [key: string]: {
    pagoPaForm: UploadDocumentsResponse;
    f24flatRate?: UploadDocumentsResponse;
    f24standard?: UploadDocumentsResponse;
  };
}

export interface UploadDocumentsResponse {
  [id: string]: {
    key: string;
    versionToken: string;
  };
}
