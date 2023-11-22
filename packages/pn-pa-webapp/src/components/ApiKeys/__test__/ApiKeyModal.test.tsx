import React from 'react';
import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
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

describe('ApiKeyModal component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('render component', () => {
    const { container, queryByTestId } = render(<ApiKeyModal {...defaultProps} />);
    expect(container).toHaveTextContent('mock-title');
    expect(container).toHaveTextContent('mocked-content');
    expect(queryByTestId('subtitle-top')).toBeInTheDocument();
    expect(queryByTestId('subtitle-bottom')).not.toBeInTheDocument();
  });

  it('render component with subtitle at bottom', () => {
    const { container, queryByTestId } = render(<ApiKeyModal {...defaultProps} subTitleAtBottom />);
    expect(container).toHaveTextContent('mock-title');
    expect(container).toHaveTextContent('mocked-content');
    expect(queryByTestId('subtitle-top')).not.toBeInTheDocument();
    expect(queryByTestId('subtitle-bottom')).toBeInTheDocument();
  });

  it('render component and click close button', () => {
    const { container, getByTestId } = render(<ApiKeyModal {...defaultProps} />);
    expect(container).toHaveTextContent('mock-title');
    const closeButton = getByTestId('close-modal-button');
    fireEvent.click(closeButton);
    expect(closeModalFn).toBeCalledTimes(1);
  });

  it('render component and click action button', () => {
    const { container, getByTestId } = render(<ApiKeyModal {...defaultProps} />);
    expect(container).toHaveTextContent('mock-title');
    const actionButton = getByTestId('action-modal-button');
    fireEvent.click(actionButton);
    expect(actionModalFn).toBeCalledTimes(1);
  });
});
