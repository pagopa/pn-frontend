import {
  formatDate,
  GetNotificationsParams,
  GetNotificationsResponse,
  LegalFactId,
  NotificationDetail,
  PaymentAttachmentNameType,
  PaymentInfo,
  PaymentNotice,
} from '@pagopa-pn/pn-commons';
import { AxiosResponse } from 'axios';

import { Delegator } from '../../redux/delegation/types';
// import { parseNotificationDetailForRecipient } from '../../utils/notification.utility';
// import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import { NotificationId } from '../../models/Notifications';
import { apiClient } from '../apiClients';
import {
  NOTIFICATIONS_LIST,
  // NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from './notifications.routes';

const getDownloadUrl = (response: AxiosResponse): { url: string } => {
  if (response.data) {
    return response.data as { url: string };
  }
  return { url: '' };
};

export const NotificationsApi = {
  /**
   * Gets current user notifications
   * @param  {string} startDate
   * @param  {string} endDate
   * @returns Promise
   */
  getReceivedNotifications: (params: GetNotificationsParams): Promise<GetNotificationsResponse> =>
    apiClient.get<GetNotificationsResponse>(NOTIFICATIONS_LIST(params)).then((response) => {
      if (response.data && response.data.resultsPage) {
        const notifications = response.data.resultsPage.map((d) => ({
          ...d,
          sentAt: formatDate(d.sentAt),
        }));
        return {
          ...response.data,
          resultsPage: notifications,
        };
      }
      return {
        resultsPage: [],
        moreResult: false,
        nextPagesKey: [],
      };
    }),

  /**
   * Gets current user notification detail
   * @param  {string} iun
   * @param  {string} currentUserTaxId
   * @param  {Array<Delegator>} delegatorsFromStore
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotification: (
    iun: string,
    currentUserTaxId: string,
    delegatorsFromStore: Array<Delegator>,
    mandateId?: string
  ): Promise<NotificationDetail> => {
    console.log(
      'iun,currentUserTaxId, delegatorsFromStore,mandateId :>> ',
      iun,
      currentUserTaxId,
      delegatorsFromStore,
      mandateId
    );
    return Promise.resolve({
      abstract: 'Funziona?',
      paProtocolNumber: '202212231645-1',
      subject: 'Prova QR code su AAR',
      recipients: [
        {
          recipientType: 'PF',
          taxId: 'LVLDAA85T50G702B',
          internalId: 'PG-dfa2d7f4-7c1e-4fef-be30-60ead786e70f',
          denomination: 'Ada Lovelace',
          digitalDomicile: { type: 'PEC', address: 'testpagopa2@pnpagopa.postecert.local' },
          physicalAddress: {
            at: '',
            address: 'via usgo bassi 7',
            addressDetails: '',
            zip: '40033',
            municipality: 'Casalecchio di reno',
            municipalityDetails: '',
            province: 'bologna',
            foreignState: 'Italia',
          },
        },
      ],
      documents: [
        {
          digests: { sha256: 'CviElulwzawElWvqFvgOE1Bz3OPgARuEyWH0Z33pmJk=' },
          contentType: 'application/pdf',
          ref: {
            key: 'PN_NOTIFICATION_ATTACHMENTS-0000-8MGL-5OOQ-Y2SN-UUGH',
            versionToken: '_mwCIWYD8g7ZcXulhh0_D.3jlOWtdNt5',
          },
          title: 'Prova Doc1',
          docIdx: '0',
        },
      ],
      notificationFeePolicy: 'FLAT_RATE',
      physicalCommunicationType: 'SIMPLE_REGISTERED_LETTER',
      senderDenomination: 'Comune di Palermo',
      senderTaxId: '80016350821',
      group: '639adf304fd43262d6e68a27',
      taxonomyCode: '010101N',
      senderPaId: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce',
      iun: 'WLDA-DHZH-JYDZ-202212-W-1',
      sentAt: '2022-12-23T15:47:59.275476Z',
      documentsAvailable: true,
      notificationStatus: 'VIEWED',
      notificationStatusHistory: [
        {
          status: 'ACCEPTED',
          activeFrom: '2022-12-23T15:47:59.275476Z',
          relatedTimelineElements: [
            'WLDA-DHZH-JYDZ-202212-W-1_request_accepted',
            'WLDA-DHZH-JYDZ-202212-W-1_aar_gen_0',
            'WLDA-DHZH-JYDZ-202212-W-1_send_courtesy_message_0_index_0',
            'WLDA-DHZH-JYDZ-202212-W-1_get_address_0_source_PLATFORM_attempt_0',
            'WLDA-DHZH-JYDZ-202212-W-1_get_address_0_source_SPECIAL_attempt_0',
          ],
        },
        {
          status: 'DELIVERING',
          activeFrom: '2022-12-23T15:49:19.511981Z',
          relatedTimelineElements: [
            'WLDA-DHZH-JYDZ-202212-W-1_send_digital_domicile_0_source_SPECIAL_attempt_0',
            'WLDA-DHZH-JYDZ-202212-W-1_digital_delivering_progress_0_source_SPECIAL_attempt_0_progidx_1',
            'WLDA-DHZH-JYDZ-202212-W-1_send_digital_feedback_0_source_SPECIAL_attempt_0',
          ],
        },
        {
          status: 'DELIVERED',
          activeFrom: '2022-12-23T15:51:14.629542Z',
          relatedTimelineElements: [
            'WLDA-DHZH-JYDZ-202212-W-1_digital_success_workflow_0',
            'WLDA-DHZH-JYDZ-202212-W-1_schedule_refinement_workflow_0',
          ],
        },
        {
          status: 'EFFECTIVE_DATE',
          activeFrom: '2022-12-23T16:50:55.093888Z',
          relatedTimelineElements: ['WLDA-DHZH-JYDZ-202212-W-1_refinement_0'],
        },
        {
          status: 'VIEWED',
          activeFrom: '2023-01-13T09:57:52.731391Z',
          relatedTimelineElements: ['WLDA-DHZH-JYDZ-202212-W-1_notification_viewed_0'],
        },
      ],
      timeline: [
        {
          elementId: 'WLDA-DHZH-JYDZ-202212-W-1_request_accepted',
          timestamp: '2022-12-23T15:48:33.084734Z',
          legalFactsIds: [
            {
              key: 'safestorage://PN_LEGAL_FACTS-0001-2MK7-KPFP-GJ0H-N02S',
              category: 'SENDER_ACK',
            },
          ],
          category: 'REQUEST_ACCEPTED',
        },
        {
          elementId: 'WLDA-DHZH-JYDZ-202212-W-1_aar_gen_0',
          timestamp: '2022-12-23T15:48:47.48973Z',
          legalFactsIds: [],
          category: 'AAR_GENERATION',
          details: {
            recIndex: 0,
            errors: [],
            numberOfPages: 1,
            generatedAarUrl: 'safestorage://PN_AAR-0001-3X2T-QJZA-9D06-63A1',
          },
        },
        {
          elementId: 'WLDA-DHZH-JYDZ-202212-W-1_send_courtesy_message_0_index_0',
          timestamp: '2022-12-23T15:48:50.083795Z',
          legalFactsIds: [],
          category: 'SEND_COURTESY_MESSAGE',
          details: {
            recIndex: 0,
            digitalAddress: { type: 'SMS', address: '+393466541500' },
            sendDate: '2022-12-23T15:48:50.083774Z',
            errors: [],
          },
        },
        {
          elementId: 'WLDA-DHZH-JYDZ-202212-W-1_get_address_0_source_PLATFORM_attempt_0',
          timestamp: '2022-12-23T15:49:17.24309Z',
          legalFactsIds: [],
          category: 'GET_ADDRESS',
          details: {
            recIndex: 0,
            digitalAddressSource: 'PLATFORM',
            isAvailable: false,
            attemptDate: '2022-12-23T15:49:17.243087Z',
            errors: [],
          },
        },
      ],
    } as unknown as NotificationDetail);
  },

  /*  apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun, mandateId)).then((response) => {
      if (response.data) {
        return parseNotificationDetailForRecipient(
          response.data,
          currentUserTaxId,
          delegatorsFromStore,
          mandateId
        );
      } else {
        return {} as NotificationDetailForRecipient;
      }
    }), */

  exchangeNotificationQrCode: (qrCode: string): Promise<NotificationId> =>
    apiClient
      .post<NotificationId>(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: qrCode })
      .then((response) => response.data),

  /**
   * Gets current user notification document
   * @param  {string} iun
   * @param  {number} documentIndex
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotificationDocument: (
    iun: string,
    documentIndex: string,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex, mandateId))
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user notification legalfact
   * @param  {string} iun
   * @param  {LegalFactId} legalFact
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotificationLegalfact: (
    iun: string,
    legalFact: LegalFactId,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact, mandateId))
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user specified Payment Attachment
   * @param  {string} iun
   * @param  {PaymentAttachmentNameType} attachmentName
   * @param  {string} mandateId
   * @returns Promise
   */
  getPaymentAttachment: (
    iun: string,
    attachmentName: PaymentAttachmentNameType,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(
        NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName as string, mandateId)
      )
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user's notification payment info
   * @param  {string} noticeCode
   * @param  {string} taxId
   * @returns Promise
   */
  getNotificationPaymentInfo: (noticeCode: string, taxId: string): Promise<PaymentInfo> =>
    apiClient
      .get<PaymentInfo>(NOTIFICATION_PAYMENT_INFO(taxId, noticeCode))
      .then((response) => response.data),

  /**
   * Gets current user's notification payment url
   * @param  {string} noticeCode
   * @param  {string} taxId
   * @returns Promise
   */
  getNotificationPaymentUrl: (
    paymentNotice: PaymentNotice,
    returnUrl: string
  ): Promise<{ checkoutUrl: string }> =>
    apiClient
      .post<{ checkoutUrl: string }>(NOTIFICATION_PAYMENT_URL(), {
        paymentNotice,
        returnUrl,
      })
      .then((response) => response.data),
};
