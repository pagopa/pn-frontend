import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  PaymentAttachmentSName,
  PaymentStatus,
  downloadDocument,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';

import { notificationDTOMultiRecipient } from '../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import NotificationPaymentPagoPa from '../NotificationPaymentPagoPa';

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
      notificationDTOMultiRecipient.timeline,
      notificationDTOMultiRecipient.recipients[1].payments ?? [],
      []
    );
    const { container, queryByTestId, rerender } = render(
      <NotificationPaymentPagoPa
        iun={notificationDTOMultiRecipient.iun}
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
        iun={notificationDTOMultiRecipient.iun}
        payment={paymentHistory[0].pagoPa!}
      />
    );
    paymentChip = queryByTestId('payment-succeded');
    expect(paymentChip).toBeInTheDocument();
  });

  it('dowload payment attachment', async () => {
    const iun = notificationDTOMultiRecipient.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    const paymentHistory = populatePaymentsPagoPaF24(
      notificationDTOMultiRecipient.timeline,
      getPagoPaF24Payments(notificationDTOMultiRecipient.recipients[1].payments ?? [], 1, false),
      []
    );
    mock
      .onGet(
        `/bff/v1/notifications/sent/${iun}/payments/${paymentHistory[0].pagoPa?.recIndex}/${attachmentName}?attachmentIdx=${paymentHistory[0].pagoPa?.attachmentIdx}`
      )
      .reply(200, { url: 'http://mocked-url.com' });
    const { getByRole } = render(
      <NotificationPaymentPagoPa
        iun={notificationDTOMultiRecipient.iun}
        payment={paymentHistory[0].pagoPa!}
      />
    );
    const dowloadButton = getByRole('button');
    fireEvent.click(dowloadButton);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(
        `/bff/v1/notifications/sent/${iun}/payments/${paymentHistory[0].pagoPa?.recIndex}/${attachmentName}?attachmentIdx=${paymentHistory[0].pagoPa?.attachmentIdx}`
      );
      expect(downloadDocument).toHaveBeenCalledTimes(1);
      expect(downloadDocument).toHaveBeenCalledWith('http://mocked-url.com');
    });
  });

  it('download payment attachment - no recIndex', async () => {
    const paymentHistory = populatePaymentsPagoPaF24(
      notificationDTOMultiRecipient.timeline,
      notificationDTOMultiRecipient.recipients[1].payments ?? [],
      []
    );
    const { getByRole } = render(
      <NotificationPaymentPagoPa
        iun={notificationDTOMultiRecipient.iun}
        payment={paymentHistory[0].pagoPa!}
      />
    );
    const dowloadButton = getByRole('button');
    fireEvent.click(dowloadButton);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(0);
      expect(downloadDocument).toHaveBeenCalledTimes(0);
    });
  });

  it('payment attachment not available', async () => {
    const paymentHistory = populatePaymentsPagoPaF24(
      notificationDTOMultiRecipient.timeline,
      notificationDTOMultiRecipient.recipients[1].payments ?? [],
      []
    );
    const indexItem = paymentHistory.findIndex((item) => !item.pagoPa?.attachment);
    const { container } = render(
      <NotificationPaymentPagoPa
        iun={notificationDTOMultiRecipient.iun}
        payment={paymentHistory[indexItem].pagoPa!}
      />
    );
    expect(container).not.toHaveTextContent('payment.pagopa-notice');
  });
});
