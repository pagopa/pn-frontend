import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { mockApiKeysDTO, mockApiKeysForFE, mockGroups } from '../../__mocks__/ApiKeys.mock';
import { RenderResult, act, fireEvent, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { APIKEY_LIST } from '../../api/apiKeys/apiKeys.routes';
import { GET_USER_GROUPS } from '../../api/notifications/notifications.routes';
import * as routes from '../../navigation/routes.const';
import ApiKeys from '../ApiKeys.page';

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

const reduxInitialState = {
  apiKeysState: {
    loading: false,
    apiKeys: { items: [], total: 0 },
    pagination: {
      size: 10,
      page: 0,
      nextPagesKey: [],
    },
  },
};

describe('ApiKeys Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

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

  it('renders the page', async () => {
    mock.onGet(APIKEY_LIST()).reply(200, mockApiKeysDTO);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />, { preloadedState: reduxInitialState });
    });
    expect(result!.container).toHaveTextContent(/title/i);
    expect(result!.container).toHaveTextContent(/generated-api-keys/i);
    const newApiKeyButton = result?.getByTestId('generateApiKey');
    expect(newApiKeyButton).toBeInTheDocument();
    expect(result!.getByTestId('tableApiKeys')).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(2);
  });

  it('click Generate New Api Key button', async () => {
    mock.onGet(APIKEY_LIST()).reply(200, mockApiKeysDTO);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />, { preloadedState: reduxInitialState });
    });
    const button = result?.queryByTestId('generateApiKey');
    fireEvent.click(button!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_API_KEY);
    });
  });

  it('change pagination and size', async () => {
    mock.onGet(APIKEY_LIST()).reply(function (config) {
      if (
        config.params.limit === 2 &&
        config.params.lastKey === mockApiKeysDTO.lastKey &&
        config.params.lastUpdate === mockApiKeysDTO.lastUpdate
      ) {
        return [200, { ...mockApiKeysDTO, items: mockApiKeysDTO.items.slice(2) }];
      } else if (config.params.limit === 20) {
        return [200, mockApiKeysDTO];
      }
      return [200, { ...mockApiKeysDTO, items: mockApiKeysDTO.items.slice(0, 2) }];
    });
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />, {
        preloadedState: {
          apiKeysState: {
            ...reduxInitialState.apiKeysState,
            pagination: { ...reduxInitialState.apiKeysState.pagination, size: 2 },
          },
        },
      });
    });
    let rows = result!.getAllByTestId('tableApiKeys.row');
    expect(rows).toHaveLength(2);
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(`${mockApiKeysForFE.items[index].value.substring(0, 10)}...`);
    });
    expect(mock.history.get).toHaveLength(2);
    // change page
    const pageSelector = result!.getByTestId('pageSelector');
    const pageButtons = pageSelector?.querySelectorAll('button');
    // the buttons are < 1 2 >
    fireEvent.click(pageButtons[2]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
    });
    await waitFor(() => {
      rows = result!.getAllByTestId('tableApiKeys.row');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveTextContent(`${mockApiKeysForFE.items[2].value.substring(0, 10)}...`);
    });
    // change size
    const itemsPerPageSelector = await result?.findByTestId('itemsPerPageSelector');
    const button = itemsPerPageSelector?.querySelector('button');
    fireEvent.click(button!);
    const itemsPerPageList = await screen.findAllByRole('menuitem');
    fireEvent.click(itemsPerPageList[1]!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(6);
    });
    await waitFor(() => {
      rows = result!.getAllByTestId('tableApiKeys.row');
      expect(rows).toHaveLength(3);
      rows.forEach((row, index) => {
        expect(row).toHaveTextContent(`${mockApiKeysForFE.items[index].value.substring(0, 10)}...`);
      });
    });
  });
});
