import MockAdapter from 'axios-mock-adapter';
import * as React from 'react';
import { vi } from 'vitest';

import {
  AppResponseMessage,
  DOWNTIME_HISTORY,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';

import { downtimesDTO } from '../../__mocks__/AppStatus.mock';
import {
  notificationDTO,
  notificationDTOMultiRecipient,
} from '../../__mocks__/NotificationDetail.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import { getApiClient } from '../../api/apiClients';
import { NOTIFICATION_DETAIL } from '../../api/notifications/notifications.routes';
import NotificationDetail from '../NotificationDetail.page';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NotificationDetail Page - accessibility tests', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('one recipient - does not have basic accessibility issues rendering the page', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);

  it('one recipient - does not have basic accessibility issues rendering the page when API call returns error', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(500);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <NotificationDetail />
        </>
      );
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);

  it('multi recipient - does not have basic accessibility issues rendering the page', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTOMultiRecipient.iun)).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});
