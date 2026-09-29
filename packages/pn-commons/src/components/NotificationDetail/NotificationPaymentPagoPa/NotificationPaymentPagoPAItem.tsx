import {
  EventNotificationType,
  EventNotificationTypes,
  EventPaymentRecipientType,
} from '../../../models/MixpanelEvents';
import {
  PagoPAPaymentFullDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../../models/NotificationDetail';
import NotificationPaymentPagoPaError from './NotificationPaymentPagoPaError';
import NotificationPaymentPagoPaLoading from './NotificationPaymentPagoPaLoading';
import NotificationPaymentPagoPaReadOnly from './NotificationPaymentPagoPaReadOnly';
import NotificationPaymentPagoPaSelectable from './NotificationPaymentPagoPaSelectable';

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  loading: boolean;
  isSelected: boolean;
  handleFetchPaymentsInfo: () => void;
  handleDeselectPayment: () => void;
  isSinglePayment?: boolean;
  isCancelled: boolean;
  handleTrackEventDetailPaymentError?: (event: EventPaymentRecipientType, param?: object) => void;
  notificationType?: EventNotificationType;
};

const NotificationPaymentPagoPAItem: React.FC<Props> = ({
  pagoPAItem,
  loading,
  isSelected,
  handleFetchPaymentsInfo,
  handleDeselectPayment,
  isSinglePayment,
  isCancelled,
  handleTrackEventDetailPaymentError,
  notificationType = EventNotificationTypes.NOTIFICATION,
}) => {
  // the PagoPa payment has 4 different state:
  // 1 - the loading state in which we show a skeleton
  // 2 - the error state in which we show the payment description (notice code, causaleVersamento ...),
  //     the error message and a button to refresh the payment
  // 3 - the selectable state, for those payments that are more than one,
  //     in which we show the payment description (notice code, causaleVersamento ...), the ammount and a radio button to select the payment
  // 4 - the readonly state, for those payments that are more than one and aren't in to be paid state or for a single payment,
  //     in which we show the payment description (notice code, causaleVersamento ...), the ammount and a status chip

  if (loading) {
    return <NotificationPaymentPagoPaLoading />;
  }

  const isError =
    pagoPAItem.status === PaymentStatus.FAILED &&
    pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_CANCELED &&
    pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_EXPIRED;

  if (isError) {
    if (handleTrackEventDetailPaymentError) {
      handleTrackEventDetailPaymentError(EventPaymentRecipientType.SEND_PAYMENT_DETAIL_ERROR, {
        detail: pagoPAItem.detail,
        errorCode: pagoPAItem.errorCode,
        notification_type: notificationType,
      });
    }

    return (
      <NotificationPaymentPagoPaError
        pagoPAItem={pagoPAItem}
        handleFetchPaymentsInfo={handleFetchPaymentsInfo}
        isCancelled={isCancelled}
      />
    );
  }

  const isSelectable = pagoPAItem.status === PaymentStatus.REQUIRED && !isSinglePayment;

  if (isSelectable) {
    return (
      <NotificationPaymentPagoPaSelectable
        pagoPAItem={pagoPAItem}
        isSelected={isSelected}
        isCancelled={isCancelled}
        handleDeselectPayment={handleDeselectPayment}
      />
    );
  }

  return <NotificationPaymentPagoPaReadOnly pagoPAItem={pagoPAItem} isCancelled={isCancelled} />;
};

export default NotificationPaymentPagoPAItem;
