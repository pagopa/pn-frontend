import MockAdapter from 'axios-mock-adapter';
import { tenYearsAgo, today, LegalFactId, LegalFactType } from '@pagopa-pn/pn-commons';

import {
  notificationsFromBe,
  notificationsToFe,
} from '../../../redux/dashboard/__test__/test-utils';
import {
  notificationFromBe,
  notificationToFe,
} from '../../../redux/notification/__test__/test-utils';
import { newNotification } from './../../../redux/newNotification/__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { apiClient, externalClient } from '../../axios';
import { NotificationsApi } from '../Notifications.api';

describe('Notifications api tests', () => {
  mockAuthentication();

  it('getSentNotifications', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(`/delivery/notifications/sent`).reply(200, notificationsFromBe);
    const res = await NotificationsApi.getSentNotifications({
      startDate: tenYearsAgo.toISOString(),
      endDate: today.toISOString(),
    });
    expect(res).toStrictEqual(notificationsToFe);
    mock.reset();
    mock.restore();
  });

  it('getSentNotification', async () => {
    const iun = 'mocked-iun';
    const mock = new MockAdapter(apiClient);
    mock.onGet(`/delivery/notifications/sent/${iun}`).reply(200, notificationFromBe);
    const res = await NotificationsApi.getSentNotification(iun);
    expect(res).toStrictEqual(notificationToFe);
    mock.reset();
    mock.restore();
  });

  it('getSentNotificationDocument', async () => {
    const iun = 'mocked-iun';
    const documentIndex = 0;
    const mock = new MockAdapter(apiClient);
    mock
      .onGet(`/delivery/notifications/sent/${iun}/documents/${documentIndex}`)
      .reply(200, { url: 'http://mocked-url.com' });
    const res = await NotificationsApi.getSentNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
    mock.reset();
    mock.restore();
  });

  it('getSentNotificationLegalfact', async () => {
    const iun = 'mocked-iun';
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      type: LegalFactType.ANALOG_DELIVERY,
    };
    const mock = new MockAdapter(apiClient);
    mock
      .onGet(`/delivery-push/legalfacts/${iun}/${legalFact.type}/${legalFact.key}`)
      .reply(200, undefined);
    const res = await NotificationsApi.getSentNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '' });
    mock.reset();
    mock.restore();
  });

  it('preloadNotificationDocument', async () => {
    const mock = new MockAdapter(apiClient);
    mock
      .onPost(`/delivery/attachments/preload`, {
        items: [{ key: 'mocked-key', contentType: 'text/plain' }],
      })
      .reply(200, { items: [{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }] });
    const res = await NotificationsApi.preloadNotificationDocument([
      { key: 'mocked-key', contentType: 'text/plain' },
    ]);
    expect(res).toStrictEqual([{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }]);
    mock.reset();
    mock.restore();
  });

  it('uploadNotificationDocument', async () => {
    const mock = new MockAdapter(externalClient);
    mock
      .onPut(
        `https://mocked-url.com`,
        { 'upload-file': 'mocked-fileBase64' }
      )
      .reply(200, void 0);
    const res = await NotificationsApi.uploadNotificationDocument(
      'https://mocked-url.com',
      'mocked-sha256',
      'mocked-secret',
      'mocked-fileBase64'
    );
    expect(res).toStrictEqual(void 0);
    mock.reset();
    mock.restore();
  });

  it('createNewNotification', async () => {
    const mock = new MockAdapter(apiClient);
    mock
      .onPost(
        `/delivery/requests`,
        newNotification
      )
      .reply(200, {
        notificationRequestId: 'mocked-notificationRequestId',
        paProtocolNumber: 'mocked-paProtocolNumber',
        idempotenceToken: 'mocked-idempotenceToken'
      });
    const res = await NotificationsApi.createNewNotification(newNotification);
    expect(res).toStrictEqual({
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken'
    });
    mock.reset();
    mock.restore();
  });
});
