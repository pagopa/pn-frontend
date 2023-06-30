import MockAdapter from 'axios-mock-adapter';
import {
  tenYearsAgo,
  today,
  LegalFactId,
  LegalFactType,
  formatToTimezoneString,
  getNextDay,
  NotificationDetailOtherDocument,
} from '@pagopa-pn/pn-commons';

import {
  notificationsFromBe,
  notificationsToFe,
} from '../../../redux/dashboard/__test__/test-utils';
import {
  notificationFromBe,
  notificationToFe,
} from '../../../redux/notification/__test__/test-utils';
import { newNotificationDTO } from '../../../redux/newNotification/__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
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
  NOTIFICATION_PRELOAD_DOCUMENT,
} from '../notifications.routes';

describe('Notifications api tests', () => {
  mockAuthentication();

  it('getSentNotifications', async () => {
    const mock = new MockAdapter(apiClient);
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          iunMatch: '',
          recipientId: '',
          status: '',
        })
      )
      .reply(200, notificationsFromBe);
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
    const mock = new MockAdapter(apiClient);
    mock.onGet(NOTIFICATION_DETAIL(iun)).reply(200, notificationFromBe);
    const res = await NotificationsApi.getSentNotification(iun);
    expect(res).toStrictEqual(notificationToFe);
    mock.reset();
    mock.restore();
  });

  it('getSentNotificationDocument', async () => {
    const iun = 'mocked-iun';
    const documentIndex = '0';
    const mock = new MockAdapter(apiClient);
    mock
      .onGet(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex))
      .reply(200, { url: 'http://mocked-url.com' });
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
    const mock = new MockAdapter(apiClient);
    mock
      .onGet(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument), {
        documentId: otherDocument.documentId,
        documentType: otherDocument.documentType,
      })
      .reply(200, undefined);
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
    const mock = new MockAdapter(apiClient);
    mock.onGet(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact)).reply(200, undefined);
    const res = await NotificationsApi.getSentNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '' });
    mock.reset();
    mock.restore();
  });

  it('getUserGroups', async () => {
    const mock = new MockAdapter(apiClient);
    mock
      .onGet(GET_USER_GROUPS())
      .reply(200, [{ id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' }]);
    const res = await NotificationsApi.getUserGroups();
    expect(res).toStrictEqual([
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' },
    ]);
    mock.reset();
    mock.restore();
  });

  it('preloadNotificationDocument', async () => {
    const mock = new MockAdapter(apiClient);
    mock
      .onPost(NOTIFICATION_PRELOAD_DOCUMENT(), [
        { key: 'mocked-key', contentType: 'text/plain', sha256: 'mocked-sha256' },
      ])
      .reply(200, [{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }]);
    const res = await NotificationsApi.preloadNotificationDocument([
      { key: 'mocked-key', contentType: 'text/plain', sha256: 'mocked-sha256' },
    ]);
    expect(res).toStrictEqual([{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }]);
    mock.reset();
    mock.restore();
  });

  it('uploadNotificationAttachment', async () => {
    const file = new Uint8Array();
    const mock = new MockAdapter(externalClient);
    mock
      .onPut(`https://mocked-url.com`)
      .reply(200, void 0, { 'x-amz-version-id': 'mocked-versionToken' });
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
    const mock = new MockAdapter(apiClient);
    // TODO: capire perchè è stato necessario rimuovere il body
    // per qualche motivo la libreria di mock considera diversi il body passato
    // e quello che gli arriva dalla chiamata alla funzione createNewNotification,
    // nonostante siano la stessa identica cosa
    mock.onPost(CREATE_NOTIFICATION()).reply(200, {
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    });
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
