import { vi } from 'vitest';

import { PagoPAPaymentFullDetails, PaymentInfoDetail } from '../../../../models';
import { fireEvent, render, waitFor, within } from '../../../../test-utils';
import NotificationPaymentPagoPaError from '../NotificationPaymentPagoPaError';

describe('NotificationPaymentPagoPaError', () => {
  const pagoPAItem = (detail: PaymentInfoDetail, detail_v2?: string) =>
    ({
      noticeCode: '302010124463699002',
      causaleVersamento: 'Pagamento di test',
      detail,
      detail_v2,
    } as PagoPAPaymentFullDetails);

  const paymentInfoMock = vi.fn();

  const original = window.navigator;

  const errorsWhitDetail = [
    {
      title: 'payment unavailable',
      error: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
      detail: 'Payment is unavailable',
    },
    {
      title: 'payment unknown',
      error: PaymentInfoDetail.PAYMENT_UNKNOWN,
      detail: 'Payment is unknown',
    },
    {
      title: 'domain unknown',
      error: PaymentInfoDetail.DOMAIN_UNKNOWN,
      detail: 'Domain is unknown',
    },
  ];

  beforeAll(() => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'navigator', { value: original });
  });

  it('render component - generic error', () => {
    const payment = pagoPAItem(PaymentInfoDetail.GENERIC_ERROR);
    const { container, getByTestId } = render(
      <NotificationPaymentPagoPaError
        pagoPAItem={payment}
        handleFetchPaymentsInfo={paymentInfoMock}
        isCancelled={false}
      />
    );
    expect(container).toHaveTextContent(payment.causaleVersamento!);
    expect(container).toHaveTextContent('detail.payment.notice-code');
    expect(container).toHaveTextContent(payment.noticeCode);
    const errorContainer = getByTestId('error-container');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveTextContent('detail.payment.error.generic-error');
    const reloadButton = getByTestId('reload-button');
    expect(reloadButton).toBeInTheDocument();
    expect(reloadButton).toHaveTextContent('detail.payment.reload');
    fireEvent.click(reloadButton);
    expect(paymentInfoMock).toHaveBeenCalledTimes(1);
  });

  it('render component - payment duplicated', () => {
    const payment = pagoPAItem(PaymentInfoDetail.PAYMENT_DUPLICATED);
    const { container, getByTestId } = render(
      <NotificationPaymentPagoPaError
        pagoPAItem={payment}
        handleFetchPaymentsInfo={paymentInfoMock}
        isCancelled={false}
      />
    );
    expect(container).toHaveTextContent(payment.causaleVersamento!);
    expect(container).toHaveTextContent('detail.payment.notice-code');
    expect(container).toHaveTextContent(payment.noticeCode);
    const errorContainer = getByTestId('error-container');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveTextContent('detail.payment.error.duplicated');
    const reloadButton = getByTestId('reload-button');
    expect(reloadButton).toBeInTheDocument();
    expect(reloadButton).toHaveTextContent('detail.payment.reload');
    fireEvent.click(reloadButton);
    expect(paymentInfoMock).toHaveBeenCalledTimes(1);
  });

  it.each(errorsWhitDetail)('render component - $title', async (error) => {
    const payment = pagoPAItem(error.error, error.detail);
    const { container, getByTestId } = render(
      <NotificationPaymentPagoPaError
        pagoPAItem={payment}
        handleFetchPaymentsInfo={paymentInfoMock}
        isCancelled={false}
      />
    );
    expect(container).toHaveTextContent(payment.causaleVersamento!);
    expect(container).toHaveTextContent('detail.payment.notice-code');
    expect(container).toHaveTextContent(payment.noticeCode);
    const errorContainer = getByTestId('error-container');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveTextContent('detail.payment.error.notice-error');
    expect(errorContainer).toHaveTextContent('detail.payment.error.assistence');
    expect(errorContainer).toHaveTextContent(payment.detail_v2!);
    const copyErrorButton = within(errorContainer).getByRole('button');
    fireEvent.click(copyErrorButton);
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(payment.detail_v2);
    });
    const reloadButton = getByTestId('reload-button');
    expect(reloadButton).toBeInTheDocument();
    expect(reloadButton).toHaveTextContent('detail.payment.reload');
    fireEvent.click(reloadButton);
    expect(paymentInfoMock).toHaveBeenCalledTimes(1);
  });
});
