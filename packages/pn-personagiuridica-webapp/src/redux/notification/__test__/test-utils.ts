import {
  NotificationStatus,
  AddressSource,
  DigitalDomicileType,
  LegalFactType,
  NotificationDetail,
  NotificationFeePolicy,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
  NotificationDetailRecipient,
  NotificationStatusHistory,
  INotificationDetailTimeline,
} from '@pagopa-pn/pn-commons';
import { parseNotificationDetailForRecipient } from '../../../utils/notification.utility';

// beware!!
// the *order* of these recipients is relevant, there are test on the *index* of a given recipient.
const recipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
    taxId: 'TTTUUU29J84Z600X',
    denomination: 'Totito',
    digitalDomicile: {
      type: DigitalDomicileType.PEC,
      address: 'letotito@pnpagopa.postecert.local',
    },
    physicalAddress: {
      address: 'Via del mistero, 48',
      zip: '40200',
      municipality: 'Arcore',
      province: 'MI',
      foreignState: 'ITALIA',
    },
    payment: {
      noticeCode: '302011657724564978',
      creditorTaxId: '77777777778',
      pagoPaForm: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-0001-EWWX-RM6Q-MKZM-VMCV',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    recipientType: RecipientType.PF,
    taxId: 'CGNNMO80A03H501U',
    denomination: 'Analogico Ok',
    digitalDomicile: {
      address: 'mail@pec.it',
      type: DigitalDomicileType.PEC,
    },
    physicalAddress: {
      at: 'Presso qualcuno',
      address: 'In via del tutto eccezionale',
      addressDetails: 'scala A',
      zip: '00100',
      municipality: 'Comune',
      province: 'PROV',
      foreignState: '',
    },
    payment: {
      creditorTaxId: 'mocked-creditorTaxId',
      noticeCode: 'mocked-noticeCode',
      pagoPaForm: {
        digests: {
          sha256: 'mocked-sha256',
        },
        contentType: 'mocked-contentType',
        ref: {
          key: 'Avviso PagoPa',
          versionToken: 'mocked-versionToken',
        },
      },
      f24standard: {
        digests: {
          sha256: 'mocked-sha256',
        },
        contentType: 'mocked-contentType',
        ref: {
          key: 'F24 Standard',
          versionToken: 'mocked-versionToken',
        },
      },
    },
  },
];

const statusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2022-02-22T10:19:33.440Z',
    relatedTimelineElements: [
      'c_b429-202203021814_start', // legalFact sender_ack~0f4Z32eLEiX8NSYR4WYzyvQvnQHh1t7Z + recIndex
      'c_b429-202203021814_deliveryMode_rec0',
      'c_b429-202203021814_send_pec_rec0_PLATFORM_n1', // recIndex
    ],
  },
  {
    status: NotificationStatus.VIEWED,
    activeFrom: '2022-02-22T10:25:28.440Z',
    relatedTimelineElements: [
      'c_b429-202203021814_send_pec_rec0_SPECIAL_n1',
      'c_b429-202203021814_send_pec_result_rec0_SPECIAL_n1', // legalFact sender_ack-toto1
      'c_b429-202203021814_send_courtesy_rec0', // legalFact digital_delivery_info_ed84b8c9-444e-410d-80d7-cfad6aa12070~QDr7GVmbdGkJJFEgxi0OlxPs.l2F2Wq.
      // + recIndex
      'c_b429-202203021814_recipient_timeout_rec0',
    ],
  },
];

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'c_b429-202203021814_start',
    timestamp: '2022-03-02T17:56:46.668Z',
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: { recIndex: 0 },
    legalFactsIds: [
      {
        key: 'sender_ack~0f4Z32eLEiX8NSYR4WYzyvQvnQHh1t7Z',
        category: LegalFactType.SENDER_ACK,
      },
    ],
  },
  {
    elementId: 'c_b429-202203021814_deliveryMode_rec0',
    timestamp: '2022-03-02T17:56:50.303Z',
    category: TimelineCategory.SEND_ANALOG_DOMICILE,
    details: {
      physicalAddress: {
        at: '',
        address: '',
        addressDetails: '',
        zip: '',
        municipality: '',
        province: '',
        foreignState: '',
      },
    },
  },
  {
    elementId: 'c_b429-202203021814_send_pec_rec0_PLATFORM_n1',
    timestamp: '2022-03-02T17:56:53.636Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.EMAIL,
        address: 'nome.cognome@works.demo.it',
      },
      digitalAddressSource: AddressSource.GENERAL,
      retryNumber: 1,
    },
  },
  {
    elementId: 'c_b429-202203021814_send_pec_rec0_SPECIAL_n1',
    timestamp: '2022-03-02T17:56:56.856Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'nome.cognome@works.demo.it',
      },
      digitalAddressSource: AddressSource.GENERAL,
      retryNumber: 1,
    },
  },
  {
    elementId: 'c_b429-202203021814_send_pec_result_rec0_SPECIAL_n1',
    timestamp: '2022-03-02T17:57:03.284Z',
    category: TimelineCategory.NOTIFICATION_VIEWED,
    legalFactsIds: [
      {
        key: 'sender_ack-toto1',
        category: LegalFactType.SENDER_ACK,
      },
    ],
    details: {
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'nome.cognome@works.demo.it',
      },
      digitalAddressSource: AddressSource.GENERAL,
      retryNumber: 1,
      errors: ['OK'],
    },
  },
  {
    elementId: 'c_b429-202203021814_send_courtesy_rec0',
    timestamp: '2022-03-02T17:57:06.819Z',
    category: TimelineCategory.NOTIFICATION_VIEWED,
    details: {
      recIndex: 0,
    },
    legalFactsIds: [
      {
        key: 'digital_delivery_info_ed84b8c9-444e-410d-80d7-cfad6aa12070~QDr7GVmbdGkJJFEgxi0OlxPs.l2F2Wq.',
        category: LegalFactType.DIGITAL_DELIVERY,
      },
    ],
  },
  {
    elementId: 'c_b429-202203021814_recipient_timeout_rec0',
    timestamp: '2022-03-02T17:59:10.029Z',
    category: TimelineCategory.REFINEMENT,
    details: {},
  },
];

