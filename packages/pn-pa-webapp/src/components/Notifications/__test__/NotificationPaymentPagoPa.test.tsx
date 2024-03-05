import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  PaymentAttachmentSName,
  PaymentStatus,
  downloadDocument,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';

import { notificationToFeMultiRecipient } from '../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { NOTIFICATION_PAYMENT_ATTACHMENT } from '../../../api/notifications/notifications.routes';
import NotificationPaymentPagoPa from '../NotificationPaymentPagoPa';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

vi.mock('@pagopa-pn/pn-commons', async () => {
  const original = await vi.importActual<any>('@pagopa-pn/pn-commons');
  return {
    ...original,
    downloadDocument: vi.fn(),
  };
});

describe('NotificationPaymentPagoPa Component', async () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders component', () => {
    const paymentHistory = populatePaymentsPagoPaF24(
      notificationToFeMultiRecipient.timeline,
      notificationToFeMultiRecipient.recipients[1].payments ?? [],
      []
    );
    const { container, queryByTestId, rerender } = render(
      <NotificationPaymentPagoPa
        iun={notificationToFeMultiRecipient.iun}
        payment={paymentHistory[0].pagoPa!}
      />
    );
    expect(container).toHaveTextContent('detail.notice-code');
    expect(container).toHaveTextContent(paymentHistory[0].pagoPa?.noticeCode!);
    expect(container).toHaveTextContent('payment.pagopa-notice');
    // payment without status succeded
    let paymentChip = queryByTestId('payment-succeded');
    expect(paymentChip).not.toBeInTheDocument();
    // payment with status succeded
    paymentHistory[0].pagoPa!.status = PaymentStatus.SUCCEEDED;
    rerender(
      <NotificationPaymentPagoPa
        iun={notificationToFeMultiRecipient.iun}
        payment={paymentHistory[0].pagoPa!}
      />
    );
    paymentChip = queryByTestId('payment-succeded');
    expect(paymentChip).toBeInTheDocument();
  });

  it('dowload payment attachment', async () => {
    const iun = notificationToFeMultiRecipient.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    const paymentHistory = populatePaymentsPagoPaF24(
      notificationToFeMultiRecipient.timeline,
      getPagoPaF24Payments(notificationToFeMultiRecipient.recipients[1].payments ?? [], 1, false),
      []
    );
    mock
      .onGet(
        NOTIFICATION_PAYMENT_ATTACHMENT(
          iun,
          attachmentName,
          paymentHistory[0].pagoPa?.recIndex!,
          paymentHistory[0].pagoPa?.attachmentIdx
        )
      )
      .reply(200, { url: 'http://mocked-url.com' });
    const { getByRole } = render(
      <NotificationPaymentPagoPa
        iun={notificationToFeMultiRecipient.iun}
        payment={paymentHistory[0].pagoPa!}
      />
    );
    const dowloadButton = getByRole('button');
    fireEvent.click(dowloadButton!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(
        NOTIFICATION_PAYMENT_ATTACHMENT(
          iun,
          attachmentName,
          paymentHistory[0].pagoPa?.recIndex!,
          paymentHistory[0].pagoPa?.attachmentIdx
        )
      );
      expect(downloadDocument).toBeCalledTimes(1);
      expect(downloadDocument).toBeCalledWith('http://mocked-url.com');
    });
  });

  it('dowload payment attachment - no recIndex', async () => {
    const paymentHistory = populatePaymentsPagoPaF24(
      notificationToFeMultiRecipient.timeline,
      notificationToFeMultiRecipient.recipients[1].payments ?? [],
      []
    );
    const { getByRole } = render(
      <NotificationPaymentPagoPa
        iun={notificationToFeMultiRecipient.iun}
        payment={paymentHistory[0].pagoPa!}
      />
    );
    const dowloadButton = getByRole('button');
    fireEvent.click(dowloadButton!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(0);
      expect(downloadDocument).toBeCalledTimes(0);
    });
  });
});
