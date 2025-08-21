import { vi } from 'vitest';

import { PagoPAPaymentFullDetails } from '../../../../models';
import { fireEvent, render } from '../../../../test-utils';
import { formatEurocentToCurrency } from '../../../../utility';
import NotificationPaymentPagoPaSelectable from '../NotificationPaymentPagoPaSelectable';

describe('NotificationPaymentPagoPaSelectable', () => {
  const pagoPAItem = {
    noticeCode: '302010124463699002',
    causaleVersamento: 'Pagamento di test',
    amount: 12534,
  } as PagoPAPaymentFullDetails;

  const deselectPaymentMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render component - not selected', () => {
    const { container, getByTestId } = render(
      <NotificationPaymentPagoPaSelectable
        pagoPAItem={pagoPAItem}
        isSelected={false}
        isCancelled={false}
        handleDeselectPayment={deselectPaymentMock}
      />
    );
    expect(container).toHaveTextContent(pagoPAItem.causaleVersamento!);
    expect(container).toHaveTextContent('detail.payment.notice-code');
    expect(container).toHaveTextContent(pagoPAItem.noticeCode);
    const amount = getByTestId('payment-amount');
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(
      formatEurocentToCurrency(pagoPAItem.amount!).replace(/\u00a0/g, ' ')
    );
    const radio = getByTestId('radio-button');
    expect(radio).toBeInTheDocument();
    const radioInput = radio.querySelector('input');
    expect(radioInput).not.toBeChecked();
    fireEvent.click(radioInput!);
    expect(deselectPaymentMock).toHaveBeenCalledTimes(0);
  });

  it('render component - selected', () => {
    const { container, getByTestId } = render(
      <NotificationPaymentPagoPaSelectable
        pagoPAItem={pagoPAItem}
        isSelected
        isCancelled={false}
        handleDeselectPayment={deselectPaymentMock}
      />
    );
    expect(container).toHaveTextContent(pagoPAItem.causaleVersamento!);
    expect(container).toHaveTextContent('detail.payment.notice-code');
    expect(container).toHaveTextContent(pagoPAItem.noticeCode);
    const amount = getByTestId('payment-amount');
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(
      formatEurocentToCurrency(pagoPAItem.amount!).replace(/\u00a0/g, ' ')
    );
    const radio = getByTestId('radio-button');
    expect(radio).toBeInTheDocument();
    const radioInput = radio.querySelector('input');
    expect(radioInput).toBeChecked();
    fireEvent.click(radioInput!);
    expect(deselectPaymentMock).toHaveBeenCalledTimes(1);
  });
});
