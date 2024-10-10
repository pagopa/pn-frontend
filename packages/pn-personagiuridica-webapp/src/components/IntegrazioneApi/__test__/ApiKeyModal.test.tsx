import { vi } from 'vitest';

import { fireEvent, render, screen } from '../../../__test__/test-utils';
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
    const { queryByTestId } = render(<ApiKeyModal {...defaultProps} />);
    const dialog = screen.getByTestId('dialog');
    expect(dialog).toHaveTextContent('mock-title');
    expect(dialog).toHaveTextContent('mocked-content');
    expect(queryByTestId('subtitle-top')).toBeInTheDocument();
    expect(queryByTestId('subtitle-bottom')).not.toBeInTheDocument();
  });

  it('render component and click close button', () => {
    const { getByTestId } = render(<ApiKeyModal {...defaultProps} />);
    const dialog = screen.getByTestId('dialog');
    expect(dialog).toHaveTextContent('mock-title');
    const closeButton = getByTestId('close-modal-button');
    fireEvent.click(closeButton);
    expect(closeModalFn).toBeCalledTimes(1);
  });

  it('render component and click action button', () => {
    const { getByTestId } = render(<ApiKeyModal {...defaultProps} />);
    const dialog = screen.getByTestId('dialog');
    expect(dialog).toHaveTextContent('mock-title');
    const actionButton = getByTestId('action-modal-button');
    fireEvent.click(actionButton);
    expect(actionModalFn).toBeCalledTimes(1);
  });
});
