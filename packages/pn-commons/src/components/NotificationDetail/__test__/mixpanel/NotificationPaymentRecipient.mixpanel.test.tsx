import { vi } from 'vitest';

import { paymentInfo } from '../../../../__mocks__/ExternalRegistry.mock';
import {
  notificationCostDetailsMock,
  notificationDTO,
  payments,
} from '../../../../__mocks__/NotificationDetail.mock';
import { EventPaymentRecipientType } from '../../../../models';
import { PaymentStatus, PaymentsData } from '../../../../models/NotificationDetail';
import { fireEvent, initLocalizationForTest, render, screen } from '../../../../test-utils';
import {
  getF24Payments,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '../../../../utility/notification.utility';
import NotificationPaymentRecipient from '../../NotificationPaymentRecipient';

const F24TIMER = 15000;
const iun = notificationDTO.iun;

describe('NotificationPaymentRecipient - Mixpanel events', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  const paymentsData: PaymentsData = {
    pagoPaF24: populatePaymentsPagoPaF24(
      notificationDTO.timeline,
      getPagoPaF24Payments(payments, 0),
      paymentInfo
    ),
    f24Only: getF24Payments(payments, 0),
  };

  it('fires SEND_PAYMENT_STATUS on mount when payments are loaded', () => {
    const handleTrackEvent = vi.fn();
    render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        iun={iun}
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => void 0}
        costDetailsAssistanceLink=""
        costDetails={notificationCostDetailsMock}
        handleTrackEvent={handleTrackEvent}
      />
    );
    expect(handleTrackEvent).toHaveBeenCalledWith(
      EventPaymentRecipientType.SEND_PAYMENT_STATUS,
      expect.objectContaining({
        paginationData: expect.any(Object),
        paginatedPayments: expect.any(Array),
      })
    );
  });

  it('fires SEND_PAYMENT_LIST_CHANGE_PAGE when pagination changes', async () => {
    const handleTrackEvent = vi.fn();
    render(
      <NotificationPaymentRecipient
        payments={paymentsData}
        isCancelled={false}
        timerF24={F24TIMER}
        iun={iun}
        getPaymentAttachmentAction={vi.fn()}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => void 0}
        costDetailsAssistanceLink=""
        costDetails={notificationCostDetailsMock}
        handleTrackEvent={handleTrackEvent}
      />
    );
    handleTrackEvent.mockClear();
    const nextPageButton = screen.getByRole('button', { name: 'common - paginator.next' });
    fireEvent.click(nextPageButton);
    expect(handleTrackEvent).toHaveBeenCalledWith(
      EventPaymentRecipientType.SEND_PAYMENT_LIST_CHANGE_PAGE,
      undefined
    );
  });

  it('fires SEND_DOWNLOAD_PAYMENT_NOTICE when download button is clicked', () => {
    const handleTrackEvent = vi.fn();
    const singlePaymentData: PaymentsData = {
      pagoPaF24: paymentsData.pagoPaF24
        .filter((p) => p.pagoPa?.status === PaymentStatus.REQUIRED)
        .slice(0, 1),
      f24Only: [],
    };
    const mockGetPaymentAttachmentAction = vi.fn().mockReturnValue({
      unwrap: () => Promise.resolve({ url: '' }),
    });
    render(
      <NotificationPaymentRecipient
        payments={singlePaymentData}
        isCancelled={false}
        timerF24={F24TIMER}
        iun={iun}
        getPaymentAttachmentAction={mockGetPaymentAttachmentAction}
        onPayClick={() => void 0}
        handleFetchPaymentsInfo={() => void 0}
        costDetailsAssistanceLink=""
        costDetails={notificationCostDetailsMock}
        handleTrackEvent={handleTrackEvent}
      />
    );
    handleTrackEvent.mockClear();
    const downloadButton = screen.getByTestId('download-pagoPA-notice-button');
    fireEvent.click(downloadButton);
    expect(handleTrackEvent).toHaveBeenCalledWith(
      EventPaymentRecipientType.SEND_DOWNLOAD_PAYMENT_NOTICE,
      undefined
    );
  });
});
