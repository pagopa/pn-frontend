import React from 'react';

import { mockApiKeysForFE } from '../../../../redux/apiKeys/__test__/test-utils';
import { fireEvent, render, waitFor, screen } from '../../../../__test__/test-utils';
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
  apiKeys: mockApiKeysForFE,
};

describe('DesktopApiKeys component', () => {
  it('render component without API keys list', async () => {
    const result = render(<DesktopApiKeys {...defaultProps} apiKeys={[]} />);
    expect(result.container).toHaveTextContent(/empty-message/i);
  });

  it('render component with API keys list', async () => {
    const result = render(<DesktopApiKeys {...defaultProps} />);
    expect(result.container).toHaveTextContent(/last-update/i);
  });

  it('Check context menu', async () => {
    const result = render(<DesktopApiKeys {...defaultProps} />);
    const contextComponent = result.getAllByTestId('contextMenu')[0];
    expect(contextComponent).toBeInTheDocument();
    const contextMenuButton = result.getAllByTestId('contextMenuButton')[0];
    expect(contextMenuButton).toBeInTheDocument();
    await waitFor(() => fireEvent.click(contextMenuButton));
    const contextMenu = screen.getByTestId('menuContext');
    expect(contextMenu).toBeInTheDocument();
  });

  it('Check click view api key', async () => {
    const result = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = result.getAllByTestId('contextMenuButton')[0];
    await waitFor(() => fireEvent.click(contextMenuButton));
    const viewButton = screen.getByTestId('buttonView');
    await waitFor(() => fireEvent.click(viewButton));
    expect(mockHandleModalClick).toBeCalledTimes(1);
  });

  it('Check click block api key', async () => {
    const result = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = result.getAllByTestId('contextMenuButton')[0];
    await waitFor(() => fireEvent.click(contextMenuButton));
    const viewButton = screen.getByTestId('buttonBlock');
    await waitFor(() => fireEvent.click(viewButton));
    expect(mockHandleModalClick).toBeCalledTimes(1);
  });

  it('Check click delete api key', async () => {
    const result = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = result.getAllByTestId('contextMenuButton')[1];
    await waitFor(() => fireEvent.click(contextMenuButton));
    const viewButton = screen.getByTestId('buttonDelete');
    await waitFor(() => fireEvent.click(viewButton));
    expect(mockHandleModalClick).toBeCalledTimes(1);
  });

  it('Check click enable api key', async () => {
    const result = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = result.getAllByTestId('contextMenuButton')[1];
    await waitFor(() => fireEvent.click(contextMenuButton));
    const viewButton = screen.getByTestId('buttonEnable');
    await waitFor(() => fireEvent.click(viewButton));
    expect(mockHandleModalClick).toBeCalledTimes(1);
  });

  it('Check click rotate api key', async () => {
    const result = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = result.getAllByTestId('contextMenuButton')[0];
    await waitFor(() => fireEvent.click(contextMenuButton));
    const viewButton = screen.getByTestId('buttonRotate');
    await waitFor(() => fireEvent.click(viewButton));
    expect(mockHandleModalClick).toBeCalledTimes(1);
  });

  it('Check click view groups id', async () => {
    const result = render(<DesktopApiKeys {...defaultProps} />);
    const contextMenuButton = result.getAllByTestId('contextMenuButton')[0];
    await waitFor(() => fireEvent.click(contextMenuButton));
    const viewButton = screen.getByTestId('buttonViewGroupsId');
    await waitFor(() => fireEvent.click(viewButton));
    expect(mockHandleModalClick).toBeCalledTimes(1);
  });
});
