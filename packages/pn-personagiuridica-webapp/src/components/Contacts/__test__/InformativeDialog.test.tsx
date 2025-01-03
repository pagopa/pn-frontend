import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import InformativeDialog from '../InformativeDialog';

describe('InformativeDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    content: 'Test Content',
    onConfirm: vi.fn(),
    onDiscard: vi.fn(),
  };

  it('should renders the dialog when open', () => {
    const { getByTestId, getByText } = render(<InformativeDialog {...defaultProps} />);
    expect(getByTestId('informativeDialog')).toBeInTheDocument();
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Subtitle')).toBeInTheDocument();
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should not render the dialog when closed', () => {
    const { queryByTestId } = render(<InformativeDialog {...defaultProps} open={false} />);
    expect(queryByTestId('informativeDialog')).not.toBeInTheDocument();
  });

  it('should calls onDiscard when the cancel button is clicked', () => {
    const { getByTestId } = render(<InformativeDialog {...defaultProps} />);
    fireEvent.click(getByTestId('discardButton'));
    expect(defaultProps.onDiscard).toHaveBeenCalledTimes(1);
  });

  it('should calls onConfirm when the understand button is clicked', () => {
    const { getByTestId } = render(<InformativeDialog {...defaultProps} />);
    fireEvent.click(getByTestId('understandButton'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });
});
