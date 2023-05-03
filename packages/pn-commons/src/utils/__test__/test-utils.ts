import {
  INotificationDetailTimeline,
  TimelineCategory,
  NotificationStatusHistory,
  NotificationDetailRecipient,
  RecipientType,
  DigitalDomicileType,
  NotificationFeePolicy,
  PhysicalCommunicationType,
  NotificationDetail,
  SendDigitalDetails,
  NotificationStatus,
} from '../../types';
import {
  AddressSource,
  LegalFactType,
  NotificationDetailTimelineDetails,
  ResponseStatus,
} from '../../types/NotificationDetail';

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'mocked-id-1',
    timestamp: '2022-03-21T08:56:50.177Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 0,
      digitalAddress: {
        address: 'nome@cognome.mail',
        type: DigitalDomicileType.PEC,
      },
    } as SendDigitalDetails,
  },
  {
    elementId: 'mocked-id-2',
    timestamp: '2022-01-15T08:56:50.177Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 0,
      digitalAddress: {
        address: 'nome@cognome.mail',
        type: DigitalDomicileType.PEC,
      },
    } as SendDigitalDetails,
  },
];

const statusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2022-03-21T08:56:50.177Z',
    relatedTimelineElements: ['mocked-id-1'],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2022-01-15T08:56:50.177Z',
    relatedTimelineElements: ['mocked-id-2'],
  },
];

const recipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
    taxId: 'mocked-taxId',
    denomination: 'Nome Cognome',
    digitalDomicile: {
      type: DigitalDomicileType.PEC,
      address: 'nome@cognome.mail',
    },
    physicalAddress: {
      at: '',
      address: 'mocked address',
      addressDetails: '',
      zip: '',
      municipality: '',
      province: '',
      foreignState: '',
    },
  },
];

export const additionalRecipient: NotificationDetailRecipient = {
  recipientType: RecipientType.PF,
  taxId: 'mocked-taxId2',
  denomination: 'Nome2 Cognome2',
  digitalDomicile: { type: DigitalDomicileType.PEC, address: 'toto86@gmail.com' },
  physicalAddress: {
    address: 'mocked address 2',
    addressDetails: '',
    zip: '',
    municipality: '',
    province: '',
    at: '',
    foreignState: '',
  },
};

export const notificationFromBe: NotificationDetail = {
  iun: 'KQKX-WMDW-GDMU-202301-L-1',
  paProtocolNumber: '',
  senderPaId: '',
  subject: '',
  sentAt: '2022-02-21T10:19:33.440Z',
  cancelledByIun: '',
  recipients,
  documentsAvailable: true,
  documents: [],
  otherDocuments: [],
  notificationStatus: NotificationStatus.ACCEPTED,
  notificationStatusHistory: statusHistory,
  timeline,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
};

export function flexibleNotificationFromBE(
  status: NotificationStatus,
  statusHistory: NotificationStatusHistory[],
  timeline: INotificationDetailTimeline[],
  recipientCount = 1
): NotificationDetail {
  if (![1, 2].includes(recipientCount)) {
    throw new Error('only 1 or 2 recipients supported');
  }
  return {
    iun: '',
    paProtocolNumber: '',
    senderPaId: '',
    subject: '',
    sentAt: '2022-02-21T10:19:33.440Z',
    cancelledByIun: '',
    recipients: recipientCount === 2 ? [...recipients, additionalRecipient] : recipients,
    documentsAvailable: true,
    documents: [],
    otherDocuments: [],
    notificationStatus: status,
    notificationStatusHistory: statusHistory,
    timeline,
    physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
    notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
  };
}

export const parsedNotification: NotificationDetail = {
  iun: 'KQKX-WMDW-GDMU-202301-L-1',
  paProtocolNumber: '',
  senderPaId: '',
  subject: '',
  sentAt: '21/02/2022',
  cancelledByIun: '',
  recipients,
  documentsAvailable: true,
  documents: [],
  otherDocuments: [],
  paymentHistory: [],
  notificationStatus: NotificationStatus.ACCEPTED,
  notificationStatusHistory: [
    { ...statusHistory[0], steps: [{ ...timeline[0], hidden: false }] },
    { ...statusHistory[1], steps: [{ ...timeline[1], hidden: false }] },
  ],
  timeline: timeline.map((t) => ({ ...t, hidden: false })),
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
};

