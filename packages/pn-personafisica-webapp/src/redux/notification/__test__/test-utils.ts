import {
  NotificationStatus,
  AddressSource,
  DeliveryMode,
  DigitalDomicileType,
  LegalFactType,
  NotificationDetail,
  NotificationFeePolicy,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
  parseNotificationDetail,
} from '@pagopa-pn/pn-commons';

export const notificationFromBe: NotificationDetail = {
  iun: 'c_b963-220220221119',
  paNotificationId: '220220221119',
  subject: 'Prova - status',
  sentAt: '2022-02-21T10:19:33.440Z',
  cancelledIun: 'mocked-cancelledIun',
  cancelledByIun: 'mocked-cancelledByIun',
  recipients: [
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
      token: 'mocked-token',
    },
  ],
  documents: [
    {
      digests: {
        sha256: '3b56e2b5641d5807fa83d6bc906a35135a6b8b7c21e694b859bbafc3d718d659',
      },
      contentType: 'application/pdf',
      title: 'Mocked document',
    },
  ],
  payment: {
    iuv: '',
    notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
    f24: {
      flatRate: {
        digests: {
          sha256: 'mocked-sha256',
        },
        contentType: 'mocked-contentType',
        title: 'Mocked document',
      },
      digital: {
        digests: {
          sha256: 'mocked-sha256',
        },
        contentType: 'mocked-contentType',
        title: 'Mocked document',
      },
      analog: {
        digests: {
          sha256: 'mocked-sha256',
        },
        contentType: 'mocked-contentType',
        title: 'Mocked document',
      },
    },
  },
  notificationStatus: NotificationStatus.PAID,
  notificationStatusHistory: [
    {
      status: NotificationStatus.DELIVERED,
      activeFrom: '2022-02-22T10:19:33.440Z',
      relatedTimelineElements: [],
    },
  ],
  timeline: [
    {
      elementId: 'c_b429-202203021814_start',
      timestamp: '2022-03-02T17:56:46.668Z',
      category: TimelineCategory.REQUEST_ACCEPTED,
      details: {
        taxId: 'mocked-taxId',
        category: TimelineCategory.REQUEST_ACCEPTED,
        recipients: [
          {
            recipientType: RecipientType.PF,
            taxId: 'ed84b8c9-444e-410d-80d7-cfad6aa12070',
            denomination: 'Mario Rossi',
            digitalDomicile: {
              type: DigitalDomicileType.PEC,
              address: 'nome.cognome@works.demo.it',
            },
            physicalAddress: {
              at: '',
              address: '',
              addressDetails: '',
              zip: '',
              municipality: '',
              province: '',
              foreignState: '',
            },
            token: '',
          },
        ],
        documentsDigests: [
          {
            sha256: '06e21dbe27ac8e41251a2cfa7003d697c04aea7591ca358c1218071c9ceb3875',
          },
        ],
        f24Digests: {
          flatRate: {
            sha256: '',
          },
          digital: {
            sha256: '',
          },
          analog: {
            sha256: '',
          },
        },
      },
      legalFactsIds: [
        {
          key: 'sender_ack~0f4Z32eLEiX8NSYR4WYzyvQvnQHh1t7Z',
          type: LegalFactType.SENDER_ACK,
        },
      ],
    },
    {
      elementId: 'c_b429-202203021814_deliveryMode_rec0',
      timestamp: '2022-03-02T17:56:50.303Z',
      category: TimelineCategory.NOTIFICATION_PATH_CHOOSE,
      details: {
        category: TimelineCategory.NOTIFICATION_PATH_CHOOSE,
        taxId: 'ed84b8c9-444e-410d-80d7-cfad6aa12070',
        deliveryMode: DeliveryMode.DIGITAL,
        physicalAddress: {
          at: '',
          address: '',
          addressDetails: '',
          zip: '',
          municipality: '',
          province: '',
          foreignState: '',
        },
        platform: {
          type: DigitalDomicileType.EMAIL,
          address: 'mocked@email.it',
        },
        special: {
          type: DigitalDomicileType.PEC,
          address: 'nome.cognome@works.demo.it',
        },
        general: {
          type: DigitalDomicileType.EMAIL,
          address: 'mocked@email.it',
        },
        courtesyAddresses: [
          {
            type: DigitalDomicileType.EMAIL,
            address: 'mocked@email.it',
          },
        ],
      },
    },
    {
      elementId: 'c_b429-202203021814_send_pec_rec0_PLATFORM_n1',
      timestamp: '2022-03-02T17:56:53.636Z',
      category: TimelineCategory.SEND_DIGITAL_DOMICILE,
      details: {
        category: TimelineCategory.SEND_DIGITAL_DOMICILE,
        taxId: 'ed84b8c9-444e-410d-80d7-cfad6aa12070',
        address: {
          type: DigitalDomicileType.EMAIL,
          address: 'mocked@email.it',
        },
        addressSource: AddressSource.GENERAL,
        retryNumber: 1,
        downstreamId: {
          systemId: '',
          messageId: '',
        },
      },
    },
    {
      elementId: 'c_b429-202203021814_send_pec_rec0_SPECIAL_n1',
      timestamp: '2022-03-02T17:56:56.856Z',
      category: TimelineCategory.SEND_DIGITAL_DOMICILE,
      details: {
        category: TimelineCategory.SEND_DIGITAL_DOMICILE,
        taxId: 'ed84b8c9-444e-410d-80d7-cfad6aa12070',
        address: {
          type: DigitalDomicileType.PEC,
          address: 'nome.cognome@works.demo.it',
        },
        addressSource: AddressSource.GENERAL,
        retryNumber: 1,
        downstreamId: {
          systemId: '',
          messageId: '',
        },
      },
    },
    {
      elementId: 'c_b429-202203021814_send_pec_result_rec0_SPECIAL_n1',
      timestamp: '2022-03-02T17:57:03.284Z',
      category: TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK,
      details: {
        category: TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK,
        taxId: 'ed84b8c9-444e-410d-80d7-cfad6aa12070',
        address: {
          type: DigitalDomicileType.PEC,
          address: 'nome.cognome@works.demo.it',
        },
        addressSource: AddressSource.GENERAL,
        retryNumber: 1,
        downstreamId: {
          systemId: '',
          messageId: '',
        },
        errors: ['OK'],
      },
    },
    {
      elementId: 'c_b429-202203021814_send_courtesy_rec0',
      timestamp: '2022-03-02T17:57:06.819Z',
      category: TimelineCategory.END_OF_DIGITAL_DELIVERY_WORKFLOW,
      details: {
        category: TimelineCategory.END_OF_DIGITAL_DELIVERY_WORKFLOW,
        taxId: 'ed84b8c9-444e-410d-80d7-cfad6aa12070',
      },
      legalFactsIds: [
        {
          key: 'digital_delivery_info_ed84b8c9-444e-410d-80d7-cfad6aa12070~QDr7GVmbdGkJJFEgxi0OlxPs.l2F2Wq.',
          type: LegalFactType.DIGITAL_DELIVERY,
        },
      ],
    },
    {
      elementId: 'c_b429-202203021814_recipient_timeout_rec0',
      timestamp: '2022-03-02T17:59:10.029Z',
      category: TimelineCategory.REFINEMENT,
      details: {
        category: TimelineCategory.REFINEMENT,
        taxId: 'ed84b8c9-444e-410d-80d7-cfad6aa12070',
      },
    },
  ],
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
};

export const notificationToFe = parseNotificationDetail(notificationFromBe);
