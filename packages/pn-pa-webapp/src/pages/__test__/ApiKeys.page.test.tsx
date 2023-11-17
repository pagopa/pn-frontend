import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { mockApiKeysDTO, mockApiKeysForFE, mockGroups } from '../../__mocks__/ApiKeys.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../__test__/test-utils';
import { getApiClient } from '../../api/apiClients';
import { APIKEY_LIST, DELETE_APIKEY, STATUS_APIKEY } from '../../api/apiKeys/apiKeys.routes';
import { GET_USER_GROUPS } from '../../api/notifications/notifications.routes';
import { ApiKeySetStatus, ApiKeyStatus } from '../../models/ApiKeys';
import * as routes from '../../navigation/routes.const';
import ApiKeys from '../ApiKeys.page';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')) as any,
  useNavigate: () => mockNavigateFn,
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
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

async function testApiKeyChangeStatus(
  mock: MockAdapter,
  apiKeyIndex: number,
  statusRequested: ApiKeyStatus,
  statusSetted: ApiKeySetStatus,
  result: RenderResult,
  buttonTestId: string
) {
  mock
    .onPut(STATUS_APIKEY(mockApiKeysForFE.items[apiKeyIndex].id), { status: statusRequested })
    .reply(200);
  const contextMenuButton = result.getAllByTestId('contextMenuButton')[apiKeyIndex];
  fireEvent.click(contextMenuButton);
  const actionButton = await waitFor(() => screen.getByTestId(buttonTestId));
  fireEvent.click(actionButton);
  const dialog = await waitFor(() => screen.getByRole('dialog'));
  const confirmButton = within(dialog).getByTestId('action-modal-button');
  fireEvent.click(confirmButton);
  await waitFor(() => {
    expect(mock.history.put).toHaveLength(1);
    expect(mock.history.put[0].url).toBe(STATUS_APIKEY(mockApiKeysForFE.items[apiKeyIndex].id));
    expect(JSON.parse(mock.history.put[0].data)).toStrictEqual({ status: statusSetted });
    expect(mock.history.get).toHaveLength(2);
  });
  await waitFor(() => {
    expect(dialog).not.toBeInTheDocument();
  });
}

describe('ApiKeys Page', () => {
  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders the page', async () => {
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(200, mockApiKeysDTO);
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
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(200, mockApiKeysDTO);
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
    mock
      .onGet(APIKEY_LIST({ limit: 10 }))
      .reply(200, { ...mockApiKeysDTO, items: mockApiKeysDTO.items.slice(0, 2) });
    mock
      .onGet(
        APIKEY_LIST({
          limit: 10,
          lastKey: mockApiKeysDTO.lastKey,
          lastUpdate: mockApiKeysDTO.lastUpdate,
        })
      )
      .reply(200, { ...mockApiKeysDTO, items: mockApiKeysDTO.items.slice(2) });
    mock.onGet(APIKEY_LIST({ limit: 20 })).reply(200, mockApiKeysDTO);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />, {
        preloadedState: reduxInitialState,
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
    const itemsPerPageSelector = result?.getByTestId('itemsPerPageSelector');
    const button = itemsPerPageSelector?.querySelector('button');
    fireEvent.click(button!);
    const itemsPerPageList = screen.getAllByRole('menuitem');
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

  it('block apiKey', async () => {
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(200, mockApiKeysDTO);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />);
    });
    await testApiKeyChangeStatus(
      mock,
      0,
      ApiKeyStatus.BLOCKED,
      ApiKeySetStatus.BLOCK,
      result!,
      'buttonBlock'
    );
  });

  it('enable apiKey', async () => {
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(200, mockApiKeysDTO);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />);
    });
    await testApiKeyChangeStatus(
      mock,
      1,
      ApiKeyStatus.ENABLED,
      ApiKeySetStatus.ENABLE,
      result!,
      'buttonEnable'
    );
  });

  it('rotate apiKey', async () => {
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(200, mockApiKeysDTO);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />);
    });
    await testApiKeyChangeStatus(
      mock,
      0,
      ApiKeyStatus.ROTATED,
      ApiKeySetStatus.ROTATE,
      result!,
      'buttonRotate'
    );
  });

  it('delete apiKey', async () => {
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(200, mockApiKeysDTO);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />);
    });
    mock.onDelete(DELETE_APIKEY(mockApiKeysForFE.items[1].id)).reply(200);
    const contextMenuButton = result!.getAllByTestId('contextMenuButton')[1];
    fireEvent.click(contextMenuButton);
    const actionButton = await waitFor(() => screen.getByTestId('buttonDelete'));
    fireEvent.click(actionButton);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    const confirmButton = within(dialog).getByTestId('action-modal-button');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
      expect(mock.history.delete[0].url).toBe(DELETE_APIKEY(mockApiKeysForFE.items[1].id));
      expect(mock.history.get).toHaveLength(2);
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('api return error', async () => {
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(500);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <ApiKeys />
        </>
      );
    });
    expect(result?.container).toHaveTextContent('error-fecth-api-keys');
  });
});
