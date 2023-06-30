import React from 'react';
import { RenderResult } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import * as redux from 'react-redux';

import { NotificationDetail as INotificationDetail } from '@pagopa-pn/pn-commons';
import { render } from '../../__test__/test-utils';
import * as actions from '../../redux/notification/actions';
import NotificationDetail from '../NotificationDetail.page';


export const mockDispatchAndActions = (mocks: any) => {
  // mock dispatch
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  useDispatchSpy.mockReturnValue(mocks.mockDispatchFn as any);
  // mock action
  const actionSpy = jest.spyOn(actions, 'getReceivedNotification');
  actionSpy.mockImplementation(mocks.mockActionFn);
};

/*
 * The third parameter allows to simulate that the logged user is a delegate for the 
 * notification being rendered.
 * It must be passed in an additional parameter because it would be cumbersome (if not impossible)
 * to know whether the logged user is a recipient or a delegate based solely
 * in the notification object. 
 * If the notification is build using the function notificationToFeTwoRecipients, 
 * which includes a parameter that also indicates that the notification detail is requested 
 * by a recipient or a delegate, then unfortunately the same information is told twice,
 * to notificationToFeTwoRecipients and to renderComponent.
 * But I found no easy solution, so I prefer to keep the test source code as it is.
 * -----------------------------------------
 * Carlos Lombardi, 2022.11.21
 */
export const renderComponentBase = async (mocks: any, notification: INotificationDetail, mandateId?: string) => {
  // mock query params
  const mockedQueryParams: {id: string, mandateId?: string} = { id: 'mocked-id' };
  if (mandateId) {
    // eslint-disable-next-line functional/immutable-data
    mockedQueryParams.mandateId= mandateId;
  }
  mocks.mockUseParamsFn.mockReturnValue(mockedQueryParams);

  // mock Redux store state
  const reduxStoreState = {
    userState: { user: mocks.mockedUserInStore },
    notificationState: {
      notification,
      documentDownloadUrl: 'mocked-download-url',
      legalFactDownloadUrl: 'mocked-legal-fact-url',
    },
  };

  // mock dispatch and actions
  mockDispatchAndActions(mocks);

  // render component
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;
  await act(async () => {
    result = render(<NotificationDetail />, { preloadedState: reduxStoreState });
  });
  if (!result) {
    fail("render() returned undefined!");
  }
  return result;
};

