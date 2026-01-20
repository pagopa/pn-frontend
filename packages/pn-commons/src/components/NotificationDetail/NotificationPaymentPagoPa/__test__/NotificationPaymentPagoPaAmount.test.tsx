import { PagoPAPaymentFullDetails } from '../../../../models/NotificationDetail';
import { render } from '../../../../test-utils';
import { formatEurocentToCurrency } from '../../../../utility/currency.utility';
import NotificationPaymentPagoPaAmount from '../NotificationPaymentPagoPaAmount';

describe('NotificationPaymentPagoPaAmount', () => {
  const pagoPAItem = {
    amount: 12534,
  } as PagoPAPaymentFullDetails;

  it('render component', () => {
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPaAmount pagoPAItem={pagoPAItem} />
    );
    const amount = getByTestId('payment-amount');
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(
      formatEurocentToCurrency(pagoPAItem.amount!).replace(/\u00a0/g, ' ')
    );
    const applyCost = queryByTestId('apply-costs-caption');
    expect(applyCost).not.toBeInTheDocument();
  });

  it('render component - with apply cost', () => {
    const { getByTestId } = render(
      <NotificationPaymentPagoPaAmount pagoPAItem={{ ...pagoPAItem, applyCost: true }} />
    );
    const applyCost = getByTestId('apply-costs-caption');
    expect(applyCost).toBeInTheDocument();
    expect(applyCost).toHaveTextContent('detail.payment.included-costs');
  });
});
