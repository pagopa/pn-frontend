import { PhysicalCommunicationType, RecipientType, NotificationFeePolicy } from '@pagopa-pn/pn-commons';

import { NewNotificationFe, PaymentModel } from './../../../models/newNotification';

export const newNotification: NewNotificationFe = {
  paProtocolNumber: '',
  subject: '',
  cancelledIun: '',
  recipients: [
    {
      taxId: 'mocked-taxId1',
      denomination: 'Mario Rossi',  
      recipientType: RecipientType.PF,
      payment: {
        creditorTaxId: 'mocked-creditorTaxId1',
        noticeCode: 'mocked-token1',
        pagoPaForm: {
          digests: {
            sha256: ''
          },
          contentType: '',
          ref: {
            key: '',
            versionToken: ''
          }
        }
      }
    },
    {
      taxId: 'mocked-taxId2',
      denomination: 'Sara Giallo',
      recipientType: RecipientType.PF,
      payment: {
        creditorTaxId: 'mocked-creditorTaxId2',
        noticeCode: 'mocked-token2',
        pagoPaForm: {
          digests: {
            sha256: ''
          },
          contentType: '',
          ref: {
            key: '',
            versionToken: ''
          }
        }
      }
    },
  ],
  documents: [],
  physicalCommunicationType: '' as PhysicalCommunicationType,
  paymentMode: PaymentModel.PAGO_PA_NOTICE_F24,
  group: '',
  notificationFeePolicy: '' as NotificationFeePolicy
};
