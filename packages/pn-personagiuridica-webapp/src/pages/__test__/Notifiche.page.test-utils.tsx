import React from 'react';
import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';
import { act, RenderResult } from '@testing-library/react';
import * as redux from 'react-redux';

import * as hooks from '../../redux/hooks';
import * as actions from '../../redux/dashboard/actions';
import { notificationsToFe } from '../../redux/dashboard/__test__/test-utils';
import { render } from '../../__test__/test-utils';
import Notifiche from '../Notifiche.page';

export type TestScenario = {
  result?: RenderResult;
  mockDispatchFn: jest.Mock;
  mockActionFn: jest.Mock;
};



export async function doPrepareTestScenario(isDelegatedPage: boolean = false): Promise<TestScenario> {
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
    .mockReturnValueOnce({ legalDomicile: [] });
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

