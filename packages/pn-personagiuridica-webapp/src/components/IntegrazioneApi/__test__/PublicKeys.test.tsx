import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { publicKeys } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  ChangeStatusPublicKeyV1StatusEnum,
  PublicKeyStatus,
  PublicKeysIssuerResponseIssuerStatusEnum,
} from '../../../generated-client/pg-apikeys';
import * as routes from '../../../navigation/routes.const';
import PublicKeys from '../PublicKeys';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const originalImplementation = await vi.importActual<any>('react-router-dom');
  return {
    ...originalImplementation,
    useNavigate: () => mockNavigateFn,
  };
});

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

  it('render component without public key list', () => {
    const { container, getByTestId } = render(<PublicKeys />, {
      preloadedState: { apiKeysState: { publicKeys: { items: [], total: 0 } } },
    });

    expect(container).toHaveTextContent(/empty-state/i);

    const button = getByTestId('generatePublicKey');
    expect(button).toBeInTheDocument();
  });

  it('generate new public key', () => {
    const { getByTestId } = render(<PublicKeys />);

    const button = getByTestId('generatePublicKey');
    fireEvent.click(button);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(`${routes.REGISTRA_CHIAVE_PUBBLICA}`);
  });

  it('render component with public key list and not show generate button if there is an active key', async () => {
    const { container, getByTestId, queryByTestId } = render(<PublicKeys />, {
      preloadedState: {
        apiKeysState: {
          publicKeys,
        },
      },
    });
    expect(container).not.toHaveTextContent(/empty-state/i);

    const table = getByTestId('publicKeysTableDesktop');
    expect(table).toBeInTheDocument();
    const button = queryByTestId('generatePublicKey');
    expect(button).not.toBeInTheDocument();
  });

  it('check view code modal', async () => {
    const { getByTestId, getAllByTestId } = render(<PublicKeys />, {
      preloadedState: {
        apiKeysState: {
          publicKeys,
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
    expect(dialog).toHaveTextContent(/publicKeys.personal-key/i);
    await testInput(dialog, 'value', publicKeys.items[0].value!);
    expect(dialog).toHaveTextContent(/publicKeys.kid/i);
    await testInput(dialog, 'kid', publicKeys.items[0].kid!);
    expect(dialog).toHaveTextContent(/publicKeys.issuer/i);
    await testInput(dialog, 'issuer', publicKeys.items[0].issuer!);
    const closeButton = getByTestId('close-modal-button');
    fireEvent.click(closeButton);

    expect(dialog).not.toBeInTheDocument();
  });

  it('block public key', async () => {
    const notBlockedKeys = publicKeys.items.filter((key) => key.status !== PublicKeyStatus.Blocked);
    const activeKeyIndex = notBlockedKeys.findIndex((key) => key.status === PublicKeyStatus.Active);

    mock.onGet('/bff/v1/pg/public-keys?showPublicKey=true').reply(200, {
      total: notBlockedKeys.length,
      items: notBlockedKeys.map((key, index) =>
        index === activeKeyIndex ? { ...key, status: PublicKeyStatus.Blocked } : key
      ),
    });
    mock
      .onPut(
        `/bff/v1/pg/public-keys/${notBlockedKeys[activeKeyIndex].kid}/status?status=${ChangeStatusPublicKeyV1StatusEnum.Block}`
      )
      .reply(200);

    const { getByTestId, getAllByTestId } = render(<PublicKeys />, {
      preloadedState: {
        apiKeysState: {
          publicKeys: { total: notBlockedKeys.length, items: notBlockedKeys },
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
            },
          },
        },
      },
    });
    // only active key can be blocked
    const contextMenuButton = getAllByTestId('contextMenuButton')[activeKeyIndex];
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
        `/bff/v1/pg/public-keys/${notBlockedKeys[activeKeyIndex].kid}/status?status=${ChangeStatusPublicKeyV1StatusEnum.Block}`
      );
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/public-keys?showPublicKey=true`);
    });

    expect(dialog).not.toBeInTheDocument();

    // check that the key has blocked status
    const table = getByTestId('publicKeysTableDesktop');
    const rows = within(table).getAllByTestId('publicKeysBodyRowDesktop');
    expect(rows[activeKeyIndex]).toHaveTextContent(
      `status.${ChangeStatusPublicKeyV1StatusEnum.Block.toLowerCase()}`
    );
  });

  it('rotate public key', async () => {
    const notRotatedKeys = publicKeys.items.filter((key) => key.status !== PublicKeyStatus.Rotated);
    const activeKeyIndex = notRotatedKeys.findIndex((key) => key.status === PublicKeyStatus.Active);

    const { getByTestId, getAllByTestId } = render(<PublicKeys />, {
      preloadedState: {
        apiKeysState: {
          publicKeys: { total: notRotatedKeys.length, items: notRotatedKeys },
        },
      },
    });
    // only active key can be rotated
    const contextMenuButton = getAllByTestId('contextMenuButton')[activeKeyIndex];
    fireEvent.click(contextMenuButton);
    const buttonRotate = getByTestId('buttonRotate');
    fireEvent.click(buttonRotate);

    const dialog = getByTestId('dialog');
    expect(dialog).toBeInTheDocument();

    expect(dialog).toHaveTextContent(/dialogs.rotate-title/i);
    expect(dialog).toHaveTextContent(/dialogs.rotate-public-key-subtitle/i);
    expect(dialog).toHaveTextContent(/dialogs.rotate-warning/i);
    const confirmButton = within(dialog).getByTestId('action-modal-button');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toHaveTextContent('rotate-public-key-button');
    fireEvent.click(confirmButton);

    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(
      `${routes.REGISTRA_CHIAVE_PUBBLICA}/${notRotatedKeys[activeKeyIndex].kid}`
    );
  });

  it('delete public key', async () => {
    const blockedKeyIndex = publicKeys.items.findIndex(
      (key) => key.status === PublicKeyStatus.Blocked
    );
    const copyOfpublicKeys = [...publicKeys.items];
    copyOfpublicKeys.splice(blockedKeyIndex, 1);

    mock.onGet('/bff/v1/pg/public-keys?showPublicKey=true').reply(200, {
      total: publicKeys.items.length - 1,
      items: copyOfpublicKeys,
    });
    mock.onDelete(`/bff/v1/pg/public-keys/${publicKeys.items[blockedKeyIndex].kid}`).reply(200);

    const { getByTestId, getAllByTestId } = render(<PublicKeys />, {
      preloadedState: {
        apiKeysState: {
          publicKeys,
          issuerState: {
            issuer: {
              isPresent: true,
              issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Inactive,
            },
          },
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
        `/bff/v1/pg/public-keys/${publicKeys.items[blockedKeyIndex].kid}`
      );
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(`/bff/v1/pg/public-keys?showPublicKey=true`);
    });

    expect(dialog).not.toBeInTheDocument();

    // check that the key has blocked status
    const table = getByTestId('publicKeysTableDesktop');
    const rows = within(table).getAllByTestId('publicKeysBodyRowDesktop');
    expect(rows).toHaveLength(publicKeys.items.length - 1);
  });
});
