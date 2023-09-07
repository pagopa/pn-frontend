import React from 'react';
import * as redux from 'react-redux';

import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';
import { RenderResult, act } from '@testing-library/react';

import { notificationsToFe } from '../../__mocks__/Notifications.mock';
import { render } from '../../__test__/test-utils';
import * as actions from '../../redux/dashboard/actions';
import * as hooks from '../../redux/hooks';
import Notifiche from '../Notifiche.page';

export type TestScenario = {
  result?: RenderResult;
  mockDispatchFn: jest.Mock;
  mockActionFn: jest.Mock;
};

export async function doPrepareTestScenario(
  isDelegatedPage: boolean = false
): Promise<TestScenario> {
  const mockDispatchFn = jest.fn(() => ({
    then: () => Promise.resolve(),
  }));
  const mockActionFn = jest.fn();

  // mock app selector
  const spy = jest.spyOn(hooks, 'useAppSelector');
  spy
    .mockReturnValueOnce({
      notifications: notificationsToFe.resultsPage,
      filters: {
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(today),
        recipientId: '',
        status: '',
        subjectRegExp: '',
      },
      sort: {
        orderBy: '',
        order: 'asc',
      },
      pagination: {
        nextPagesKey: ['mocked-page-key-1', 'mocked-page-key-2', 'mocked-page-key-3'],
        size: 10,
        page: 0,
        moreResult: true,
      },
    })
    .mockReturnValueOnce({ delegators: [] })
    .mockReturnValueOnce({ defaultAddresses: [] });
  // mock action
  const actionSpy = jest.spyOn(actions, 'getReceivedNotifications');
  actionSpy.mockImplementation(mockActionFn);
  // mock dispatch
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  useDispatchSpy.mockReturnValue(mockDispatchFn as any);

  let result: RenderResult | undefined = undefined;

  // render component
  await act(async () => {
    result = render(<Notifiche isDelegatedPage={isDelegatedPage} />);
  });

  return { result, mockDispatchFn, mockActionFn };
}