const timelineTwoRecipients = [
  timeline[0],
  {
    elementId: 'mocked-id-3',
    timestamp: '2022-03-21T08:56:50.177Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 1,
      digitalAddress: {
        address: 'toto86@gmail.com',
        type: DigitalDomicileType.PEC,
      },
    } as SendDigitalDetails,
  },
  timeline[1],
];

export const parsedNotificationTwoRecipients: NotificationDetail = {
  iun: 'KQKX-WMDW-GDMU-202301-L-1',
  paProtocolNumber: '',
  senderPaId: '',
  subject: '',
  sentAt: '21/02/2022',
  cancelledByIun: '',
  recipients: [...recipients, additionalRecipient],
  documentsAvailable: true,
  documents: [],
  otherDocuments: [],
  notificationStatus: NotificationStatus.ACCEPTED,
  notificationStatusHistory: [
    {
      ...statusHistory[0],
      steps: [
        { ...timelineTwoRecipients[0], hidden: false },
        { ...timelineTwoRecipients[1], hidden: false },
      ],
    },
    { ...statusHistory[1], steps: [{ ...timelineTwoRecipients[2], hidden: false }] },
  ],
  timeline: timelineTwoRecipients.map((t) => ({ ...t, hidden: false })),
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
};

export function acceptedDeliveringDeliveredTimeline(): Array<INotificationDetailTimeline> {
  return [
    {
      elementId: 'request_accepted',
      timestamp: '2023-01-26T13:55:15.975574085Z',
      category: TimelineCategory.REQUEST_ACCEPTED,
      details: {},
      legalFactsIds: [{ category: LegalFactType.SENDER_ACK, key: 'mocked-legal-fact-1' }],
    },
    {
      elementId: 'send_courtesy_message_0',
      timestamp: '2023-01-26T13:55:52.597019182Z',
      category: TimelineCategory.SEND_COURTESY_MESSAGE,
      details: {
        recIndex: 0,
        digitalAddress: { type: DigitalDomicileType.EMAIL, address: 'other@mail.it' },
        sendDate: 'some-date',
      } as NotificationDetailTimelineDetails,
    },
    {
      elementId: 'send_digital_domicile_0_PLATFORM',
      timestamp: '2023-01-26T13:55:58.651901435Z',
      category: TimelineCategory.SEND_DIGITAL_DOMICILE,
      details: {
        recIndex: 0,
        digitalAddressSource: AddressSource.PLATFORM,
        digitalAddress: { type: DigitalDomicileType.PEC, address: 'some@mail.it' },
      } as NotificationDetailTimelineDetails,
    },
    {
      elementId: 'digital_progress_0_PLATFORM',
      timestamp: '2023-01-26T13:56:05.000870007Z',
      category: TimelineCategory.SEND_DIGITAL_PROGRESS,
      details: {
        recIndex: 0,
        deliveryDetailCode: 'C001',
        digitalAddressSource: AddressSource.PLATFORM,
        digitalAddress: { type: DigitalDomicileType.PEC, address: 'some@mail.it' },
      } as NotificationDetailTimelineDetails,
    },
    {
      elementId: 'digital_feedback_0_PLATFORM',
      timestamp: '2023-01-26T13:56:15.001161877Z',
      category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
      details: {
        recIndex: 0,
        responseStatus: 'OK',
        digitalAddressSource: AddressSource.PLATFORM,
        digitalAddress: { type: DigitalDomicileType.PEC, address: 'some@mail.it' },
      } as NotificationDetailTimelineDetails,
    },
    {
      elementId: 'digital_success_workflow_0',
      timestamp: '2023-01-26T14:16:12.42843144Z',
      category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
      details: {
        recIndex: 0,
        digitalAddress: { type: DigitalDomicileType.PEC, address: 'some@mail.it' },
      } as NotificationDetailTimelineDetails,
    },
    {
      elementId: 'schedule_refinement_0',
      timestamp: '2023-01-26T14:17:16.525827086Z',
      category: TimelineCategory.SCHEDULE_REFINEMENT,
      details: { recIndex: 0 } as NotificationDetailTimelineDetails,
    },
  ];
}

