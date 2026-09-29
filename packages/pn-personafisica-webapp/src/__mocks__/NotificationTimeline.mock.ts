export const NotificationTimelineResponse = {
  iun: 'NMDX-NVHP-UEZE-202606-Y-1',
  subject: 'invio notifica test EC',
  recipients: [
    {
      recipientType: 'PF',
      taxId: 'TSTUTN00A07A001G',
      denomination: 'Utente Test Uno',
      physicalAddress: {
        at: 'Presso',
        address: 'A@FAIL-DISCOVERY_AR_IRR_D',
        addressDetails: 'SCALA B',
        zip: '00000',
        municipality: 'FAKE_CITY',
        municipalityDetails: 'FAKE_DISTRICT',
        province: 'FC',
        foreignState: 'FAKE_COUNTRY',
      },
      payments: [
        {
          pagoPa: {
            noticeCode: '321040300201910058',
            creditorTaxId: '77777777777',
            applyCost: true,
            attachment: {
              digests: {
                sha256: '1QKD/Ks6BohyQ+bgMxHf9NrpNhVmGUPxRYE1aerU4JQ=',
              },
              contentType: 'application/pdf',
              ref: {
                key: 'PN_NOTIFICATION_ATTACHMENTS-d7ec10e00bf847fcac1e4c70ea6e2afd.pdf',
                versionToken: 'sNP2YBogBBD2CXXe2dxx0DbOJO0AzyH.',
              },
            },
          },
        },
      ],
    },
  ],
  notificationStatusHistory: [
    {
      status: 'EFFECTIVE_DATE',
      activeFrom: '2026-06-05T13:43:26Z',
      reworkedStatus: 'VALID',
      steps: [],
    },
    {
      status: 'DELIVERED',
      activeFrom: '2026-06-05T13:39:26Z',
      deliveryMode: 'analog',
      reworkedStatus: 'VALID',
      steps: [],
    },
    {
      status: 'DELIVERING',
      activeFrom: '2026-06-05T13:35:17.470408161Z',
      steps: [
        {
          stepType: 'GROUP',
          group: {
            denomination: 'Utente Test Uno',
            taxId: 'TSTUTN00A07A001G',
            recIndex: 0,
            category: 'ANALOG',
            channel: 'AR_REGISTERED_LETTER',
            attempt: 2,
            registeredLetterCode: '383347ea4cfa4991bcecd57455e5e099',
            groupId:
              'DELIVERING_2026-06-05T13:35:17.470408161Z_NO_REWORK_ANALOG_AR_REGISTERED_LETTER_RECINDEX_0_ATTEMPT_2',
            hasReworkedEvents: true,
            events: [
              {
                elementId:
                  'SEND_ANALOG_FEEDBACK.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.REWORK_0',
                timestamp: '2026-06-05T13:39:26Z',
                details: {
                  recIndex: 0,
                  physicalAddress: {
                    at: 'Presso',
                    address:
                      'VIA@SEQUENCE.5S-CON080.5S-CON020[DOC:7ZIP;PAGES:3].5S-RECRN001A.5S-RECRN001B[DOC:AR].5S-RECRN001C',
                    zip: '20121',
                    municipality: 'MILANO',
                    province: 'MI',
                    foreignState: 'ITALIA',
                  },
                  sentAttemptMade: 1,
                  responseStatus: 'OK',
                  notificationDate: '2026-06-05T13:39:26Z',
                  deliveryDetailCode: 'RECRN001C',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.REWORK_0',
                  registeredLetterCode: '383347ea4cfa4991bcecd57455e5e099',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_FEEDBACK',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.IDX_3.REWORK_0',
                timestamp: '2026-06-05T13:39:26Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:39:26Z',
                  deliveryDetailCode: 'RECRN001B',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '0',
                      documentType: 'AR',
                      url: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-7ef511d5c883488e911cec4672efaa88.pdf',
                      date: '2026-06-05T13:39:26.75668039Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.REWORK_0',
                  registeredLetterCode: '383347ea4cfa4991bcecd57455e5e099',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-7ef511d5c883488e911cec4672efaa88.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.IDX_4.REWORK_0',
                timestamp: '2026-06-05T13:39:19Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:39:19Z',
                  deliveryDetailCode: 'CON020',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '0',
                      documentType: 'Copia Conforme AAR',
                      url: 'safestorage://PN_PRINTED-f421ad17371f414888a833aa9cbfea90.pdf',
                      date: '2026-06-05T13:39:25.362855498Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.REWORK_0',
                  registeredLetterCode: '383347ea4cfa4991bcecd57455e5e099',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_PRINTED-f421ad17371f414888a833aa9cbfea90.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.IDX_1.REWORK_0',
                timestamp: '2026-06-05T13:39:13Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:39:13Z',
                  deliveryDetailCode: 'CON080',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.REWORK_0',
                  registeredLetterCode: '383347ea4cfa4991bcecd57455e5e099',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.REWORK_0',
                timestamp: '2026-06-05T13:38:22.585440425Z',
                details: {
                  recIndex: 0,
                  physicalAddress: {
                    at: 'Presso',
                    address:
                      'VIA@SEQUENCE.5S-CON080.5S-CON020[DOC:7ZIP;PAGES:3].5S-RECRN001A.5S-RECRN001B[DOC:AR].5S-RECRN001C',
                    zip: '20121',
                    municipality: 'MILANO',
                    province: 'MI',
                    foreignState: 'ITALIA',
                  },
                  sentAttemptMade: 1,
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  relatedRequestId:
                    'PREPARE_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                  productType: 'AR',
                  analogCost: 364,
                  numberOfPages: 1,
                  envelopeWeight: 10,
                  prepareRequestId:
                    'PREPARE_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.REWORK_0',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_DOMICILE',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId: 'ANALOG_FAILURE_WORKFLOW.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0',
                timestamp: '2026-06-05T13:23:11.655865892Z',
                details: {
                  recIndex: 0,
                  generatedAarUrl: 'safestorage://PN_AAR-ddd5a776ff643aa91f22cc150738d7a.pdf',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_AAR-ddd5a776ff643aa91f22cc150738d7a.pdf',
                    category: 'AAR',
                  },
                ],
                category: 'ANALOG_FAILURE_WORKFLOW',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_FEEDBACK.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1',
                timestamp: '2026-06-05T13:22:53Z',
                details: {
                  recIndex: 0,
                  physicalAddress: {
                    at: 'Presso',
                    address:
                      'VIA@SEQUENCE.5S-CON080.5S-CON020[DOC:7ZIP;PAGES:3].5S-RECRN002D[FAILCAUSE:M03].5S-RECRN002E[DOC:PLICO].5S-RECRN002F@RESTART0.@SEQUENCE.5S-CON080.5S-CON020[DOC:7ZIP;PAGES:3].5S-RECRN002D[DISCOVERY;FAILCAUSE:M01].5S-RECRN002E[DOC:PLICO;DOC:INDAGINE].5S-RECRN002F@DISCOVERED.5S-CON080.5S-CON020[DOC:7ZIP;PAGES:3].5S-RECRN001A.5S-RECRN001B[DOC:AR].5S-RECRN001C',
                    zip: '20121',
                    municipality: 'MILANO',
                    province: 'MI',
                    foreignState: 'ITALIA',
                  },
                  sentAttemptMade: 1,
                  responseStatus: 'KO',
                  notificationDate: '2026-06-05T13:22:53Z',
                  deliveryFailureCause: 'M03',
                  deliveryDetailCode: 'RECRN002F',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1',
                  registeredLetterCode: 'bb9aa42d9dbd4c809a26b3421d93dca2',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_FEEDBACK',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.IDX_3',
                timestamp: '2026-06-05T13:22:53Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:22:53Z',
                  deliveryDetailCode: 'RECRN002E',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '0',
                      documentType: 'Plico',
                      url: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-495c1f2087b3488ea2ef4a617aa95e59.pdf',
                      date: '2026-06-05T13:22:53.358834299Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1',
                  registeredLetterCode: 'bb9aa42d9dbd4c809a26b3421d93dca2',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-495c1f2087b3488ea2ef4a617aa95e59.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.IDX_4',
                timestamp: '2026-06-05T13:22:45Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:22:45Z',
                  deliveryDetailCode: 'CON020',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '0',
                      documentType: 'Copia Conforme AAR',
                      url: 'safestorage://PN_PRINTED-af112903d4749808884a09ae9468485.pdf',
                      date: '2026-06-05T13:22:51.864549282Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1',
                  registeredLetterCode: 'bb9aa42d9dbd4c809a26b3421d93dca2',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_PRINTED-af112903d4749808884a09ae9468485.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1.IDX_1',
                timestamp: '2026-06-05T13:22:40Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:22:40Z',
                  deliveryDetailCode: 'CON080',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1',
                  registeredLetterCode: 'bb9aa42d9dbd4c809a26b3421d93dca2',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1',
                timestamp: '2026-06-05T13:19:48.618686946Z',
                details: {
                  recIndex: 0,
                  physicalAddress: {
                    at: 'Presso',
                    address:
                      'VIA@SEQUENCE.5S-CON080.5S-CON020[DOC:7ZIP;PAGES:3].5S-RECRN002D[FAILCAUSE:M03].5S-RECRN002E[DOC:PLICO].5S-RECRN002F@RESTART0.@SEQUENCE.5S-CON080.5S-CON020[DOC:7ZIP;PAGES:3].5S-RECRN002D[DISCOVERY;FAILCAUSE:M01].5S-RECRN002E[DOC:PLICO;DOC:INDAGINE].5S-RECRN002F@DISCOVERED.5S-CON080.5S-CON020[DOC:7ZIP;PAGES:3].5S-RECRN001A.5S-RECRN001B[DOC:AR].5S-RECRN001C',
                    zip: '20121',
                    municipality: 'MILANO',
                    province: 'MI',
                    foreignState: 'ITALIA',
                  },
                  sentAttemptMade: 1,
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  relatedRequestId:
                    'PREPARE_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                  productType: 'AR',
                  analogCost: 364,
                  numberOfPages: 1,
                  envelopeWeight: 10,
                  prepareRequestId:
                    'PREPARE_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_1',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_DOMICILE',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
            ],
          },
        },
        {
          stepType: 'GROUP',
          group: {
            denomination: 'Utente Test Uno',
            taxId: 'TSTUTN00A07A001G',
            recIndex: 0,
            category: 'ANALOG',
            channel: 'AR_REGISTERED_LETTER',
            attempt: 1,
            registeredLetterCode: '2ef060d6fb4c4848b416495649b7d188',
            groupId:
              'DELIVERING_2026-06-05T13:35:17.470408161Z_NO_REWORK_ANALOG_AR_REGISTERED_LETTER_RECINDEX_0_ATTEMPT_1',
            hasReworkedEvents: true,
            events: [
              {
                elementId:
                  'SEND_ANALOG_FEEDBACK.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.REWORK_0',
                timestamp: '2026-06-05T13:37:59Z',
                details: {
                  recIndex: 0,
                  physicalAddress: {
                    at: 'Presso',
                    address: 'A@FAIL-DISCOVERY_AR_IRR_D',
                    addressDetails: 'SCALA B',
                    zip: '00118',
                    municipality: 'ROMA',
                    municipalityDetails: 'CENTRO',
                    province: 'RM',
                    foreignState: 'ITALIA',
                  },
                  sentAttemptMade: 0,
                  responseStatus: 'KO',
                  notificationDate: '2026-06-05T13:37:59Z',
                  deliveryFailureCause: 'M01',
                  deliveryDetailCode: 'RECRN002F',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  newAddress: {
                    address:
                      'via@sequence.5s-CON080.5s-CON020[DOC:7ZIP;PAGES:3].5s-RECRN001A.5s-RECRN001B[DOC:AR].5s-RECRN001C',
                    zip: '20121',
                    municipality: 'Milano',
                    province: 'MI',
                    foreignState: 'Italia',
                  },
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.REWORK_0',
                  registeredLetterCode: '2ef060d6fb4c4848b416495649b7d188',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_FEEDBACK',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.IDX_4.REWORK_0',
                timestamp: '2026-06-05T13:37:59Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:37:59Z',
                  deliveryDetailCode: 'RECRN002E',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '0',
                      documentType: 'Plico',
                      url: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-5e6e101273474aac9dd2c996846617df.pdf',
                      date: '2026-06-05T13:37:59.280690595Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.REWORK_0',
                  registeredLetterCode: '2ef060d6fb4c4848b416495649b7d188',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-5e6e101273474aac9dd2c996846617df.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.IDX_3.REWORK_0',
                timestamp: '2026-06-05T13:37:59Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:37:59Z',
                  deliveryDetailCode: 'RECRN002E',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '1',
                      documentType: 'Indagine',
                      url: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-95c7bb3a3e6249df839434914202c0f7.pdf',
                      date: '2026-06-05T13:37:59.280690595Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.REWORK_0',
                  registeredLetterCode: '2ef060d6fb4c4848b416495649b7d188',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-95c7bb3a3e6249df839434914202c0f7.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.IDX_5.REWORK_0',
                timestamp: '2026-06-05T13:37:51Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:37:51Z',
                  deliveryDetailCode: 'CON020',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '0',
                      documentType: 'Copia Conforme AAR',
                      url: 'safestorage://PN_PRINTED-baf8622855fe445a921c32538fdf2f60.pdf',
                      date: '2026-06-05T13:37:59.263958679Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.REWORK_0',
                  registeredLetterCode: '2ef060d6fb4c4848b416495649b7d188',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_PRINTED-baf8622855fe445a921c32538fdf2f60.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.IDX_1.REWORK_0',
                timestamp: '2026-06-05T13:37:46Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:37:46Z',
                  deliveryDetailCode: 'CON080',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.REWORK_0',
                  registeredLetterCode: '2ef060d6fb4c4848b416495649b7d188',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.REWORK_0',
                timestamp: '2026-06-05T13:35:17.470408161Z',
                details: {
                  recIndex: 0,
                  physicalAddress: {
                    at: 'Presso',
                    address: 'A@FAIL-DISCOVERY_AR_IRR_D',
                    addressDetails: 'SCALA B',
                    zip: '00118',
                    municipality: 'ROMA',
                    municipalityDetails: 'CENTRO',
                    province: 'RM',
                    foreignState: 'ITALIA',
                  },
                  sentAttemptMade: 0,
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  productType: 'AR',
                  analogCost: 364,
                  numberOfPages: 1,
                  envelopeWeight: 10,
                  prepareRequestId:
                    'PREPARE_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.REWORK_0',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_DOMICILE',
                isHidden: false,
                reworkedStatus: 'VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_FEEDBACK.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                timestamp: '2026-06-05T13:19:23Z',
                details: {
                  recIndex: 0,
                  physicalAddress: {
                    at: 'Presso',
                    address: 'A@FAIL-DISCOVERY_AR_IRR_D',
                    addressDetails: 'SCALA B',
                    zip: '00118',
                    municipality: 'ROMA',
                    municipalityDetails: 'CENTRO',
                    province: 'RM',
                    foreignState: 'ITALIA',
                  },
                  sentAttemptMade: 0,
                  responseStatus: 'KO',
                  notificationDate: '2026-06-05T13:19:23Z',
                  deliveryFailureCause: 'M01',
                  deliveryDetailCode: 'RECRN002F',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  newAddress: {
                    address:
                      'via@sequence.5s-CON080.5s-CON020[DOC:7ZIP;PAGES:3].5s-RECRN002D[FAILCAUSE:M03].5s-RECRN002E[DOC:Plico].5s-RECRN002F@restart0.@sequence.5s-CON080.5s-CON020[DOC:7ZIP;PAGES:3].5s-RECRN002D[DISCOVERY;FAILCAUSE:M01].5s-RECRN002E[DOC:Plico;DOC:Indagine].5s-RECRN002F@discovered.5s-CON080.5s-CON020[DOC:7ZIP;PAGES:3].5s-RECRN001A.5s-RECRN001B[DOC:AR].5s-RECRN001C',
                    zip: '20121',
                    municipality: 'Milano',
                    province: 'MI',
                    foreignState: 'Italia',
                  },
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                  registeredLetterCode: '45956fb44b494acf9bff3f9ae357b770',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_FEEDBACK',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.IDX_4',
                timestamp: '2026-06-05T13:19:23Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:19:23Z',
                  deliveryDetailCode: 'RECRN002E',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '0',
                      documentType: 'Plico',
                      url: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-68d6ddff9076455f9476b681894a9953.pdf',
                      date: '2026-06-05T13:19:23.869871483Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                  registeredLetterCode: '45956fb44b494acf9bff3f9ae357b770',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-68d6ddff9076455f9476b681894a9953.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.IDX_3',
                timestamp: '2026-06-05T13:19:23Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:19:23Z',
                  deliveryDetailCode: 'RECRN002E',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '1',
                      documentType: 'Indagine',
                      url: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-8bae01a47f5a4242aec3046e6e396679.pdf',
                      date: '2026-06-05T13:19:23.869871483Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                  registeredLetterCode: '45956fb44b494acf9bff3f9ae357b770',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-8bae01a47f5a4242aec3046e6e396679.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.IDX_5',
                timestamp: '2026-06-05T13:19:16Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:19:16Z',
                  deliveryDetailCode: 'CON020',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  attachments: [
                    {
                      id: '0',
                      documentType: 'Copia Conforme AAR',
                      url: 'safestorage://PN_PRINTED-ee4d82f5ad2247ebb0f738254995d552.pdf',
                      date: '2026-06-05T13:19:23.781088987Z',
                    },
                  ],
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                  registeredLetterCode: '45956fb44b494acf9bff3f9ae357b770',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [
                  {
                    key: 'safestorage://PN_PRINTED-ee4d82f5ad2247ebb0f738254995d552.pdf',
                    category: 'ANALOG_DELIVERY',
                  },
                ],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_PROGRESS.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0.IDX_1',
                timestamp: '2026-06-05T13:19:11Z',
                details: {
                  recIndex: 0,
                  notificationDate: '2026-06-05T13:19:11Z',
                  deliveryDetailCode: 'CON080',
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  sendRequestId:
                    'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                  registeredLetterCode: '45956fb44b494acf9bff3f9ae357b770',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_PROGRESS',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
              {
                elementId:
                  'SEND_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                timestamp: '2026-06-05T13:17:32.189536831Z',
                details: {
                  recIndex: 0,
                  physicalAddress: {
                    at: 'Presso',
                    address: 'A@FAIL-DISCOVERY_AR_IRR_D',
                    addressDetails: 'SCALA B',
                    zip: '00118',
                    municipality: 'ROMA',
                    municipalityDetails: 'CENTRO',
                    province: 'RM',
                    foreignState: 'ITALIA',
                  },
                  sentAttemptMade: 0,
                  serviceLevel: 'AR_REGISTERED_LETTER',
                  productType: 'AR',
                  analogCost: 364,
                  numberOfPages: 1,
                  envelopeWeight: 10,
                  prepareRequestId:
                    'PREPARE_ANALOG_DOMICILE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0.ATTEMPT_0',
                  notRefinedRecipientIndexes: [],
                  recIndexes: [],
                  invalidatedTimelineAndStatusHistory: [],
                },
                legalFactsIds: [],
                category: 'SEND_ANALOG_DOMICILE',
                isHidden: false,
                reworkedStatus: 'NOT_VALID',
              },
            ],
          },
        },
      ],
    },
    {
      status: 'EFFECTIVE_DATE',
      activeFrom: '2026-06-05T13:27:11.655865892Z',
      reworkedStatus: 'NOT_VALID',
      steps: [],
    },
    {
      status: 'UNREACHABLE',
      activeFrom: '2026-06-05T13:23:11.655865892Z',
      reworkedStatus: 'NOT_VALID',
      steps: [
        {
          stepType: 'EVENT',
          event: {
            elementId: 'COMPLETELY_UNREACHABLE.IUN_NMDX-NVHP-UEZE-202606-Y-1.RECINDEX_0',
            timestamp: '2026-06-05T13:23:11.655865892Z',
            details: {
              recIndex: 0,
              legalFactGenerationDate: '2026-06-05T13:23:11.655865892Z',
              notRefinedRecipientIndexes: [],
              recIndexes: [],
              invalidatedTimelineAndStatusHistory: [],
            },
            legalFactsIds: [
              {
                key: 'safestorage://PN_LEGAL_FACTS-3ec01fa1cbce4e86a022f8f7827686eb.pdf',
                category: 'ANALOG_FAILURE_DELIVERY',
              },
            ],
            category: 'COMPLETELY_UNREACHABLE',
            isHidden: true,
            reworkedStatus: 'NOT_VALID',
          },
        },
      ],
    },
    {
      status: 'NOTIFICATION_TIMELINE_REWORKED',
      activeFrom: '2026-06-05T13:17:32.189536831Z',
      steps: [],
    },
    {
      status: 'ACCEPTED',
      activeFrom: '2026-06-05T13:12:50.043521089Z',
      steps: [
        {
          stepType: 'EVENT',
          event: {
            elementId: 'REQUEST_ACCEPTED.IUN_NMDX-NVHP-UEZE-202606-Y-1',
            timestamp: '2026-06-05T13:16:04.390535057Z',
            details: {
              notificationRequestId: 'Tk1EWC1OVkhQLVVFWkUtMjAyNjA2LVktMQ==',
              paProtocolNumber: 'f42a0f66-d59b-4400-915c-5cdcc789e65b',
              notRefinedRecipientIndexes: [],
              recIndexes: [],
              invalidatedTimelineAndStatusHistory: [],
            },
            legalFactsIds: [
              {
                key: 'safestorage://PN_LEGAL_FACTS-d415e7aa862e4af4ac094983673bda54.pdf',
                category: 'SENDER_ACK',
              },
            ],
            category: 'REQUEST_ACCEPTED',
            isHidden: true,
          },
        },
      ],
    },
  ],
};
