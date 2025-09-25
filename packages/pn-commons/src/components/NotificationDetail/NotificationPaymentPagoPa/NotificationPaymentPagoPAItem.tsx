import { Box, Skeleton } from '@mui/material';

import { useIsMobile } from '../../../hooks';
import {
  EventPaymentRecipientType,
  PagoPAPaymentFullDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../../models';
import NotificationPaymentPagoPaError from './NotificationPaymentPagoPaError';
import NotificationPaymentPagoPaReadOnly from './NotificationPaymentPagoPaReadOnly';
import NotificationPaymentPagoPaSelectable from './NotificationPaymentPagoPaSelectable';

type PaymentItemContainerProps = {
  id: string;
  isSelected: boolean;
  children: React.ReactNode;
  enableLayout?: boolean;
};

const PaymentItemContainer: React.FC<PaymentItemContainerProps> = ({
  id,
  isSelected,
  children,
  enableLayout = false,
}) => {
  const isMobile = useIsMobile();

  return (
    <Box
      id={id}
      data-testid="PaymentItem"
      px={2}
      py={isMobile ? 2 : 1}
      sx={{
        backgroundColor: isSelected ? 'rgba(107, 207, 251, 0.08)' : 'grey.50',
        borderRadius: '6px',
        ...(isMobile && { position: 'relative' }),
        ...(enableLayout && {
          display: 'flex',
          flexDirection: isMobile ? 'column-reverse' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
        }),
      }}
    >
      {children}
    </Box>
  );
};

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  loading: boolean;
  isSelected: boolean;
  handleFetchPaymentsInfo: () => void;
  handleDeselectPayment: () => void;
  isSinglePayment?: boolean;
  isCancelled: boolean;
  handleTrackEventDetailPaymentError?: (event: EventPaymentRecipientType, param?: object) => void;
};

const SkeletonCard: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <Box
      px={2}
      py={isMobile ? 2 : 1}
      gap={1}
      display="flex"
      alignItems={isMobile ? 'flex-start' : 'center'}
      flexDirection={isMobile ? 'column-reverse' : 'row'}
      sx={{ backgroundColor: '#FAFAFA' }}
      data-testid="skeleton-card"
    >
      <Box display="flex" gap={1} flexDirection="column" flex="1 0 0">
        <Skeleton variant="rounded" width="196px" height="23px" sx={{ borderRadius: '8px' }} />
        <Box lineHeight="1.4rem" display="flex" flexDirection={isMobile ? 'column' : 'row'}>
          <Skeleton
            variant="rounded"
            width="79px"
            height="15px"
            sx={{ borderRadius: '8px', mr: isMobile ? 0 : 2, my: isMobile ? 1 : 0 }}
          />
          <Skeleton variant="rounded" width="160px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>
        <Skeleton variant="rounded" width="137px" height="15px" sx={{ borderRadius: '8px' }} />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={isMobile ? 'space-between' : 'flex-end'}
        gap={1}
        width={isMobile ? '100%' : 'auto'}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Skeleton variant="rounded" width="79px" height="23px" sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rounded" width="120px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>
        <Skeleton variant="circular" width="22px" height="22px" />
      </Box>
    </Box>
  );
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
    return <SkeletonCard />;
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
      });
    }

    return (
      <PaymentItemContainer
        id={`paymentPagoPa-${pagoPAItem.noticeCode}`}
        isSelected={isSelected}
        enableLayout
      >
        <NotificationPaymentPagoPaError
          pagoPAItem={pagoPAItem}
          handleFetchPaymentsInfo={handleFetchPaymentsInfo}
          isCancelled={isCancelled}
        />
      </PaymentItemContainer>
    );
  }

  const isSelectable = pagoPAItem.status === PaymentStatus.REQUIRED && !isSinglePayment;

  if (isSelectable) {
    return (
      <PaymentItemContainer id={`paymentPagoPa-${pagoPAItem.noticeCode}`} isSelected={isSelected}>
        <NotificationPaymentPagoPaSelectable
          pagoPAItem={pagoPAItem}
          isSelected={isSelected}
          isCancelled={isCancelled}
          handleDeselectPayment={handleDeselectPayment}
        />
      </PaymentItemContainer>
    );
  }

  return (
    <PaymentItemContainer
      id={`paymentPagoPa-${pagoPAItem.noticeCode}`}
      isSelected={isSelected}
      enableLayout
    >
      <NotificationPaymentPagoPaReadOnly pagoPAItem={pagoPAItem} isCancelled={isCancelled} />
    </PaymentItemContainer>
  );
};

export default NotificationPaymentPagoPAItem;
