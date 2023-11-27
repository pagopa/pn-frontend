import React from 'react';

import {
  NotificationDetailPayment,
  NotificationDetailRecipient,
  PaginationData,
} from '@pagopa-pn/pn-commons';

import {
  notificationToFe,
  notificationToFeMultiRecipient,
} from '../../../__mocks__/NotificationDetail.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import NotificationPaymentSender from '../NotificationPaymentSender';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

async function selectRecipient(recipientToSelect: number) {
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
  fireEvent.click(selectOptionsListItems[recipientToSelect]);
  await waitFor(() => {
    expect(selectInput).toHaveValue(
      notificationToFeMultiRecipient.recipients[recipientToSelect].taxId
    );
  });
}

function getPaymentsCount(
  recipientToSelect: number,
  recipients: Array<NotificationDetailRecipient>,
  key: keyof NotificationDetailPayment
): number {
  return (
    recipients[recipientToSelect].payments?.reduce((count, item) => {
      if (item[key]) {
        count++;
      }
      return count;
    }, 0) ?? 0
  );
}

describe('NotificationPaymentSender Component', () => {
  it('renders component - one recipient', () => {
    // render component
    const { container, queryByTestId, getAllByTestId } = render(
      <NotificationPaymentSender
        iun={notificationToFe.iun}
        recipients={notificationToFe.recipients}
        timeline={notificationToFe.timeline}
      />
    );
    expect(container).toHaveTextContent('payment.title');
    expect(container).toHaveTextContent('payment.subtitle-single');
    const recipientsSelect = queryByTestId('recipients-select');
    expect(recipientsSelect).not.toBeInTheDocument();
    const paymentItems = getAllByTestId('payment-item');
    expect(paymentItems).toHaveLength(getPaymentsCount(0, notificationToFe.recipients, 'pagoPa'));
  });

  it('renders component - multi recipient', () => {
    // render component
    const { container, getByTestId, queryAllByTestId } = render(
      <NotificationPaymentSender
        iun={notificationToFeMultiRecipient.iun}
        recipients={notificationToFeMultiRecipient.recipients}
        timeline={notificationToFeMultiRecipient.timeline}
      />
    );
    expect(container).toHaveTextContent('payment.title');
    expect(container).toHaveTextContent('payment.subtitle-multiple');
    const recipientsSelect = getByTestId('recipients-select');
    expect(recipientsSelect).toBeInTheDocument();
    const paymentItems = queryAllByTestId('payment-item');
    expect(paymentItems).toHaveLength(0);
  });

  it('select a recipient', async () => {
    let result: RenderResult | undefined;
    // render component
    await act(async () => {
      result = render(
        <NotificationPaymentSender
          iun={notificationToFeMultiRecipient.iun}
          recipients={notificationToFeMultiRecipient.recipients}
          timeline={notificationToFeMultiRecipient.timeline}
        />
      );
    });
    let numberOfPagoPaPayments;
    // select a recipient
    await selectRecipient(0);
    let paymentItems = result?.queryAllByTestId('payment-item');
    let f24Items = result?.queryAllByTestId('f24');
    numberOfPagoPaPayments = getPaymentsCount(
      0,
      notificationToFeMultiRecipient.recipients,
      'pagoPa'
    );
    expect(paymentItems).toHaveLength(numberOfPagoPaPayments > 5 ? 5 : numberOfPagoPaPayments);
    expect(f24Items).toHaveLength(
      getPaymentsCount(0, notificationToFeMultiRecipient.recipients, 'f24')
    );
    await selectRecipient(1);
    paymentItems = result?.queryAllByTestId('payment-item');
    f24Items = result?.queryAllByTestId('f24');
    numberOfPagoPaPayments = getPaymentsCount(
      1,
      notificationToFeMultiRecipient.recipients,
      'pagoPa'
    );
    expect(paymentItems).toHaveLength(numberOfPagoPaPayments > 5 ? 5 : numberOfPagoPaPayments);
    expect(f24Items).toHaveLength(
      getPaymentsCount(1, notificationToFeMultiRecipient.recipients, 'f24')
    );
  });

  it('should show pagination if recipient has more than 5 payments', async () => {
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(
        <NotificationPaymentSender
          iun={notificationToFeMultiRecipient.iun}
          recipients={notificationToFeMultiRecipient.recipients}
          timeline={notificationToFeMultiRecipient.timeline}
        />
      );
    });

    await selectRecipient(1);

    const paginationBox = result?.queryByTestId('pagination-box');
    if (getPaymentsCount(1, notificationToFeMultiRecipient.recipients, 'pagoPa') > 5) {
      expect(paginationBox).toBeInTheDocument();
    } else {
      expect(paginationBox).not.toBeInTheDocument();
    }
  });

  it('should show updated payments when pagination is changed', async () => {
    let result: RenderResult | undefined;
    // render component
    await act(async () => {
      result = render(
        <NotificationPaymentSender
          iun={notificationToFeMultiRecipient.iun}
          recipients={notificationToFeMultiRecipient.recipients}
          timeline={notificationToFeMultiRecipient.timeline}
        />
      );
    });

    await selectRecipient(1);

    let paginationData: PaginationData = {
      page: 0,
      size: 5,
      totalElements: getPaymentsCount(1, notificationToFeMultiRecipient.recipients, 'pagoPa'),
    };

    // should show first 5 payments
    const paymentItems = result?.queryAllByTestId('payment-item');
    expect(paymentItems).toHaveLength(5);

    const pageSelector = result?.getByTestId('pageSelector');
    const pageButtons = pageSelector?.querySelectorAll('button');
    // the buttons are < 1 2 >
    fireEvent.click(pageButtons![2]);
    paginationData = {
      ...paginationData,
      page: 1,
    };

    const numberOfPaymentsSliced = paginationData.totalElements - paginationData.page * 5;
    const secondPageItems = result?.queryAllByTestId('payment-item');
    expect(secondPageItems).toHaveLength(numberOfPaymentsSliced);
  });
});
