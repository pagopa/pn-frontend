import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import NotificationsEmptyState, {
  NotificationsGenericErrorState,
} from '../NotificationsEmptyState';

describe('NotificationsEmptyState Component', () => {
  it('renders component - no notification after filter', () => {
    const onCleanFilters = vi.fn();
    const result = render(
      <NotificationsEmptyState
        filtersApplied
        hasTimeoutError={false}
        onCleanFilters={onCleanFilters}
        onApiKeys={() => {}}
        onManualSend={() => {}}
        onRetry={() => {}}
      />
    );

    expect(result.container).toHaveTextContent(/empty-state.filtered/i);
    expect(result.container).toHaveTextContent(/empty-state.filtered-description/i);

    const button = result.getByTestId('link-remove-filters');
    fireEvent.click(button);
    expect(onCleanFilters).toHaveBeenCalledTimes(1);
  });

  it('renders component - no notification', () => {
    const onApiKeys = vi.fn();
    const onManualSend = vi.fn();
    const result = render(
      <NotificationsEmptyState
        filtersApplied={false}
        hasTimeoutError={false}
        onCleanFilters={() => {}}
        onApiKeys={onApiKeys}
        onManualSend={onManualSend}
        onRetry={() => {}}
      />
    );

    expect(result.container).toHaveTextContent(/empty-state.no-notifications/i);

    const apiKeysLink = result.getByTestId('link-api-keys');
    fireEvent.click(apiKeysLink);
    expect(onApiKeys).toHaveBeenCalledTimes(1);

    const createNotificationLink = result.getByTestId('link-create-notification');
    fireEvent.click(createNotificationLink);
    expect(onManualSend).toHaveBeenCalledTimes(1);
  });

  it('renders component - timeout error', () => {
    const onRetry = vi.fn();
    const result = render(
      <NotificationsEmptyState
        filtersApplied={false}
        hasTimeoutError
        onCleanFilters={() => {}}
        onApiKeys={() => {}}
        onManualSend={() => {}}
        onRetry={onRetry}
      />
    );

    expect(result.container).toHaveTextContent(/empty-state.timeout/i);
    expect(result.queryByTestId('link-api-keys')).not.toBeInTheDocument();
    expect(result.queryByTestId('link-create-notification')).not.toBeInTheDocument();
    expect(onRetry).toHaveBeenCalledTimes(0);

    fireEvent.click(result.getByTestId('link-retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders generic error and retries', () => {
    const onRetry = vi.fn();

    const result = render(<NotificationsGenericErrorState onRetry={onRetry} />);

    expect(result.container).toHaveTextContent(/empty-state.generic-error/i);

    fireEvent.click(result.getByTestId('link-retry'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
