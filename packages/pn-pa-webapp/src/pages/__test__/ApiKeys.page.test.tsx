import { act, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import * as redux from 'react-redux';
import { ApiKeys as ApiKeysModel } from '../../models/ApiKeys';
import { UserGroup } from '../../models/user';
import { mockApiKeysForFE, mockApiKeysFromBE, mockGroups } from '../../redux/apiKeys/__test__/test-utils';
import { mockApi, render } from '../../__test__/test-utils';
import * as actions from '../../redux/apiKeys/actions';
import ApiKeys from '../ApiKeys.page';
import { apiClient } from '../../api/apiClients';
import { APIKEY_LIST } from '../../api/apiKeys/apiKeys.routes';
import { GET_USER_GROUPS } from '../../api/notifications/notifications.routes';
import MockAdapter from 'axios-mock-adapter';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

describe('ApiKeys Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;
  let mock: MockAdapter;
  const initialState = () => ({
    preloadedState: {
      apiKeysState: {
        loading: false,
        apiKeys: { items: [], total: 0 },
        pagination: {
          size: 10,
          page: 0,
          nextPagesKey: [],
        },
      },
    },
  });

  afterEach(() => {
    result = undefined;
    if(mock) {
      mock.reset();
      mock.restore();
    }
  });

  it('renders the page', async () => {
    mock = mockApi(apiClient, 'GET', APIKEY_LIST(), 200, undefined, mockApiKeysFromBE);
    await act(async () => {
      result = render(<ApiKeys />, initialState());
    });
    expect(result?.getAllByRole('heading')[0]).toHaveTextContent(/title/i);
  });

  it('renders the page with apiKeys list and click Generate New Api Key button', async () => {
    mock = mockApi(apiClient, 'GET', APIKEY_LIST(), 200, undefined, mockApiKeysFromBE);
    const mock2 = mockApi(mock, 'GET', GET_USER_GROUPS(), 200, undefined, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />, initialState());
    });
    const tableApiKeys = result?.container.querySelector('table');
    expect(tableApiKeys).toBeInTheDocument();

    const button = result?.queryByTestId('generateApiKey');
    expect(button).toBeInTheDocument();
    fireEvent.click(button!);

    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
    mock2.reset();
    mock2.restore();
  });
});
