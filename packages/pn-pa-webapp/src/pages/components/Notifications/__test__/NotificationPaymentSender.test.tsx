import React from 'react';

import {
  notificationToFe,
  notificationToFeMultiRecipient,
} from '../../../../__mocks__/NotificationDetail.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../../../__test__/test-utils';
import NotificationPaymentSender from '../NotificationPaymentSender';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NotificationPaymentSender Component', () => {
  it('renders component - one recipient', () => {
    // render component
    const { container, queryByTestId } = render(
      <NotificationPaymentSender recipients={notificationToFe.recipients} />
    );
    expect(container).toHaveTextContent('payment.title');
    expect(container).toHaveTextContent('payment.subtitle-single');
    const recipientsSelect = queryByTestId('recipients-select');
    expect(recipientsSelect).not.toBeInTheDocument();
  });

  it('renders component - multi recipient', () => {
    // render component
    const { container, getByTestId } = render(
      <NotificationPaymentSender recipients={notificationToFeMultiRecipient.recipients} />
    );
    expect(container).toHaveTextContent('payment.title');
    expect(container).toHaveTextContent('payment.subtitle-multiple');
    const recipientsSelect = getByTestId('recipients-select');
    expect(recipientsSelect).toBeInTheDocument();
  });

  it('select a recipient', async () => {
    let result: RenderResult;
    // render component
    await act(async () => {
      result = render(
        <NotificationPaymentSender recipients={notificationToFeMultiRecipient.recipients} />
      );
    });
    // select a recipient
    const recipientsSelect = document.querySelector('div[id="recipients-select"]');
    const selectInput = document.querySelector(`input[name="recipients-select"]`);
    fireEvent.mouseDown(recipientsSelect!);
    const selectOptionsContainer = await waitFor(() => screen.queryByRole('presentation'));
    expect(selectOptionsContainer).toBeInTheDocument();
    const selectOptionsList = await within(selectOptionsContainer!).findByRole('listbox');
    expect(selectOptionsList).toBeInTheDocument();
    const selectOptionsListItems = await within(selectOptionsList).findAllByRole('option');
    expect(selectOptionsListItems).toHaveLength(notificationToFeMultiRecipient.recipients.length);
    selectOptionsListItems.forEach((opt, index) => {
      expect(opt).toHaveTextContent(
        notificationToFeMultiRecipient.recipients[index].denomination +
          ' - ' +
          notificationToFeMultiRecipient.recipients[index].taxId
      );
    });
    fireEvent.click(selectOptionsListItems[1]);
    await waitFor(() => {
      expect(selectInput).toHaveValue(notificationToFeMultiRecipient.recipients[1].taxId);
    });
  });
});
