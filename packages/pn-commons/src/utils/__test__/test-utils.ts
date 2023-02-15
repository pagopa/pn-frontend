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
  NotificationStatus
} from '../../types';

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'mocked-id-1',
    timestamp: '2022-03-21T08:56:50.177Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 0,
      digitalAddress: {
        address: 'nome@cognome.mail',
        type: DigitalDomicileType.PEC
      }
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
        type: DigitalDomicileType.PEC
      }
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
    }
  },
];

const additionalRecipient = {
  recipientType: RecipientType.PF,
  taxId: 'mocked-taxId2',
  denomination: 'Nome2 Cognome2',
  digitalDomicile: { type: DigitalDomicileType.PEC, address: 'toto86@gmail.com', },
  physicalAddress: { 
    address: 'mocked address 2', addressDetails: '', zip: '', municipality: '', province: '',
    at: '', foreignState: '',
  }
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
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE
};

export function flexibleNotificationFromBE(
  status: NotificationStatus, statusHistory: NotificationStatusHistory[], timeline: INotificationDetailTimeline[],
  recipientCount = 1
): NotificationDetail {
  if (![1,2].includes(recipientCount)) {
    throw new Error("only 1 or 2 recipients supported");
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
    notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE
  }
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
  notificationStatus: NotificationStatus.ACCEPTED,
  notificationStatusHistory: [
    { ...statusHistory[0], steps: [{...timeline[0], hidden: false}] },
    { ...statusHistory[1], steps: [{...timeline[1], hidden: false}] },
  ],
  timeline: timeline.map(t => ({...t, hidden: false})),
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
};
