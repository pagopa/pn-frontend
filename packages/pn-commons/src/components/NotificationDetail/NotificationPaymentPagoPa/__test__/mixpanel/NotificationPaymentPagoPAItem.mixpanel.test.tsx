import { vi } from 'vitest';

import { paymentInfo } from '../../../../../__mocks__/ExternalRegistry.mock';
import { notificationDTO, payments } from '../../../../../__mocks__/NotificationDetail.mock';
import { EventPaymentRecipientType } from '../../../../../models';
import {
  PagoPAPaymentFullDetails,
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../../../../models/NotificationDetail';
import { render } from '../../../../../test-utils';
import {
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '../../../../../utility/notification.utility';
import NotificationPaymentPagoPAItem from '../../NotificationPaymentPagoPAItem';

describe('NotificationPaymentPagoPAItem - Mixpanel events', () => {
  const pagoPAItems: PaymentDetails[] = populatePaymentsPagoPaF24(
    notificationDTO.timeline,
    getPagoPaF24Payments(payments, 0),
    paymentInfo
  );

  const failedItem = pagoPAItems.find(
    (item) =>
      item.pagoPa?.status === PaymentStatus.FAILED &&
      item.pagoPa?.detail !== PaymentInfoDetail.PAYMENT_CANCELED &&
      item.pagoPa?.detail !== PaymentInfoDetail.PAYMENT_EXPIRED
  )?.pagoPa as PagoPAPaymentFullDetails;

  it('fires SEND_PAYMENT_DETAIL_ERROR when payment is FAILED with non-canceled/expired detail', () => {
    const handleTrackEventDetailPaymentError = vi.fn();
    render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={failedItem}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
        handleTrackEventDetailPaymentError={handleTrackEventDetailPaymentError}
      />
    );
    expect(handleTrackEventDetailPaymentError).toHaveBeenCalledWith(
      EventPaymentRecipientType.SEND_PAYMENT_DETAIL_ERROR,
      {
        detail: failedItem.detail,
        errorCode: failedItem.errorCode,
      }
    );
  });
});
