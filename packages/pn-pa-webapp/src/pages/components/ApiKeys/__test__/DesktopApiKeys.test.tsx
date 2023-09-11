import React from 'react';

import { mockApiKeysForFE } from '../../../../__mocks__/ApiKeys.mock';
import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
  within,
} from '../../../../__test__/test-utils';
import { ModalApiKeyView } from '../../../../models/ApiKeys';
import DesktopApiKeys from '../DesktopApiKeys';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockHandleModalClick = jest.fn();

const defaultProps = {
  handleModalClick: mockHandleModalClick,
  apiKeys: mockApiKeysForFE.items,
};

describe('DesktopApiKeys component', () => {
  it('render component without API keys list', async () => {
    const { container } = render(<DesktopApiKeys {...defaultProps} apiKeys={[]} />);
    expect(container).toHaveTextContent(/empty-message/i);
  });

  it('render component with API keys list', async () => {
    const { getByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const table = getByTestId('tableApiKeys');
    expect(table).toBeInTheDocument();
    const rows = within(table).getAllByTestId('tableApiKeys.row');
    expect(rows).toHaveLength(mockApiKeysForFE.items.length);
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
    expect(mockHandleModalClick).toBeCalledTimes(1);
    expect(mockHandleModalClick).toBeCalledWith(ModalApiKeyView.VIEW, 0);
  });

  it('Check click block api key', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonBlock = await waitFor(() => screen.getByTestId('buttonBlock'));
    fireEvent.click(buttonBlock);
    expect(mockHandleModalClick).toBeCalledTimes(1);
    expect(mockHandleModalClick).toBeCalledWith(ModalApiKeyView.BLOCK, 0);
  });

  it('Check click delete api key', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[1];
    fireEvent.click(contextMenuButton);
    const buttonDelete = await waitFor(() => screen.getByTestId('buttonDelete'));
    fireEvent.click(buttonDelete);
    expect(mockHandleModalClick).toBeCalledTimes(1);
    expect(mockHandleModalClick).toBeCalledWith(ModalApiKeyView.DELETE, 1);
  });

  it('Check click enable api key', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[1];
    fireEvent.click(contextMenuButton);
    const buttonEnable = await waitFor(() => screen.getByTestId('buttonEnable'));
    fireEvent.click(buttonEnable);
    expect(mockHandleModalClick).toBeCalledTimes(1);
    expect(mockHandleModalClick).toBeCalledWith(ModalApiKeyView.ENABLE, 1);
  });

  it('Check click rotate api key', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonRotate = await waitFor(() => screen.getByTestId('buttonRotate'));
    fireEvent.click(buttonRotate);
    expect(mockHandleModalClick).toBeCalledTimes(1);
    expect(mockHandleModalClick).toBeCalledWith(ModalApiKeyView.ROTATE, 0);
  });

  it('Check click view groups id', async () => {
    const { getAllByTestId } = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = getAllByTestId('contextMenuButton')[0];
    fireEvent.click(contextMenuButton);
    const buttonViewGroupsId = await waitFor(() => screen.getByTestId('buttonViewGroupsId'));
    fireEvent.click(buttonViewGroupsId);
    expect(mockHandleModalClick).toBeCalledTimes(1);
    expect(mockHandleModalClick).toBeCalledWith(ModalApiKeyView.VIEW_GROUPS_ID, 0);
  });
});
