import { vi } from 'vitest';

import { mockApiKeysDTO } from '../../../__mocks__/ApiKeys.mock';
import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { ModalApiKeyView } from '../../../models/ApiKeys';
import * as routes from '../../../navigation/routes.const';
import DesktopApiKeys from '../DesktopApiKeys';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

const mockHandleModalClick = vi.fn();

const defaultProps = {
  handleModalClick: mockHandleModalClick,
  apiKeys: mockApiKeysDTO.items,
};

describe('DesktopApiKeys component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('render component without API keys list', async () => {
    const { container, getByTestId } = render(<DesktopApiKeys {...defaultProps} apiKeys={[]} />);
    expect(container).toHaveTextContent(/empty-message/i);
    // clicks on empty state action
    const button = getByTestId('link-new-api-key');
    fireEvent.click(button);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.NUOVA_API_KEY);
  });

  it('render component with API keys list', async () => {
    const { getByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const table = getByTestId('tableApiKeys');
    expect(table).toBeInTheDocument();
    const rows = within(table).getAllByTestId('tableApiKeys.body.row');
    expect(rows).toHaveLength(mockApiKeysDTO.items.length);
  });

  it('Check context menu', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextComponent = getAllByTestId('contextMenu')[0];
    expect(contextComponent).toBeInTheDocument();
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    expect(contextMenuButton).toBeInTheDocument();
    fireEvent.click(contextMenuButton);
    const contextMenu = await waitFor(() => screen.getByTestId('menuContext'));
    expect(contextMenu).toBeInTheDocument();
  });

  it('Check click view api key', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonView = await waitFor(() => screen.getByTestId('buttonView'));
    fireEvent.click(buttonView);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(ModalApiKeyView.VIEW, 0);
  });

  it('Check click block api key', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonBlock = await waitFor(() => screen.getByTestId('buttonBlock'));
    fireEvent.click(buttonBlock);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(ModalApiKeyView.BLOCK, 0);
  });

  it('Check click delete api key', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[1];
    fireEvent.click(contextMenuButton);
    const buttonDelete = await waitFor(() => screen.getByTestId('buttonDelete'));
    fireEvent.click(buttonDelete);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(ModalApiKeyView.DELETE, 1);
  });

  it('Check click enable api key', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[1];
    fireEvent.click(contextMenuButton);
    const buttonEnable = await waitFor(() => screen.getByTestId('buttonEnable'));
    fireEvent.click(buttonEnable);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(ModalApiKeyView.ENABLE, 1);
  });

  it('Check click rotate api key', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonRotate = await waitFor(() => screen.getByTestId('buttonRotate'));
    fireEvent.click(buttonRotate);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(ModalApiKeyView.ROTATE, 0);
  });

  it('Check click view groups id', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonViewGroupsId = await waitFor(() => screen.getByTestId('buttonViewGroupsId'));
    fireEvent.click(buttonViewGroupsId);
    expect(mockHandleModalClick).toHaveBeenCalledTimes(1);
    expect(mockHandleModalClick).toHaveBeenCalledWith(ModalApiKeyView.VIEW_GROUPS_ID, 0);
  });
});
