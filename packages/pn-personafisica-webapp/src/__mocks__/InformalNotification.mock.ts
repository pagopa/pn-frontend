import {
  BffFullInformalNotificationV1,
  InformalNotificationRecipientV1RecipientTypeEnum,
  InformalNotificationStatusV1,
} from '../generated-client/informal-notifications';

export const informalNotificationMock: BffFullInformalNotificationV1 = {
  iun: 'GDVE-LTZD-ZQMY-202606-J-A',
  senderDenomination: 'Comune di Palermo',
  campaignId: 'campaign-1',
  additionalLanguages: ['IT'],
  subject: 'Test notifica..302110110074337552',
  recipients: [
    {
      recipientType: InformalNotificationRecipientV1RecipientTypeEnum.Pf,
      taxId: 'PF-aa0c4556-5a6f-45b1-800c-0f4f3c5a57b6',
      denomination: 'Adalgisa Centini',
      messageId: '24db3c58-a664-44b3-aefa-40b0df34fa08',
      payments: [
        {
          pagoPa: {
            creditorTaxId: '77777777777',
            noticeCode: '302010110074341700',
          },
        },
      ],
    },
  ],
  documents: [
    {
      contentType: 'application/pdf',
      digests: {
        sha256: 'SmHRur4+IVEaMHrYoof4mwzhxh3r2D/+WeVnMQnokgw=',
      },
      ref: {
        key: 'PN_NOTIFICATION_ATTACHMENTS-1e0b22f1770945a8895275785d831ab6.pdf',
        versionToken: 'v1',
      },
      title: 'Titolo documento 1',
    },
  ],
  group: '63f359bc72337440a40f537e',
  notificationStatus: InformalNotificationStatusV1.Accepted,
  sentAt: '2026-06-24T08:24:00.724598714Z',
};
