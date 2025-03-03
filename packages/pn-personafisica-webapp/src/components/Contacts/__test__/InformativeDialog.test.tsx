import { vi } from 'vitest';

import { TypographyProps } from '@mui/material/Typography';

import { fireEvent, render } from '../../../__test__/test-utils';
import InformativeDialog from '../InformativeDialog';

describe('InformativeDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    onConfirm: vi.fn(),
    onDiscard: vi.fn(),
  };

  it('should renders the dialog when open', () => {
    const { getByTestId, getByText } = render(<InformativeDialog {...defaultProps} />);
    expect(getByTestId('informativeDialog')).toBeInTheDocument();
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should not render the dialog when closed', () => {
    const { queryByTestId } = render(<InformativeDialog {...defaultProps} open={false} />);
    expect(queryByTestId('informativeDialog')).not.toBeInTheDocument();
  });

  it('should renders optional content when provided', () => {
    const content = 'Optional Content';
    const { getByText } = render(<InformativeDialog {...defaultProps} content={content} />);
    expect(getByText(content)).toBeInTheDocument();
  });

  it('should applies custom content styles via slotProps', () => {
    const contentProps: TypographyProps = {
      color: 'text.secondary',
      fontSize: '16px',
    };
    const { getByText } = render(
      <InformativeDialog {...defaultProps} content="Styled Content" slotProps={{ contentProps }} />
    );
    const contentElement = getByText('Styled Content');
    expect(contentElement).toHaveStyle('color: rgba(0, 0, 0, 0.6)');
    expect(contentElement).toHaveStyle('font-size: 16px');
  });

  it('should renders the illustration when provided', () => {
    const illustration = <img alt="Test Illustration" src="x.jpg" data-testid="illus" />;
    const { getByTestId } = render(
      <InformativeDialog {...defaultProps} illustration={illustration} />
    );
    expect(getByTestId('illus')).toBeInTheDocument();
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
