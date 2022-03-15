import MockAdapter from 'axios-mock-adapter';
import { tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { notificationsFromBe, notificationsToFe } from '../../../redux/dashboard/__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { apiClient } from '../../axios';
import { NotificationsApi } from '../Notifications.api';

describe('Notifications api tests', () => {

  mockAuthentication();

  it('getReceivedNotifications', async() => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(`/delivery/notifications/received`).reply(200, notificationsFromBe);
    const res = await NotificationsApi.getReceivedNotifications({
      startDate: tenYearsAgo.toISOString(),
      endDate: today.toISOString()
    });
    expect(res).toStrictEqual(notificationsToFe);
    mock.reset();
    mock.restore();
  });
});