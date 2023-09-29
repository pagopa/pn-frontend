import React from 'react';

import {
  notificationToFe,
  notificationToFeMultiRecipient,
} from '../../../__mocks__/NotificationDetail.mock';
import { render } from '../../../__test__/test-utils';
import NotificationDetailTableSender from '../NotificationDetailTableSender';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockCancelHandler = jest.fn();

describe('NotificationDetailTableSender Component', () => {
  it('renders component - one recipient', () => {
    // render component
    const { getByTestId, getAllByTestId } = render(
      <NotificationDetailTableSender
        notification={notificationToFe}
        onCancelNotification={mockCancelHandler}
      />
    );
    const detailTable = getByTestId('detailTable');
    expect(detailTable).toBeInTheDocument();
    const cancelNotificationBtn = getByTestId('cancelNotificationBtn');
    expect(cancelNotificationBtn).toBeInTheDocument();
    const recipientRow = getByTestId('recipientRow');
    expect(recipientRow).toHaveTextContent(notificationToFe.recipients[0].denomination);
    const recipientsRow = getAllByTestId('recipients');
    expect(recipientsRow).toHaveLength(1);
    expect(recipientsRow[0]).toHaveTextContent(notificationToFe.recipients[0].taxId);
  });

  it('renders component - multi recipient', () => {
    // render component
    const { getByTestId, queryByTestId, getAllByTestId } = render(
      <NotificationDetailTableSender
        notification={notificationToFeMultiRecipient}
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
    expect(recipientsRow).toHaveLength(notificationToFeMultiRecipient.recipients.length);
    recipientsRow.forEach((row, index) => {
      expect(row).toHaveTextContent(
        `${notificationToFeMultiRecipient.recipients[index].denomination} - ${notificationToFeMultiRecipient.recipients[index].taxId}`
      );
    });
  });
});
