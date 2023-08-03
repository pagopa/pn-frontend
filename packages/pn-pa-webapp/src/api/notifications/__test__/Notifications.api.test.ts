import MockAdapter from 'axios-mock-adapter';

import {
    formatToTimezoneString, getNextDay, LegalFactId, LegalFactType, NotificationDetailOtherDocument,
    tenYearsAgo, today
} from '@pagopa-pn/pn-commons';

import { mockApi } from '../../../__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import {
    notificationsFromBe, notificationsToFe
} from '../../../redux/dashboard/__test__/test-utils';
import { newNotificationDTO } from '../../../redux/newNotification/__test__/test-utils';
import {
    notificationFromBe, notificationToFe
} from '../../../redux/notification/__test__/test-utils';
import { apiClient, externalClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
    CREATE_NOTIFICATION, GET_USER_GROUPS, NOTIFICATION_DETAIL, NOTIFICATION_DETAIL_DOCUMENTS,
    NOTIFICATION_DETAIL_LEGALFACT, NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
    NOTIFICATION_PRELOAD_DOCUMENT, NOTIFICATIONS_LIST
} from '../notifications.routes';
import axios from 'axios';

describe('Notifications api tests', () => {
  mockAuthentication();

  let mock: MockAdapter;

  afterEach(() => {
    mock.reset();
    mock.restore();
  });

  it('getSentNotifications', async () => {
    mock = mockApi(
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
      notificationsFromBe
    );

    const res = await NotificationsApi.getSentNotifications({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
      iunMatch: '',
      recipientId: '',
      status: '',
    });
    expect(res).toStrictEqual(notificationsToFe);
  });

  it('getSentNotification filtered by iun', async () => {
    const iun = 'mocked-iun';
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL(iun),
      200,
      undefined,
      notificationFromBe
    );
    const res = await NotificationsApi.getSentNotification(iun);
    expect(res).toStrictEqual(notificationToFe);
  });

  it('getSentNotificationDocument', async () => {
    const iun = 'mocked-iun';
    const documentIndex = '0';
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex),
      200,
      undefined,
      { url: 'http://mocked-url.com' }
    );
    const res = await NotificationsApi.getSentNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });

  it('getSentNotificationOtherDocument', async () => {
    const iun = 'mocked-iun';
    const otherDocument: NotificationDetailOtherDocument = {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    };
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument),
      200,
      {
        documentId: otherDocument.documentId,
        documentType: otherDocument.documentType,
      }
    );
    const res = await NotificationsApi.getSentNotificationOtherDocument(iun, otherDocument);
    expect(res).toStrictEqual({ url: '' });
  });

  it('getSentNotificationLegalfact', async () => {
    const iun = 'mocked-iun';
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact),
      200);
    const res = await NotificationsApi.getSentNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '' });
  });

  it('getUserGroups', async () => {
    mock = mockApi(apiClient, 'GET', GET_USER_GROUPS(), 200, undefined, [
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' },
    ]);
    const res = await NotificationsApi.getUserGroups();
    expect(res).toStrictEqual([
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' },
    ]);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/ext-registry/pa/v1/groups');
  });

  it('preloadNotificationDocument', async () => {
    mock = mockApi(
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
  });

  it('uploadNotificationAttachment', async () => {
    const file = new Uint8Array();
    mock = mockApi(externalClient, 'PUT', `https://mocked-url.com`, 200, undefined, void 0, undefined, {
      'x-amz-version-id': 'mocked-versionToken',
    });
    const res = await NotificationsApi.uploadNotificationAttachment(
      'https://mocked-url.com',
      'mocked-sha256',
      'mocked-secret',
      file,
      'PUT'
    );
    expect(res).toStrictEqual('mocked-versionToken');
  });

  it('createNewNotification', async () => {
    mock = mockApi(apiClient, 'POST', CREATE_NOTIFICATION(), 200, undefined, {
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
  });
});
