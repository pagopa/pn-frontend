import {
  INotificationDetailTimeline,
  TimelineCategory,
  NotificationStatusHistory,
  NotificationDetailRecipient,
  RecipientType,
  DigitalDomicileType,
  NotificationFeePolicy,
  PhysicalCommunicationType,
} from '../../types/NotificationDetail';
import { NotificationStatus } from '../../types/NotificationStatus';

export const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'mocked-id-1',
    timestamp: '2022-03-21T08:56:50.177Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      category: TimelineCategory.SEND_DIGITAL_DOMICILE,
      taxId: 'mocked-taxId',
    },
  },
  {
    elementId: 'mocked-id-2',
    timestamp: '2022-01-15T08:56:50.177Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      category: TimelineCategory.SEND_DIGITAL_DOMICILE,
      taxId: 'mocked-taxId',
    },
  },
];

export const statusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2022-03-21T08:56:50.177Z',
    relatedTimelineElements: ['mocked-id-1'],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2022-01-15T08:56:50.177Z',
    relatedTimelineElements: ['mocked-id-2'],
  },
];

export const recipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
    taxId: 'mocked-taxId',
    denomination: 'Nome Cognome',
    digitalDomicile: {
      type: DigitalDomicileType.EMAIL,
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
    token: '',
  },
];

export const notificationFromBe = {
  iun: '',
  paNotificationId: '',
  subject: '',
  sentAt: '',
  cancelledIun: '',
  cancelledByIun: '',
  recipients,
  documents: [],
  payment: {
    iuv: '',
    notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
    f24: {
      flatRate: {
        digests: {
          sha256: ''
        },
        contentType: '',
        title: ''
      },
      digital: {
        digests: {
          sha256: ''
        },
        contentType: '',
        title: ''
      },
      analog: {
        digests: {
          sha256: ''
        },
        contentType: '',
        title: ''
      },
    }
  },
  notificationStatus: NotificationStatus.ACCEPTED,
  notificationStatusHistory: statusHistory,
  timeline,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890
}
