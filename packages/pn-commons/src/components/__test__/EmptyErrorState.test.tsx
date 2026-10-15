import { vi } from 'vitest';

import { fireEvent, render } from '../../test-utils';
import EmptyErrorState from '../EmptyErrorState';

describe('EmptyErrorState', () => {
  it('renders the empty state by default', () => {
    const { getByText, getByTitle } = render(<EmptyErrorState title="Empty state" />);

    expect(getByText('Empty state')).toBeInTheDocument();
    expect(getByTitle('MIMessage')).toBeInTheDocument();
  });

  it('renders the error state', () => {
    const { getByText, getByTitle } = render(
      <EmptyErrorState variant="error" title="Error state" />
    );

    expect(getByText('Error state')).toBeInTheDocument();
    expect(getByTitle('MIError')).toBeInTheDocument();
  });

  it('renders the description', () => {
    const { getByText } = render(
      <EmptyErrorState title="Empty state" description="Empty state description" />
    );

    expect(getByText('Empty state description')).toBeInTheDocument();
  });

  it('renders the default action and handles the click', () => {
    const onClick = vi.fn();

    const { getByRole } = render(
      <EmptyErrorState
        title="Error state"
        action={{
          label: 'Retry',
          onClick,
        }}
      />
    );

    fireEvent.click(getByRole('button', { name: 'Retry' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a custom action', () => {
    const { getByRole } = render(
      <EmptyErrorState title="Error state" action={<button type="button">Custom action</button>} />
    );

    expect(getByRole('button', { name: 'Custom action' })).toBeInTheDocument();
  });
});
