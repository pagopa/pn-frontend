import { vi } from 'vitest';

import { fireEvent, render, within } from '../../../__test__/test-utils';
import ApiKeyModal, { ApiKeyModalProps } from '../ApiKeyModal';

const closeModalFn = vi.fn();
const actionModalFn = vi.fn();

const defaultProps: ApiKeyModalProps = {
  title: 'mock-title',
  subTitle: 'mock-subtitle',
  content: <p>mocked-content</p>,
  closeButtonLabel: 'mock-close',
  closeModalHandler: closeModalFn,
  actionButtonLabel: 'mock-action',
  actionHandler: actionModalFn,
};

describe('Api Key Modal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('render component', () => {
    const { getByTestId } = render(<ApiKeyModal {...defaultProps} />);
    const dialog = getByTestId('dialog');
    expect(dialog).toHaveTextContent('mock-title');
    expect(dialog).toHaveTextContent('mocked-content');
    const subtitle = within(dialog).getByTestId('subtitle-top');
    expect(subtitle).toBeInTheDocument();
    const actionButton = within(dialog).getByTestId('action-modal-button');
    expect(actionButton).toBeInTheDocument();
  });

  it('render component without content', () => {
    const { getByTestId } = render(<ApiKeyModal {...defaultProps} content={null} />);
    const dialog = getByTestId('dialog');
    expect(dialog).not.toHaveTextContent('mocked-content');
  });

  it('render component without action', () => {
    const { getByTestId } = render(<ApiKeyModal {...defaultProps} actionButtonLabel={undefined} />);
    const dialog = getByTestId('dialog');
    const actionButton = within(dialog).queryByTestId('action-modal-button');
    expect(actionButton).not.toBeInTheDocument();
  });

  it('render component and click close button', () => {
    const { getByTestId } = render(<ApiKeyModal {...defaultProps} />);
    const dialog = getByTestId('dialog');
    const closeButton = within(dialog).getByTestId('close-modal-button');
    fireEvent.click(closeButton);
    expect(closeModalFn).toHaveBeenCalledTimes(1);
  });

  it('render component and click action button', () => {
    const { getByTestId } = render(<ApiKeyModal {...defaultProps} />);
    const dialog = getByTestId('dialog');
    expect(dialog).toHaveTextContent('mock-title');
    const actionButton = within(dialog).getByTestId('action-modal-button');
    fireEvent.click(actionButton);
    expect(actionModalFn).toHaveBeenCalledTimes(1);
  });
});