export const notificationFromBe: NotificationDetail = {
  iun: 'c_b963-220220221119',
  paProtocolNumber: '220220221119',
  subject: 'Prova - status',
  abstract: 'mocked-abstract',
  sentAt: '2022-02-21T10:19:33.440Z',
  cancelledIun: 'mocked-cancelledIun',
  cancelledByIun: 'mocked-cancelledByIun',
  senderDenomination: 'Il comune di Hobbiton',
  documentsAvailable: true,
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
  senderPaId: 'mocked-senderPaId',
  recipients: [recipients[0]],
  documents: [
    {
      digests: {
        sha256: '3b56e2b5641d5807fa83d6bc906a35135a6b8b7c21e694b859bbafc3d718d659',
      },
      contentType: 'application/pdf',
      title: 'Mocked document',
      ref: {
        key: 'Mocked document',
        versionToken: 'mocked-versionToken',
      },
    },
  ],
  notificationStatus: NotificationStatus.PAID,
  notificationStatusHistory: statusHistory,
  timeline,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
};

function notificationFromBeTwoRecipients(
  userFiscalNumber: string,
  delegatorFiscalNumber?: string,
  isDelegate?: boolean
): NotificationDetail {
  const actualRecipient = isDelegate ? delegatorFiscalNumber : userFiscalNumber;
  let notificationRecipients: Array<NotificationDetailRecipient | {recipientType: RecipientType}>;
  if (actualRecipient === recipients[0].taxId) {
    notificationRecipients = [recipients[0], { recipientType: RecipientType.PF }];
  } else if (actualRecipient === recipients[1].taxId) {
    notificationRecipients = [{ recipientType: RecipientType.PF }, recipients[1]];
  } else {
    throw new Error('bad input data - recipient taxId should be known');
  }

  return {
    ...notificationFromBe,
    notificationStatusHistory: [
      statusHistory[0],
      {
        ...statusHistory[1],
        relatedTimelineElements: [...statusHistory[1].relatedTimelineElements, 'c_b429-202203021814_send_courtesy_rec1']
      }
    ],
    timeline: [...notificationFromBe.timeline, {
      elementId: 'c_b429-202203021814_send_courtesy_rec1',
      timestamp: '2022-03-02T17:57:06.819Z',
      category: TimelineCategory.NOTIFICATION_VIEWED,
      details: {
        recIndex: 1,
      },
      legalFactsIds: [
        {
          key: 'digital_delivery_info_ed84b8c9-444e-410d-80d7-cfad6aa12070~QDr7GVmbdGkJJFEgxi0OlxPs.l2F2Wq.',
          category: LegalFactType.DIGITAL_DELIVERY,
        },
      ],
    }],
    recipients: notificationRecipients as any,
  }
};

export const overrideNotificationMock = (overrideObj: object): NotificationDetail => {
  const notification = { ...notificationFromBe, ...overrideObj };
  return parseNotificationDetailForRecipient(notification);
};

export const notificationToFe = parseNotificationDetailForRecipient(notificationFromBe);

export const notificationToFeTwoRecipients = (
  userFiscalNumber: string,
  delegatorFiscalNumber?: string,
  isDelegate?: boolean
) => {
  return parseNotificationDetailForRecipient(notificationFromBeTwoRecipients(userFiscalNumber, delegatorFiscalNumber, isDelegate));
};
