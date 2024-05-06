import MockAdapter from 'axios-mock-adapter';

import {
  PaymentAttachmentNameType,
  PaymentAttachmentSName,
  formatToTimezoneString,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { newNotificationDTO } from '../../../__mocks__/NewNotification.mock';
import { notificationDTOMultiRecipient } from '../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO, notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { apiClient, externalClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
  CANCEL_NOTIFICATION,
  CREATE_NOTIFICATION,
  GET_USER_GROUPS,
  NOTIFICATIONS_LIST,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PRELOAD_DOCUMENT,
} from '../notifications.routes';

describe('Notifications api tests', () => {
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
          endDate: formatToTimezoneString(today),
          iunMatch: '',
          recipientId: '',
          status: '',
        })
      )
      .reply(200, notificationsDTO);
    const res = await NotificationsApi.getSentNotifications({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(today),
      iunMatch: '',
      recipientId: '',
      status: '',
    });
    expect(res).toStrictEqual(notificationsToFe);
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
    const res = await NotificationsApi.createNewNotification(newNotificationDTO);
    expect(res).toStrictEqual({
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    });
  });

  it('cancelNotification', async () => {
    mock.onPut(CANCEL_NOTIFICATION('mocked-iun')).reply(200);
    const res = await NotificationsApi.cancelNotification('mocked-iun');
    expect(res).toEqual(undefined);
  });

  it('getPaymentAttachment', async () => {
    const iun = notificationDTOMultiRecipient.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    const recIndex = 1;
    mock.onGet(NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName, recIndex)).reply(200, {
      url: 'http://mocked-url.com',
    });

    const res = await NotificationsApi.getPaymentAttachment(
      iun,
      attachmentName as PaymentAttachmentNameType,
      recIndex
    );
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });
});
