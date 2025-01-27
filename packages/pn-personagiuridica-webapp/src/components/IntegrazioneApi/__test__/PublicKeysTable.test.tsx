import { vi } from 'vitest';

import { publicKeys } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { PublicKeyStatus } from '../../../generated-client/pg-apikeys';
import { ModalApiKeyView } from '../../../models/ApiKeys';
import PublicKeysTable from '../PublicKeysTable';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockHandleModalClick = vi.fn();

const defaultProps = {
  publicKeys,
  handleModalClick: mockHandleModalClick,
};

describe('Public Keys Table', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('show empty state if no public keys is empty', () => {
    const { container, queryByTestId } = render(
      <PublicKeysTable
        {...defaultProps}
        publicKeys={{
          items: [],
          total: 0,
        }}
      />
    );
    expect(container).toHaveTextContent(/empty-state/i);
    const table = queryByTestId('publicKeysTableDesktop');
    expect(table).not.toBeInTheDocument();
  });

  it('render component with public keys list', async () => {
    const { getByTestId } = render(<PublicKeysTable {...defaultProps} />);
    const table = getByTestId('publicKeysTableDesktop');
    expect(table).toBeInTheDocument();
    const rows = within(table).getAllByTestId('publicKeysBodyRowDesktop');
    expect(rows).toHaveLength(publicKeys.items.length);
  });

  it('Check menu item', async () => {
    const { getAllByTestId } = render(<PublicKeysTable {...defaultProps} />);
    const contextComponent = getAllByTestId('contextMenu')[0];
    expect(contextComponent).toBeInTheDocument();
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const contextMenu = await waitFor(() => screen.getByTestId('menuContext'));
    expect(contextMenu).toBeInTheDocument();
  });

  it('Check click view public key', async () => {
    const { getAllByTestId } = render(<PublicKeysTable {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonView = await waitFor(() => screen.getByTestId('buttonView'));
    fireEvent.click(buttonView);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(
      ModalApiKeyView.VIEW,
      publicKeys.items[0].kid
    );
  });

  it('Check click rotate public key', async () => {
    const activeData = {
      ...defaultProps.publicKeys.items[0],
      status: PublicKeyStatus.Active,
    };
    const { getAllByTestId } = render(
      <PublicKeysTable {...defaultProps} publicKeys={{ ...publicKeys, items: [activeData] }} />
    );
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonRotate = await waitFor(() => screen.getByTestId('buttonRotate'));
    fireEvent.click(buttonRotate);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(
      ModalApiKeyView.ROTATE,
      publicKeys.items[0].kid
    );
  });

  it('Check click block api key', async () => {
    // ensure that there is no blocked key already
    const keys = {
      ...defaultProps.publicKeys,
      items: [
        {
          ...defaultProps.publicKeys.items[0],
          status: PublicKeyStatus.Active,
        },
      ],
    };

    const { getAllByTestId } = render(<PublicKeysTable {...defaultProps} publicKeys={keys} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonBlock = await waitFor(() => screen.getByTestId('buttonBlock'));
    fireEvent.click(buttonBlock);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(
      ModalApiKeyView.BLOCK,
      publicKeys.items[0].kid
    );
  });

  it('Check click delete public key', async () => {
    const { getAllByTestId } = render(<PublicKeysTable {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonDelete = await waitFor(() => screen.getByTestId('buttonDelete'));
    fireEvent.click(buttonDelete);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(
      ModalApiKeyView.DELETE,
      publicKeys.items[0].kid
    );
  });
});
