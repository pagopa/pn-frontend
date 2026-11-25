import { vi } from 'vitest';

import { IllusMIDataSecurity } from '@pagopa/mui-italia';

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

  it('allows long unbroken text to wrap within its container', () => {
    const { getByTestId } = render(<EmptyErrorState title={'a'.repeat(200)} />);

    const wrapper = getByTestId('emptyState').parentElement;
    expect(wrapper).not.toBeNull();
    expect(getComputedStyle(wrapper!).overflowWrap).toBe('anywhere');
    expect(getComputedStyle(wrapper!).wordBreak).toBe('break-word');
    expect(getComputedStyle(wrapper!).minWidth).toBe('0px');
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

  it('renders a custom icon', () => {
    const { getByText, getByTitle } = render(
      <EmptyErrorState
        variant="empty"
        title="Error state"
        icon={<IllusMIDataSecurity size={56} />}
      />
    );

    expect(getByText('Error state')).toBeInTheDocument();
    expect(getByTitle('MIDataSecurity')).toBeInTheDocument();
  });
});
