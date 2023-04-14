/* eslint-disable functional/no-let */
import React from 'react';

import * as redux from 'react-redux';
import { act, fireEvent, RenderResult, screen } from '@testing-library/react';
import { render } from '../../__test__/test-utils';
import * as actions from '../../redux/contact/actions';
import Contacts from '../Contacts.page';
import { PROFILO } from '../../navigation/routes.const';
import { ContactsApi } from '../../api/contacts/Contacts.api';
import {
  apiOutcomeTestHelper,
  AppResponseMessage,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

const mockNavigateFn = jest.fn();
// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

/**
 * Vedi commenti nella definizione di simpleMockForApiErrorWrapper
 */
jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    ApiErrorWrapper: original.simpleMockForApiErrorWrapper,
  };
});

jest.mock('../../component/Contacts/InsertLegalContact', () => () => <div>InsertLegalContact</div>);
jest.mock('../../component/Contacts/CourtesyContacts', () => () => <div>CourtesyContacts</div>);
jest.mock('../../component/Contacts/IOContact', () => () => <div>IOContact</div>);

const initialState = {
  preloadedState: {
    userState: {
      user: {
        uid: 'mocked-recipientId',
      },
    },
    contactsState: {
      digitalAddresses: {
        legal: [],
        courtesy: [],
      },
    },
  },
};

describe('Contacts page - assuming contact API works properly', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  const mockActionFn = jest.fn();

  beforeEach(async () => {
    mockDispatchFn = jest.fn(() => ({
      then: () => Promise.resolve(),
    }));

    // mock action
    const actionSpy = jest.spyOn(actions, 'getDigitalAddresses');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);

    // render component
    await act(async () => {
      result = render(<Contacts />, initialState);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders Contacts (no contacts)', () => {
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/InsertLegalContact/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(result.container).toHaveTextContent(/IOContact/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith('mocked-recipientId');
  });

  it('subtitle link properly redirects to profile page', () => {
    const subtitleLink = result.getByText('subtitle-link-3');
    expect(subtitleLink).toBeInTheDocument();

    fireEvent.click(subtitleLink);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(PROFILO);
  });
});

describe('Contacts Page - different contact API behaviors', () => {
  beforeEach(() => {
    apiOutcomeTestHelper.setStandardMock();
  });

  afterEach(() => {
    apiOutcomeTestHelper.clearMock();
  });

  it('API error', async () => {
    const apiSpy = jest.spyOn(ContactsApi, 'getDigitalAddresses');
    apiSpy.mockRejectedValue({ response: { status: 500 } });
    await act(
      async () =>
        void render(
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <Contacts />
          </>
        )
    );
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });

  it('API OK', async () => {
    const apiSpy = jest.spyOn(ContactsApi, 'getDigitalAddresses');
    apiSpy.mockResolvedValue({ legal: [], courtesy: [] });
    await act(
      async () =>
        void render(
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <Contacts />
          </>
        )
    );
    apiOutcomeTestHelper.expectApiOKComponent(screen);
  });
});
