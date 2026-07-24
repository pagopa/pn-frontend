import { vi } from 'vitest';

import {
  notificationDTO,
  notificationDTOMultiRecipient,
} from '../../../__mocks__/NotificationDetail.mock';
import { render } from '../../../__test__/test-utils';
import { PNRole } from '../../../models/user';
import NotificationCancellationAction from '../NotificationCancellationAction';

const mockCancelHandler = vi.fn();

describe('NotificationCancellationAction Component', () => {
  it('renders component - one recipient', () => {
    // render component
    const { getByTestId } = render(
      <NotificationCancellationAction
        notification={notificationDTO}
        onCancelNotification={mockCancelHandler}
      />
    );

    const cancelNotificationBtn = getByTestId('cancelNotificationBtn');
    expect(cancelNotificationBtn).toBeInTheDocument();
  });

  it('renders component - multi recipient', () => {
    const { getByTestId } = render(
      <NotificationCancellationAction
        notification={notificationDTOMultiRecipient}
        onCancelNotification={mockCancelHandler}
      />
    );

    const cancelNotificationBtn = getByTestId('cancelNotificationBtn');
    expect(cancelNotificationBtn).toBeInTheDocument();
  });

  it('renders component - no cancel notification button with operator role', () => {
    // render component
    const { queryByTestId } = render(
      <NotificationCancellationAction
        notification={notificationDTO}
        onCancelNotification={mockCancelHandler}
      />,
      {
        preloadedState: {
          userState: {
            user: {
              organization: {
                roles: [{ role: PNRole.OPERATOR }],
              },
            },
          },
        },
      }
    );
    const cancelNotificationBtn = queryByTestId('cancelNotificationBtn');
    expect(cancelNotificationBtn).not.toBeInTheDocument();
  });

  it('renders component - no cancel notification button with support role', () => {
    const { queryByTestId } = render(
      <NotificationCancellationAction
        notification={notificationDTO}
        onCancelNotification={mockCancelHandler}
      />,
      {
        preloadedState: {
          userState: {
            user: {
              organization: {
                roles: [{ role: PNRole.SUPPORT }],
              },
            },
          },
        },
      }
    );
    const cancelNotificationBtn = queryByTestId('cancelNotificationBtn');
    expect(cancelNotificationBtn).not.toBeInTheDocument();
  });
});
