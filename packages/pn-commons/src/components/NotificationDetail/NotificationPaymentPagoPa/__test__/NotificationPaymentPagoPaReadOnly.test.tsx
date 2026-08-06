import {
  PagoPAPaymentFullDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../../../models/NotificationDetail';
import { fireEvent, render, screen, waitFor } from '../../../../test-utils';
import { formatEurocentToCurrency } from '../../../../utility/currency.utility';
import NotificationPaymentPagoPaReadOnly from '../NotificationPaymentPagoPaReadOnly';

describe('NotificationPaymentPagoPaReadOnly', () => {
  const pagoPAItem = (status: PaymentStatus, detail?: PaymentInfoDetail) =>
    ({
      noticeCode: '302010124463699002',
      causaleVersamento: 'Pagamento di test',
      amount: 12534,
      status,
      detail,
    } as PagoPAPaymentFullDetails);

  const statuses = [
    { status: PaymentStatus.SUCCEEDED, key: 'succeeded' },
    {
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_CANCELED,
      key: 'canceled',
    },
    {
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_EXPIRED,
      key: 'failed',
    },
    { status: PaymentStatus.INPROGRESS, key: 'inprogress' },
  ];

  it.each(statuses)('render component - $key', async (status) => {
    const payment = pagoPAItem(status.status, status.detail);
    const { container, getByTestId } = render(
      <NotificationPaymentPagoPaReadOnly pagoPAItem={payment} isCancelled={false} />
    );
    expect(container).toHaveTextContent(payment.causaleVersamento!);
    expect(container).toHaveTextContent('detail.payment.notice-code');
    expect(container).toHaveTextContent(payment.noticeCode);
    const amount = getByTestId('payment-amount');
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(
      formatEurocentToCurrency(payment.amount!).replace(/\u00a0/g, ' ')
    );
    const statusButton = getByTestId(`statusChip-detail.payment.status.${status.key}`);
    expect(statusButton).toHaveTextContent(`detail.payment.status.${status.key}`);
    fireEvent.mouseOver(statusButton);
    const ttip = await waitFor(() => screen.getByRole('tooltip'));
    expect(ttip).toHaveTextContent(`detail.payment.status.${status.key}-tooltip`);
  });
});
