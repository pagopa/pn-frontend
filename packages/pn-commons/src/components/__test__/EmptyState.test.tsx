import { vi } from 'vitest';

import BalconyIcon from '@mui/icons-material/Balcony';
import { Button } from '@mui/material';

import { KnownSentiment } from '../../models/EmptyState';
import { fireEvent, render } from '../../test-utils';
import EmptyState from '../EmptyState';

describe('EmptyState component', () => {
  const mockAction = vi.fn(); // it creates a dummy functions

  it('render component with default icon and a button cta', async () => {
    const { container, getByTestId } = render(
      <EmptyState>
        empty-state-message{' '}
        <Button data-testid="emptyStateButton" onClick={mockAction}>
          empty-state-button
        </Button>
      </EmptyState>
    );
    expect(container).toHaveTextContent('empty-state-message empty-state-button');
    const button = getByTestId('emptyStateButton');
    const sadIcon = getByTestId('SentimentDissatisfiedIcon');
    expect(sadIcon).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockAction).toBeCalledTimes(1);
  });

  it('renders with happy face icon', () => {
    const { getByTestId } = render(<EmptyState sentimentIcon={KnownSentiment.SATISFIED} />);
    const icon = getByTestId('InsertEmoticonIcon');
    expect(icon).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const { getByTestId, queryByTestId } = render(<EmptyState sentimentIcon={BalconyIcon} />);
    const sadIcon = queryByTestId('SentimentDissatisfiedIcon');
    const happyIcon = queryByTestId('InsertEmoticonIcon');
    const customIcon = getByTestId('BalconyIcon');
    expect(sadIcon).not.toBeInTheDocument();
    expect(happyIcon).not.toBeInTheDocument();
    expect(customIcon).toBeInTheDocument();
  });
});
