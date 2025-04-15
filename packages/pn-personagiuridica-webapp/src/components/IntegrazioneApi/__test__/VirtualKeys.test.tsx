import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { formatDate, today } from '@pagopa-pn/pn-commons';
import { testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { virtualKeys } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  BffVirtualKeyStatusRequestStatusEnum,
  PublicKeysIssuerResponseIssuerStatusEnum,
  VirtualKey,
  VirtualKeyStatus,
} from '../../../generated-client/pg-apikeys';
import VirtualKeys from '../VirtualKeys';

describe('Public Keys', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component without virtual key list - with active issuer and tos accepted', () => {
    const { container, getByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys: { items: [], total: 0 },
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
            tosAccepted: true,
          },
        },
      },
    });

    expect(container).toHaveTextContent(/empty-state/i);
    const button = getByTestId('generateVirtualKey');
    expect(button).toBeInTheDocument();
  });

  it('render component without virtual key list - with inactive issuer and tos accepted', () => {
    const { container, queryByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys: { items: [], total: 0 },
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Inactive,
            },
            tosAccepted: true,
          },
        },
      },
    });

    expect(container).toHaveTextContent(/empty-state/i);
    const button = queryByTestId('generateVirtualKey');
    expect(button).not.toBeInTheDocument();
  });

  it('render component without virtual key list - without issuer and tos accepted', () => {
    const { container, queryByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys: { items: [], total: 0 },
          issuerState: {
            issuer: {
              isPresent: false,
            },
            tosAccepted: true,
          },
        },
      },
    });

    expect(container).toHaveTextContent(/empty-state/i);
    const button = queryByTestId('generateVirtualKey');
    expect(button).not.toBeInTheDocument();
  });

  it('render component without virtual key list - without tos accepted', () => {
    const { container, queryByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys: { items: [], total: 0 },
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
            tosAccepted: false,
          },
        },
      },
    });

    expect(container).toHaveTextContent(/not-enabled-empty-state/i);
    const button = queryByTestId('generateVirtualKey');
    expect(button).not.toBeInTheDocument();
  });

  it('render component without virtual key list - without issuer', () => {
    const { container, queryByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys: { items: [], total: 0 },
          issuerState: {
            issuer: {
              isPresent: false,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
            tosAccepted: true,
          },
        },
      },
    });

    expect(container).toHaveTextContent(/not-enabled-empty-state/i);
    const button = queryByTestId('generateVirtualKey');
    expect(button).not.toBeInTheDocument();
  });

  it('generate new virtual key', async () => {
    const newVirtualKey: VirtualKey = {
      id: 'key-1',
      name: `virtualKeys.default${formatDate(today.toISOString(), false, '')}`,
      value: 'string',
      lastUpdate: '2024-09-30T13:10:03.178Z',
      user: {
        denomination: 'Luca Bianchi',
        fiscalCode: 'BNCLCU89E08H501A',
      },
      status: VirtualKeyStatus.Rotated,
    };

    mock
      .onPost(`/bff/v1/pg/virtual-keys`, { name: newVirtualKey.name })
      .reply(200, { id: newVirtualKey.id, virtualKey: newVirtualKey.value });
    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, {
      total: 1,
      items: [newVirtualKey],
    });

    const { getByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys: { items: [], total: 0 },
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
            tosAccepted: true,
          },
        },
      },
    });

    const button = getByTestId('generateVirtualKey');
    fireEvent.click(button);

    // creation api call
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe(`/bff/v1/pg/virtual-keys`);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({ name: newVirtualKey.name });
    });

    // check that the modal, that shows the key value, is shown
    const dialog = await waitFor(() => getByTestId('dialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/virtualKeys.view-title/i);
    expect(dialog).toHaveTextContent(/virtualKeys.view-subtitle/i);
    await testInput(dialog, 'value', newVirtualKey.value!);
    const closeButton = within(dialog).getByTestId('close-modal-button');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveTextContent('virtualKeys.understood-button');
    fireEvent.click(closeButton);

    // list api call
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe('/bff/v1/pg/virtual-keys?showVirtualKey=true');
    });

    // check that the key was added
    const table = getByTestId('virtualKeysTableDesktop');
    const rows = within(table).getAllByTestId('virtualKeysBodyRowDesktop');
    expect(rows).toHaveLength(1);
  });

  it('render component with virtual key list and not show generate button if there is an active key', async () => {
    const { container, getByTestId, queryByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys,
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
            tosAccepted: true,
          },
        },
        userState: {
          user: { fiscal_number: virtualKeys.items[0].user?.fiscalCode },
        },
      },
    });
    expect(container).not.toHaveTextContent(/empty-state/i);

    const table = getByTestId('virtualKeysTableDesktop');
    expect(table).toBeInTheDocument();
    const button = queryByTestId('generateVirtualKey');
    expect(button).not.toBeInTheDocument();
  });

  it('check view code modal', async () => {
    const { getByTestId, getAllByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys,
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
            tosAccepted: true,
          },
        },
        userState: {
          user: { fiscal_number: virtualKeys.items[0].user?.fiscalCode },
        },
      },
    });

    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const viewCodeButton = getByTestId('buttonView');
    fireEvent.click(viewCodeButton);

    const dialog = getByTestId('dialog');
    expect(dialog).toBeInTheDocument();

    expect(dialog).toHaveTextContent(/view-title/i);
    expect(dialog).toHaveTextContent(/view-subtitle/i);
    expect(dialog).toHaveTextContent(/virtualKeys.personal-key/i);
    await testInput(dialog, 'value', virtualKeys.items[0].value!);
    const closeButton = getByTestId('close-modal-button');
    fireEvent.click(closeButton);

    expect(dialog).not.toBeInTheDocument();
  });

  it('block virtual key', async () => {
    const notBlockedKeys = virtualKeys.items.filter(
      (key) => key.status !== VirtualKeyStatus.Blocked
    );
    const enabledKeyIndex = notBlockedKeys.findIndex(
      (key) => key.status === VirtualKeyStatus.Enabled
    );

    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, {
      total: notBlockedKeys.length,
      items: notBlockedKeys.map((key, index) =>
        index === enabledKeyIndex ? { ...key, status: VirtualKeyStatus.Blocked } : key
      ),
    });
    mock
      .onPut(`/bff/v1/pg/virtual-keys/${notBlockedKeys[enabledKeyIndex].id}/status`, {
        status: BffVirtualKeyStatusRequestStatusEnum.Block,
      })
      .reply(200);

    const { getByTestId, getAllByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys: { total: notBlockedKeys.length, items: notBlockedKeys },
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
            tosAccepted: true,
          },
        },
        userState: {
          user: { fiscal_number: notBlockedKeys[enabledKeyIndex].user?.fiscalCode },
        },
      },
    });
    // only enabled key can be blocked
    const contextMenuButton = getAllByTestId('contextMenuButton')[enabledKeyIndex];
    fireEvent.click(contextMenuButton);
    const buttonBlock = getByTestId('buttonBlock');
    fireEvent.click(buttonBlock);

    const dialog = getByTestId('dialog');
    expect(dialog).toBeInTheDocument();

    expect(dialog).toHaveTextContent(/dialogs.block-title/i);
    expect(dialog).toHaveTextContent(/dialogs.block-subtitle/i);
    const confirmButton = within(dialog).getByTestId('action-modal-button');
    expect(confirmButton).toBeInTheDocument();
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
      expect(mock.history.put[0].url).toBe(
        `/bff/v1/pg/virtual-keys/${notBlockedKeys[enabledKeyIndex].id}/status`
      );
      expect(JSON.parse(mock.history.put[0].data)).toStrictEqual({
        status: BffVirtualKeyStatusRequestStatusEnum.Block,
      });
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/virtual-keys?showVirtualKey=true`);
    });

    expect(dialog).not.toBeInTheDocument();

    // check that the key has blocked status
    const table = getByTestId('virtualKeysTableDesktop');
    const rows = within(table).getAllByTestId('virtualKeysBodyRowDesktop');
    expect(rows[enabledKeyIndex]).toHaveTextContent(
      `status.${BffVirtualKeyStatusRequestStatusEnum.Block.toLowerCase()}`
    );
  });

  it('rotate virtual key', async () => {
    const notRotatedKeys = virtualKeys.items.filter(
      (key) => key.status !== VirtualKeyStatus.Rotated
    );
    const enabledKeyIndex = notRotatedKeys.findIndex(
      (key) => key.status === VirtualKeyStatus.Enabled
    );

    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, {
      total: notRotatedKeys.length,
      items: notRotatedKeys.map((key, index) =>
        index === enabledKeyIndex ? { ...key, status: VirtualKeyStatus.Rotated } : key
      ),
    });
    mock
      .onPut(`/bff/v1/pg/virtual-keys/${notRotatedKeys[enabledKeyIndex].id}/status`, {
        status: BffVirtualKeyStatusRequestStatusEnum.Rotate,
      })
      .reply(200);

    const { getByTestId, getAllByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys: { total: notRotatedKeys.length, items: notRotatedKeys },
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
            tosAccepted: true,
          },
        },
        userState: {
          user: { fiscal_number: notRotatedKeys[enabledKeyIndex].user?.fiscalCode },
        },
      },
    });
    // only enabled key can be rotated
    const contextMenuButton = getAllByTestId('contextMenuButton')[enabledKeyIndex];
    fireEvent.click(contextMenuButton);
    const buttonRotate = getByTestId('buttonRotate');
    fireEvent.click(buttonRotate);

    const dialog = getByTestId('dialog');
    expect(dialog).toBeInTheDocument();

    expect(dialog).toHaveTextContent(/dialogs.rotate-title/i);
    expect(dialog).toHaveTextContent(/dialogs.rotate-virtual-key-subtitle/i);
    expect(dialog).toHaveTextContent(/dialogs.rotate-warning/i);
    const confirmButton = within(dialog).getByTestId('action-modal-button');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toHaveTextContent('rotate-virtual-key-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
      expect(mock.history.put[0].url).toBe(
        `/bff/v1/pg/virtual-keys/${notRotatedKeys[enabledKeyIndex].id}/status`
      );
      expect(JSON.parse(mock.history.put[0].data)).toStrictEqual({
        status: BffVirtualKeyStatusRequestStatusEnum.Rotate,
      });
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/virtual-keys?showVirtualKey=true`);
    });

    expect(dialog).not.toBeInTheDocument();

    // check that the key has rotated status
    const table = getByTestId('virtualKeysTableDesktop');
    const rows = within(table).getAllByTestId('virtualKeysBodyRowDesktop');
    expect(rows[enabledKeyIndex]).toHaveTextContent(
      `status.${BffVirtualKeyStatusRequestStatusEnum.Rotate.toLowerCase()}`
    );
  });

  it('delete virtual key', async () => {
    const blockedKeyIndex = virtualKeys.items.findIndex(
      (key) => key.status === VirtualKeyStatus.Blocked
    );
    const copyOfvirtualKeys = [...virtualKeys.items];
    copyOfvirtualKeys.splice(blockedKeyIndex, 1);

    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, {
      total: virtualKeys.items.length - 1,
      items: copyOfvirtualKeys,
    });
    mock.onDelete(`/bff/v1/pg/virtual-keys/${virtualKeys.items[blockedKeyIndex].id}`).reply(200);

    const { getByTestId, getAllByTestId } = render(<VirtualKeys />, {
      preloadedState: {
        apiKeysState: {
          virtualKeys,
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
            tosAccepted: true,
          },
        },
        userState: {
          user: { fiscal_number: virtualKeys.items[blockedKeyIndex].user?.fiscalCode },
        },
      },
    });
    // only active key can be blocked
    const contextMenuButton = getAllByTestId('contextMenuButton')[blockedKeyIndex];
    fireEvent.click(contextMenuButton);

    const buttonDelete = getByTestId('buttonDelete');
    fireEvent.click(buttonDelete);

    const dialog = getByTestId('dialog');
    expect(dialog).toBeInTheDocument();

    expect(dialog).toHaveTextContent(/dialogs.delete-title/i);
    expect(dialog).toHaveTextContent(/dialogs.delete-subtitle/i);
    const confirmButton = within(dialog).getByTestId('action-modal-button');
    expect(confirmButton).toBeInTheDocument();
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
      expect(mock.history.delete[0].url).toBe(
        `/bff/v1/pg/virtual-keys/${virtualKeys.items[blockedKeyIndex].id}`
      );
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/virtual-keys?showVirtualKey=true`);
    });

    expect(dialog).not.toBeInTheDocument();

    // check that the key has blocked status
    const table = getByTestId('virtualKeysTableDesktop');
    const rows = within(table).getAllByTestId('virtualKeysBodyRowDesktop');
    expect(rows).toHaveLength(virtualKeys.items.length - 1);
  });
});
