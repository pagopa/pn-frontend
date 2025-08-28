import { PagoPAPaymentFullDetails } from '../../../../models';
import { render } from '../../../../test-utils';
import { formatDate } from '../../../../utility';
import NotificationPaymentPagoPaDescription from '../NotificationPaymentPagoPaDescription';

describe('NotificationPaymentPagoPaDescription', () => {
  const pagoPAItem = {
    noticeCode: '302010124463699002',
    causaleVersamento: 'Pagamento di Test',
    creditorTaxId: '77777777777',
    dueDate: '2021-07-31',
  } as PagoPAPaymentFullDetails;

  it('render component', () => {
    const { container } = render(
      <NotificationPaymentPagoPaDescription pagoPAItem={pagoPAItem} isCancelled={false} />
    );
    expect(container).toHaveTextContent(pagoPAItem.causaleVersamento!);
    expect(container).toHaveTextContent('detail.payment.notice-code');
    expect(container).toHaveTextContent(pagoPAItem.noticeCode);
    expect(container).toHaveTextContent('detail.payment.due');
    expect(container).toHaveTextContent(formatDate(pagoPAItem.dueDate!, false));
  });

  it('render component - without due date', () => {
    const { container } = render(
      <NotificationPaymentPagoPaDescription
        pagoPAItem={{ ...pagoPAItem, dueDate: undefined }}
        isCancelled={false}
      />
    );
    expect(container).toHaveTextContent(pagoPAItem.causaleVersamento!);
    expect(container).toHaveTextContent('detail.payment.notice-code');
    expect(container).toHaveTextContent(pagoPAItem.noticeCode);
    expect(container).not.toHaveTextContent('detail.payment.due');
  });

  it('render component - cancelled', () => {
    const { container } = render(
      <NotificationPaymentPagoPaDescription pagoPAItem={pagoPAItem} isCancelled />
    );
    expect(container).toHaveTextContent(pagoPAItem.causaleVersamento!);
    expect(container).toHaveTextContent('detail.payment.notice-code');
    expect(container).toHaveTextContent(pagoPAItem.noticeCode);
    expect(container).toHaveTextContent('detail.creditor-tax-id');
    expect(container).toHaveTextContent(pagoPAItem.creditorTaxId);
    expect(container).toHaveTextContent('detail.payment.due');
    expect(container).toHaveTextContent(formatDate(pagoPAItem.dueDate!, false));
  });
});