export function acceptedDeliveringDeliveredTimelineStatusHistory(): Array<NotificationStatusHistory> {
  return [
    {
      status: NotificationStatus.ACCEPTED,
      activeFrom: '2023-01-26T13:55:15.975574085Z',
      relatedTimelineElements: ['request_accepted', 'send_courtesy_message_0'],
    },
    {
      status: NotificationStatus.DELIVERING,
      activeFrom: '2023-01-26T13:55:52.651901435Z',
      relatedTimelineElements: [
        'send_digital_domicile_0_PLATFORM',
        'digital_progress_0_PLATFORM',
        'digital_feedback_0_PLATFORM',
      ],
    },
    {
      status: NotificationStatus.DELIVERED,
      activeFrom: '2023-01-26T14:16:12.42843144Z',
      relatedTimelineElements: ['digital_success_workflow_0', 'schedule_refinement_0'],
    },
  ];
}

export function analogFailureTimeline(): Array<INotificationDetailTimeline> {
  return [
    ...acceptedDeliveringDeliveredTimeline().slice(0, 2),
    {
      elementId: 'send_analog_domicile_0_AR',
      timestamp: '2023-01-26T13:55:58.651901435Z',
      category: TimelineCategory.SEND_ANALOG_DOMICILE,
      details: {
        recIndex: 0,
        serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
        physicalAddress: { 
          address: 'Via Umberto, 34',
          municipality: 'Graniti',
          zip: '98036'
        },
        sentAttemptMade: 0
      } as NotificationDetailTimelineDetails,
    },
    {
      elementId: 'send_analog_progress_0_AR',
      timestamp: '2023-01-26T13:56:05.000870007Z',
      category: TimelineCategory.SEND_ANALOG_PROGRESS,
      details: {
        recIndex: 0,
        deliveryDetailCode: 'RECRN002B',
        registeredLetterCode: 'IT348344A42'
      } as NotificationDetailTimelineDetails,
    },
    {
      elementId: 'send_analog_feedback_0_AR',
      timestamp: '2023-01-26T13:56:15.001161877Z',
      category: TimelineCategory.SEND_ANALOG_FEEDBACK,
      details: {
        recIndex: 0,
        serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
        physicalAddress: { 
          address: 'Via Umberto, 34',
          municipality: 'Graniti',
          zip: '98036'
        },
        sentAttemptMade: 0,
        responseStatus: ResponseStatus.KO,
        deliveryDetailCode: 'RECRN002C',
        deliveryFailureCause: 'M01',
      } as NotificationDetailTimelineDetails,
    },
    {
      elementId: 'analog_failure_workflow_0',
      timestamp: '2023-01-26T14:16:12.42843144Z',
      category: TimelineCategory.ANALOG_FAILURE_WORKFLOW,
      details: {
        recIndex: 0,
        generatedAarUrl: 'AAR-86-99',
      } as NotificationDetailTimelineDetails,
    },
    {
      elementId: 'completely_unreachable_0',
      timestamp: '2023-01-26T14:17:16.525827086Z',
      category: TimelineCategory.COMPLETELY_UNREACHABLE,
      details: { recIndex: 0 } as NotificationDetailTimelineDetails,
    },
  ]
};

export function analogFailureStatusHistory(): Array<NotificationStatusHistory> {
  return [
    acceptedDeliveringDeliveredTimelineStatusHistory()[0],
    {
      status: NotificationStatus.DELIVERING,
      activeFrom: '2023-01-26T13:55:52.651901435Z',
      relatedTimelineElements: [
        'send_analog_domicile_0_AR',
        'send_analog_progress_0_AR',
        'send_analog_feedback_0_AR',
        'analog_failure_workflow_0',
      ],
    },
    {
      status: NotificationStatus.UNREACHABLE,
      activeFrom: '2023-01-26T14:17:16.525827086Z',
      relatedTimelineElements: ['completely_unreachable_0'],
    },

  ]
}