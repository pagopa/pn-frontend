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
  parseNotificationDetail,
} from '@pagopa-pn/pn-commons';

export const notificationFromBe: NotificationDetail = {
  iun: 'c_b963-220220221119',
  paProtocolNumber: '220220221119',
  subject: 'Prova - status',
  abstract: 'mocked-abstract',
  sentAt: '2022-02-21T10:19:33.440Z',
  cancelledIun: 'mocked-cancelledIun',
  cancelledByIun: 'mocked-cancelledByIun',
  documentsAvailable: true,
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
  senderPaId: 'mocked-senderPaId',
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
      payment: {
        noticeCode: 'mocked-noticeCode',
        creditorTaxId: 'mocked-creditorTaxId',
        pagoPaForm: {
          digests: {
            sha256: 'mocked-sha256',
          },
          contentType: 'mocked-contentType',
          ref: {
            key: 'Avviso PagoPa',
            versionToken: 'mocked-versionToken'
          }
        },
        f24standard: {
          digests: {
            sha256: 'mocked-sha256',
          },
          contentType: 'mocked-contentType',
          ref: {
            key: 'F24 Standard',
            versionToken: 'mocked-versionToken'
          }
        },
      },
    },
  ],
  documents: [
    {
      digests: {
        sha256: '3b56e2b5641d5807fa83d6bc906a35135a6b8b7c21e694b859bbafc3d718d659',
      },
      contentType: 'application/pdf',
      title: 'Mocked document',
      ref: {
        key: 'Doc1',
        versionToken: 'mocked-versionToken',
      },
      docIdx: '0',
    },
  ],
  notificationStatus: NotificationStatus.DELIVERED,
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
      details: {},
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
        digitalAddress: {
          type: DigitalDomicileType.EMAIL,
          address: 'mocked@email.it',
        },
        digitalAddressSource: AddressSource.GENERAL,
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
        digitalAddress: {
          type: DigitalDomicileType.PEC,
          address: 'nome.cognome@works.demo.it',
        },
        digitalAddressSource: AddressSource.GENERAL,
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
        digitalAddress: {
          type: DigitalDomicileType.PEC,
          address: 'nome.cognome@works.demo.it',
        },
        digitalAddressSource: AddressSource.GENERAL,
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
      category: TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK,
      details: {},
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
  ],
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  amount: 130
};

export const notificationToFe = parseNotificationDetail(notificationFromBe);

export const notificationFromBeMultiRecipient: NotificationDetail = {
  iun: 'c_b963-220220221119',
  paProtocolNumber: '220220221119',
  subject: 'Prova - status',
  abstract: 'mocked-abstract',
  sentAt: '2022-02-21T10:19:33.440Z',
  cancelledIun: 'mocked-cancelledIun',
  cancelledByIun: 'mocked-cancelledByIun',
  documentsAvailable: true,
  senderPaId: 'mocked-senderPaId',
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
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
      payment: {
        noticeCode: 'mocked-noticeCode1',
        creditorTaxId: 'mocked-creditorTaxId1',
        pagoPaForm: {
          digests: {
            sha256: 'mocked-sha256',
          },
          contentType: 'mocked-contentType',
          ref: {
            key: 'Avviso PagoPa',
            versionToken: 'mocked-versionToken'
          }
        },
        f24standard: {
          digests: {
            sha256: 'mocked-sha256',
          },
          contentType: 'mocked-contentType',
          ref: {
            key: 'F24 standard',
            versionToken: 'mocked-versionToken'
          }
        }
      },
    },
    {
      recipientType: RecipientType.PF,
      taxId: 'CGNNMO80A03H501V',
      denomination: 'Altro Ok',
      digitalDomicile: {
        address: 'mail2@pec.it',
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
        noticeCode: 'mocked-noticeCode2',
        creditorTaxId: 'mocked-creditorTaxId2',
        pagoPaForm: {
          digests: {
            sha256: 'mocked-sha256',
          },
          contentType: 'mocked-contentType',
          ref: {
            key: 'Avviso PagoPa',
            versionToken: 'mocked-versionToken'
          }
        }
      }
    },
  ],
  documents: [
    {
      digests: {
        sha256: '3b56e2b5641d5807fa83d6bc906a35135a6b8b7c21e694b859bbafc3d718d659',
      },
      contentType: 'application/pdf',
      title: 'Mocked document',
      ref: {
        key: 'Doc1',
        versionToken: 'mocked-versionToken',
      },
      docIdx: '0',
    },
  ],
  notificationStatus: NotificationStatus.DELIVERED,
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
      },
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
        }
      },
    },
    {
      elementId: 'c_b429-202203021814_send_pec_rec0_PLATFORM_n1',
      timestamp: '2022-03-02T17:56:53.636Z',
      category: TimelineCategory.SEND_DIGITAL_DOMICILE,
      details: {
        digitalAddress: {
          type: DigitalDomicileType.EMAIL,
          address: 'mocked@email.it',
        },
        digitalAddressSource: AddressSource.GENERAL,
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
        digitalAddress: {
          type: DigitalDomicileType.PEC,
          address: 'nome.cognome@works.demo.it',
        },
        digitalAddressSource: AddressSource.GENERAL,
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
        digitalAddress: {
          type: DigitalDomicileType.PEC,
          address: 'nome.cognome@works.demo.it',
        },
        digitalAddressSource: AddressSource.GENERAL,
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
      category: TimelineCategory.SEND_DIGITAL_DOMICILE_FEEDBACK,
      details: {},
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
      details: {
        recIndex: 0,
      },
    },
  ],
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  amount: 200
};

export const notificationToFeMultiRecipient = parseNotificationDetail(
  notificationFromBeMultiRecipient
);
