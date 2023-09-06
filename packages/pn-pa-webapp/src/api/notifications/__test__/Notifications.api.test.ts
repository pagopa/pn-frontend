import MockAdapter from 'axios-mock-adapter';

import {
  LegalFactId,
  LegalFactType,
  NotificationDetailOtherDocument,
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { newNotificationDTO } from '../../../__mocks__/NewNotification.mock';
import {
  notificationDTOMultiRecipient,
  notificationToFeMultiRecipient,
} from '../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO, notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { apiClient, externalClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
  CANCEL_NOTIFICATION,
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
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('getSentNotifications', async () => {
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
      .reply(200, notificationsDTO);
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
    const iun = notificationDTOMultiRecipient.iun;
    mock.onGet(NOTIFICATION_DETAIL(iun)).reply(200, notificationDTOMultiRecipient);
    const res = await NotificationsApi.getSentNotification(iun);
    expect(res).toStrictEqual(notificationToFeMultiRecipient);
  });

  it('getSentNotificationDocument', async () => {
    const iun = notificationDTOMultiRecipient.iun;
    const documentIndex = '0';
    mock
      .onGet(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex))
      .reply(200, { url: 'http://mocked-url.com' });
    const res = await NotificationsApi.getSentNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });

  it('getSentNotificationOtherDocument', async () => {
    const iun = notificationDTOMultiRecipient.iun;
    const otherDocument: NotificationDetailOtherDocument = {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    };
    mock
      .onGet(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument), {
        documentId: otherDocument.documentId,
      })
      .reply(200, { url: 'http://mocked-url.com' });
    const res = await NotificationsApi.getSentNotificationOtherDocument(iun, otherDocument);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });

  it('getSentNotificationLegalfact', async () => {
    const iun = notificationDTOMultiRecipient.iun;
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    mock
      .onGet(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact))
      .reply(200, { url: 'http://mocked-url.com' });
    const res = await NotificationsApi.getSentNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });

  it('getUserGroups', async () => {
    mock
      .onGet(GET_USER_GROUPS())
      .reply(200, [{ id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' }]);
    const res = await NotificationsApi.getUserGroups();
    expect(res).toStrictEqual([
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' },
    ]);
  });

  it('preloadNotificationDocument', async () => {
    mock
      .onPost(NOTIFICATION_PRELOAD_DOCUMENT(), [
        { key: 'mocked-key', contentType: 'text/plain', sha256: 'mocked-sha256' },
      ])
      .reply(200, [{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }]);
    const res = await NotificationsApi.preloadNotificationDocument([
      { key: 'mocked-key', contentType: 'text/plain', sha256: 'mocked-sha256' },
    ]);
    expect(res).toStrictEqual([{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }]);
  });

  it('uploadNotificationAttachment', async () => {
    const file = new Uint8Array();
    const extMock = new MockAdapter(externalClient);
    extMock.onPut(`https://mocked-url.com`).reply(200, undefined, {
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
    extMock.reset();
    extMock.restore();
  });

  it('createNewNotification', async () => {
    mock.onPost(CREATE_NOTIFICATION(), newNotificationDTO).reply(200, {
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

  it('cancelNotification', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPut(CANCEL_NOTIFICATION('mocked-iun')).reply(200);
    const res = await NotificationsApi.cancelNotification('mocked-iun');
    expect(res).toEqual(undefined);
    mock.reset();
    mock.restore();
  });
});
