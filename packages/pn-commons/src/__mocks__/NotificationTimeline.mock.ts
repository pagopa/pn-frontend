import {
  DigitalDomicileType,
  LegalFactType,
  NotificationDetailRecipient,
  PhysicalCommunicationType,
  RecipientType,
  ReworkedStatus,
  TimelineCategory,
} from '../models/NotificationDetail';
import { NotificationStatus } from '../models/NotificationStatus';
import { NotificationTimelineResponse } from '../models/NotificationTimeline';

const timelineRecipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
    taxId: 'TSTUTN00A07A001G',
    denomination: 'Utente Test Uno',
    physicalAddress: {
      at: 'Presso',
      address: 'VIA POSEIDONE 82',
      addressDetails: 'SCALA C',
      zip: '00133',
      municipality: 'ROMA',
      municipalityDetails: 'ROMA',
      province: 'RM',
      foreignState: 'ITALIA',
    },
    payments: [],
  },
];

export const notificationTimelineDTO: NotificationTimelineResponse = {
  iun: 'EPXW-VTMZ-DUJH-202608-U-1',
  subject: 'Test notifica 20260806111108',
  recipients: timelineRecipients,
  notificationStatusHistory: [
    {
      status: NotificationStatus.VIEWED,
      activeFrom: '2026-08-18T09:07:27.736813Z',
      steps: [
        {
          stepType: 'EVENT',
          event: {
            elementId: 'NOTIFICATION_VIEWED.IUN_EPXW-VTMZ-DUJH-202608-U-1.RECINDEX_0',
            timestamp: '2026-08-18T09:07:27.736813Z',
            category: TimelineCategory.NOTIFICATION_VIEWED,
            details: { recIndex: 0 },
            legalFactsIds: [
              {
                key: 'safestorage://PN_LEGAL_FACTS-729c83d92e1d4ee98672c1afbd92ac3e.pdf',
                category: LegalFactType.RECIPIENT_ACCESS,
              },
            ],
            isHidden: true,
          },
        },
      ],
    },
    {
      status: NotificationStatus.DELIVERING,
      activeFrom: '2026-08-06T09:14:58.508308Z',
      steps: [
        {
          stepType: 'GROUP',
          group: {
            groupId:
              'DELIVERING_2026-08-06T09:14:58.508308Z_NO_REWORK_ANALOG_REGISTERED_LETTER_890_RECINDEX_0_ATTEMPT_1',
            denomination: 'Utente Test Uno',
            taxId: 'TSTUTN00A07A001G',
            recIndex: 0,
            category: 'ANALOG',
            channel: 'REGISTERED_LETTER_890',
            attempt: 1,
            registeredLetterCode: 'ca1ee35899884395af31f3a8a754c8c9',
            hasReworkedEvents: false,
            events: [
              {
                elementId:
                  'SEND_ANALOG_FEEDBACK.IUN_EPXW-VTMZ-DUJH-202608-U-1.RECINDEX_0.ATTEMPT_0',
                timestamp: '2026-08-06T09:16:55Z',
                category: TimelineCategory.SEND_ANALOG_FEEDBACK,
                details: {
                  recIndex: 0,
                  deliveryDetailCode: 'RECAG001C',
                  serviceLevel: PhysicalCommunicationType.REGISTERED_LETTER_890,
                },
                legalFactsIds: [],
                isHidden: false,
              },
              {
                elementId:
                  'SEND_ANALOG_DOMICILE.IUN_EPXW-VTMZ-DUJH-202608-U-1.RECINDEX_0.ATTEMPT_0',
                timestamp: '2026-08-06T09:14:58.508308Z',
                category: TimelineCategory.SEND_ANALOG_DOMICILE,
                details: {
                  recIndex: 0,
                  serviceLevel: PhysicalCommunicationType.REGISTERED_LETTER_890,
                  productType: '890',
                },
                legalFactsIds: [],
                isHidden: false,
              },
            ],
          },
        },
        {
          stepType: 'GROUP',
          group: {
            groupId:
              'DELIVERING_2026-08-06T09:13:58.508308Z_NO_REWORK_DIGITAL_PEC_RECINDEX_0_ATTEMPT_1',
            denomination: 'Utente Test Uno',
            taxId: 'TSTUTN00A07A001G',
            recIndex: 0,
            category: 'DIGITAL',
            channel: 'PEC',
            attempt: 1,
            hasReworkedEvents: true,
            events: [
              {
                elementId:
                  'SEND_DIGITAL_DOMICILE.IUN_EPXW-VTMZ-DUJH-202608-U-1.RECINDEX_0.SOURCE_PLATFORM.REPEAT_false.ATTEMPT_0',
                timestamp: '2026-08-06T09:13:58.508308Z',
                category: TimelineCategory.SEND_DIGITAL_DOMICILE,
                details: {
                  recIndex: 0,
                  digitalAddress: { type: DigitalDomicileType.PEC, address: 'test@pec.it' },
                },
                legalFactsIds: [],
                isHidden: false,
                reworkedStatus: ReworkedStatus.NOT_VALID,
              },
            ],
          },
        },
      ],
    },
    {
      status: NotificationStatus.ACCEPTED,
      activeFrom: '2026-08-06T09:11:11.657169Z',
      steps: [
        {
          stepType: 'EVENT',
          event: {
            elementId: 'REQUEST_ACCEPTED.IUN_EPXW-VTMZ-DUJH-202608-U-1',
            timestamp: '2026-08-06T09:13:24.222073Z',
            category: TimelineCategory.REQUEST_ACCEPTED,
            details: {},
            legalFactsIds: [
              {
                key: 'safestorage://PN_LEGAL_FACTS-734c42d4227d45a19df11b663bc8fd1c.pdf',
                category: LegalFactType.SENDER_ACK,
              },
            ],
            isHidden: true,
          },
        },
      ],
    },
  ],
};
