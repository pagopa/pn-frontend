import MockAdapter from 'axios-mock-adapter';
import * as React from 'react';

import { DOWNTIME_HISTORY, KnownFunctionality } from '@pagopa-pn/pn-commons';

import { downtimesDTO } from '../../__mocks__/AppStatus.mock';
import {
  notificationDTO,
  notificationDTOMultiRecipient,
} from '../../__mocks__/NotificationDetail.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { NOTIFICATION_DETAIL } from '../../api/notifications/notifications.routes';
import NotificationDetail from '../NotificationDetail.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NotificationDetail Page - accessibility tests', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
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
    mock
      .onGet(
        DOWNTIME_HISTORY({
          startDate: '2022-10-23T15:50:04Z',
          functionality: [
            KnownFunctionality.NotificationCreate,
            KnownFunctionality.NotificationVisualization,
            KnownFunctionality.NotificationWorkflow,
          ],
        })
      )
      .reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);

  it('multi recipient - does not have basic accessibility issues rendering the page', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTOMultiRecipient.iun)).reply(200, notificationDTO);
    mock
      .onGet(
        DOWNTIME_HISTORY({
          startDate: '2022-10-23T15:50:04Z',
          functionality: [
            KnownFunctionality.NotificationCreate,
            KnownFunctionality.NotificationVisualization,
            KnownFunctionality.NotificationWorkflow,
          ],
        })
      )
      .reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});
