import {
  LegalFactId,
  LegalFactType,
  NotificationDetailOtherDocument,
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { mockApi } from '../../../__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { newNotificationDTO } from '../../../redux/newNotification/__test__/test-utils';
import { paymentInfo } from '../../../../__mocks__/ExternalRegistry.mock';
import { notificationDTO, notificationToFe } from '../../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO, notificationsToFe } from '../../../../__mocks__/Notifications.mock';
import { apiClient, externalClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
  CREATE_NOTIFICATION,
  GET_USER_GROUPS,
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PRELOAD_DOCUMENT,
} from '../notifications.routes';

describe('Notifications api tests', () => {
  mockAuthentication();

  it('getSentNotifications', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
        iunMatch: '',
        recipientId: '',
        status: '',
      }),
      200,
      undefined,
      notificationsDTO
    );

    const res = await NotificationsApi.getSentNotifications({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
      iunMatch: '',
      recipientId: '',
      status: '',
    });
    expect(res).toStrictEqual(notificationsToFe);
    mock.reset();
    mock.restore();
  });

  it('getSentNotification', async () => {
    const iun = 'mocked-iun';
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL(iun),
      200,
      undefined,
      notificationDTO
    );
    const res = await NotificationsApi.getSentNotification(iun);
    expect(res).toStrictEqual(notificationToFe);
    mock.reset();
    mock.restore();
  });

  it('getSentNotificationDocument', async () => {
    const iun = 'mocked-iun';
    const documentIndex = '0';
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex),
      200,
      undefined,
      { url: 'http://mocked-url.com' }
    );
    const res = await NotificationsApi.getSentNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
    mock.reset();
    mock.restore();
  });

  it('getSentNotificationOtherDocument', async () => {
    const iun = 'mocked-iun';
    const otherDocument: NotificationDetailOtherDocument = {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    };
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument),
      200,
      {
        documentId: otherDocument.documentId,
        documentType: otherDocument.documentType,
      },
      undefined
    );

    const res = await NotificationsApi.getSentNotificationOtherDocument(iun, otherDocument);
    expect(res).toStrictEqual({ url: '' });
    mock.reset();
    mock.restore();
  });

  it('getSentNotificationLegalfact', async () => {
    const iun = 'mocked-iun';
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact),
      200,
      undefined,
      undefined
    );

    const res = await NotificationsApi.getSentNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '' });
    mock.reset();
    mock.restore();
  });

  it('getUserGroups', async () => {
    const mock = mockApi(apiClient, 'GET', GET_USER_GROUPS(), 200, undefined, [
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' },
    ]);

    const res = await NotificationsApi.getUserGroups();
    expect(res).toStrictEqual([
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' },
    ]);
    mock.reset();
    mock.restore();
  });

  it('getNotificationPaymentInfo', async () => {
    const paymentInfoRequest = paymentInfo.map((payment) => ({
      creditorTaxId: payment.creditorTaxId,
      noticeCode: payment.noticeCode,
    }));

    const mock = mockApi(
      apiClient,
      'POST',
      NOTIFICATION_PAYMENT_INFO(),
      200,
      paymentInfoRequest,
      paymentInfo
    );
    const res = await NotificationsApi.getNotificationPaymentInfo(paymentInfoRequest);
    expect(res).toStrictEqual(paymentInfo);
    mock.reset();
    mock.restore();
  });

  it('preloadNotificationDocument', async () => {
    const mock = mockApi(
      apiClient,
      'POST',
      NOTIFICATION_PRELOAD_DOCUMENT(),
      200,
      [{ key: 'mocked-key', contentType: 'text/plain', sha256: 'mocked-sha256' }],
      [{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }]
    );
    const res = await NotificationsApi.preloadNotificationDocument([
      { key: 'mocked-key', contentType: 'text/plain', sha256: 'mocked-sha256' },
    ]);
    expect(res).toStrictEqual([{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }]);
    mock.reset();
    mock.restore();
  });

  it('uploadNotificationAttachment', async () => {
    const file = new Uint8Array();
    const mock = mockApi(
      externalClient,
      'PUT',
      'https://mocked-url.com',
      200,
      undefined,
      undefined,
      undefined,
      { 'x-amz-version-id': 'mocked-versionToken' }
    );

    const res = await NotificationsApi.uploadNotificationAttachment(
      'https://mocked-url.com',
      'mocked-sha256',
      'mocked-secret',
      file,
      'PUT'
    );
    expect(res).toStrictEqual('mocked-versionToken');
    mock.reset();
    mock.restore();
  });

  it('createNewNotification', async () => {
    const mock = mockApi(apiClient, 'POST', CREATE_NOTIFICATION(), 200, undefined, {
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    });
    // TODO: capire perchè è stato necessario rimuovere il body
    // per qualche motivo la libreria di mock considera diversi il body passato
    // e quello che gli arriva dalla chiamata alla funzione createNewNotification,
    // nonostante siano la stessa identica cosa
    const res = await NotificationsApi.createNewNotification(newNotificationDTO);
    expect(res).toStrictEqual({
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    });
    mock.reset();
    mock.restore();
  });
});
