import { vi } from 'vitest';

import {
  notificationDTO,
  notificationDTOMultiRecipient,
} from '../../../__mocks__/NotificationDetail.mock';
import { render } from '../../../__test__/test-utils';
import { PNRole } from '../../../models/user';
import NotificationDetailTableSender from '../NotificationDetailTableSender';

const mockCancelHandler = vi.fn();

describe('NotificationDetailTableSender Component', () => {
  it('renders component - one recipient', () => {
    // render component
    const { getByTestId, getAllByTestId } = render(
      <NotificationDetailTableSender
        notification={notificationDTO}
        onCancelNotification={mockCancelHandler}
      />
    );
    const detailTable = getByTestId('detailTable');
    expect(detailTable).toBeInTheDocument();
    const cancelNotificationBtn = getByTestId('cancelNotificationBtn');
    expect(cancelNotificationBtn).toBeInTheDocument();
    const recipientRow = getByTestId('recipientRow');
    expect(recipientRow).toHaveTextContent(notificationDTO.recipients[0].denomination);
    const recipientsRow = getAllByTestId('recipients');
    expect(recipientsRow).toHaveLength(1);
    expect(recipientsRow[0]).toHaveTextContent(notificationDTO.recipients[0].taxId);
  });

  it('renders component - multi recipient', () => {
    // render component
    const { getByTestId, queryByTestId, getAllByTestId } = render(
      <NotificationDetailTableSender
        notification={notificationDTOMultiRecipient}
        onCancelNotification={mockCancelHandler}
      />
    );
    const detailTable = getByTestId('detailTable');
    expect(detailTable).toBeInTheDocument();
    const cancelNotificationBtn = getByTestId('cancelNotificationBtn');
    expect(cancelNotificationBtn).toBeInTheDocument();
    const recipientRow = queryByTestId('recipientRow');
    expect(recipientRow).not.toBeInTheDocument();
    const recipientsRow = getAllByTestId('recipients');
    expect(recipientsRow).toHaveLength(notificationDTOMultiRecipient.recipients.length);
    recipientsRow.forEach((row, index) => {
      expect(row).toHaveTextContent(
        `${notificationDTOMultiRecipient.recipients[index].denomination} - ${notificationDTOMultiRecipient.recipients[index].taxId}`
      );
    });
  });

  it('renders component - no cancel notification button with operator role', () => {
    // render component
    const { queryByTestId } = render(
      <NotificationDetailTableSender
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
});
