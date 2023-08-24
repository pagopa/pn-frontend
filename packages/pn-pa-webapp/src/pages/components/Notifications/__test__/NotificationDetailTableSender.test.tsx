import React from 'react';

import { TimelineCategory } from '@pagopa-pn/pn-commons';

import { fireEvent, render, waitFor, within } from '../../../../__test__/test-utils';
import {
  notificationToFe,
  notificationToFeMultiRecipient,
} from '../../../../redux/notification/__test__/test-utils';
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
    const recipientsRow = getAllByTestId('recipientsRow');
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
    const recipientsRow = getAllByTestId('recipientsRow');
    expect(recipientsRow).toHaveLength(notificationToFeMultiRecipient.recipients.length);
    recipientsRow.forEach((row, index) => {
      expect(row).toHaveTextContent(
        `${notificationToFeMultiRecipient.recipients[index].taxId} - ${notificationToFeMultiRecipient.recipients[index].denomination}`
      );
    });
  });

  it('clicks on the cancel button and on close modal', async () => {
    // render component
    const { getByTestId } = render(
      <NotificationDetailTableSender
        notification={notificationToFe}
        onCancelNotification={mockCancelHandler}
      />
    );
    const cancelNotificationBtn = getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn);
    const modal = await waitFor(() => getByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const closeModalBtn = within(modal).getByTestId('modalCloseBtnId');
    fireEvent.click(closeModalBtn!);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });

  it('clicks on the cancel button and on confirm button - no payment', async () => {
    // remove payment elem from timeline
    const noPaymentNotification = {
      ...notificationToFe,
      timeline: [
        ...notificationToFe.timeline.filter((elem) => elem.category !== TimelineCategory.PAYMENT),
      ],
    };
    // render component
    const { getByTestId } = render(
      <NotificationDetailTableSender
        notification={noPaymentNotification}
        onCancelNotification={mockCancelHandler}
      />
    );
    const cancelNotificationBtn = getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn);
    const modal = await waitFor(() => getByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const modalCloseAndProceedBtn = within(modal).getByTestId('modalCloseAndProceedBtnId');
    fireEvent.click(modalCloseAndProceedBtn!);
    await waitFor(() => {
      expect(mockCancelHandler).toBeCalledTimes(1);
      expect(modal).not.toBeInTheDocument();
    });
  });

  it('clicks on the cancel button and on confirm button - payment', async () => {
    // render component
    const { getByTestId } = render(
      <NotificationDetailTableSender
        notification={notificationToFe}
        onCancelNotification={mockCancelHandler}
      />
    );
    const cancelNotificationBtn = getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn);
    const modal = await waitFor(() => getByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const checkbox = within(modal).getByTestId('checkbox');
    fireEvent.click(checkbox);
    const modalCloseAndProceedBtn = within(modal).getByTestId('modalCloseAndProceedBtnId');
    fireEvent.click(modalCloseAndProceedBtn!);
    await waitFor(() => {
      expect(mockCancelHandler).toBeCalledTimes(1);
      expect(modal).not.toBeInTheDocument();
    });
  });
});
