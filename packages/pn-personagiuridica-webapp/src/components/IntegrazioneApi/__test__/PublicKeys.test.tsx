import { vi } from 'vitest';

import { publicKeys } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { PublicKeyStatus } from '../../../generated-client/pg-apikeys';
import PublicKeys from '../PublicKeys';

describe('Public Keys', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('render component without public key list', async () => {
    const { container, getByTestId } = render(<PublicKeys />);
    expect(container).toHaveTextContent(/empty-state/i);

    const button = getByTestId('generatePublicKey');
    expect(button).toBeInTheDocument();
  });

  it('render component with public key list and not show button if there is an active key', async () => {
    const keys = {
      ...publicKeys,
      items: [
        {
          ...publicKeys.items[0],
          status: PublicKeyStatus.Active,
        },
      ],
    };

    const { container, getByTestId, queryByTestId } = render(<PublicKeys />, {
      preloadedState: {
        apiKeysState: {
          publicKeys: keys,
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

    const closeButton = getByTestId('close-modal-button');
    fireEvent.click(closeButton);

    expect(dialog).not.toBeInTheDocument();
  });
});
