import { Fragment } from 'react';

import { InfoRounded, Refresh } from '@mui/icons-material';
import { Box, Radio, Skeleton, Typography } from '@mui/material';
import { ButtonNaked, CopyToClipboardButton } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import {
  EventPaymentRecipientType,
  PagoPAPaymentFullDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../models';
import { formatEurocentToCurrency } from '../../utility';
import { formatDate } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import StatusTooltip from '../Notifications/StatusTooltip';

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
        <Skeleton
          variant="rounded"
          width="196px"
          height="23px"
          sx={{ ...(isMobile ? { my: 1 } : null), borderRadius: '8px' }}
        />

        <Box lineHeight="1.4rem" display="flex" flexDirection={isMobile ? 'column' : 'row'}>
          <Skeleton
            variant="rounded"
            width="79px"
            height="15px"
            sx={{ ...(isMobile ? { my: 1 } : { mr: 2 }), borderRadius: '8px' }}
          />
          <Skeleton variant="rounded" width="160px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>

        <Box lineHeight="1.4rem">
          <Skeleton variant="rounded" width="137px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={isMobile ? 'space-between' : 'flex-end'}
        gap={1}
        width={isMobile ? '100%' : 'auto'}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Skeleton variant="rounded" width="79px" height="23px" sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rounded" width="120px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>

        <Box display="flex" justifyContent="center">
          <Skeleton variant="circular" width="22px" />
        </Box>
      </Box>
    </Box>
  );
};

const NotificationPaymentPagoPAStatusElem: React.FC<{
  pagoPAItem: PagoPAPaymentFullDetails;
  isSelected: boolean;
  handleDeselectPayment: () => void;
  isSinglePayment?: boolean;
}> = ({ pagoPAItem, isSelected, handleDeselectPayment, isSinglePayment }) => {
  const isMobile = useIsMobile();
  // eslint-disable-next-line functional/no-let
  let color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' =
    'default';
  // eslint-disable-next-line functional/no-let
  let tooltip = 'unknown';

  switch (pagoPAItem.status) {
    case PaymentStatus.SUCCEEDED:
      color = 'success';
      tooltip = 'succeded';
      break;
    case PaymentStatus.FAILED:
      if (pagoPAItem.detail === PaymentInfoDetail.PAYMENT_CANCELED) {
        color = 'warning';
        tooltip = 'canceled';
      } else {
        color = 'error';
        tooltip = 'failed';
      }
      break;
    case PaymentStatus.INPROGRESS:
      color = 'info';
      tooltip = 'inprogress';
  }
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent={isMobile ? 'space-between' : 'flex-end'}
      gap={1}
      width={isMobile ? '100%' : 'auto'}
    >
      {pagoPAItem.amount && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems={isMobile ? 'flex-start' : 'flex-end'}
          sx={{ mr: pagoPAItem.status === PaymentStatus.SUCCEEDED ? 1 : 0 }}
        >
          <Typography variant="h6" color="primary.main" data-testid="payment-amount">
            {formatEurocentToCurrency(pagoPAItem.amount)}
          </Typography>
        </Box>
      )}
      {pagoPAItem.status === PaymentStatus.REQUIRED ? (
        !isSinglePayment && (
          <Box display="flex" justifyContent="center">
            <Radio
              aria-label={pagoPAItem.causaleVersamento}
              data-testid="radio-button"
              checked={isSelected}
              value={pagoPAItem.noticeCode}
              onClick={() => isSelected && handleDeselectPayment()}
            />
          </Box>
        )
      ) : (
        <StatusTooltip
          label={getLocalizedOrDefaultLabel('notifications', `detail.payment.status.${tooltip}`)}
          color={color}
          tooltip={getLocalizedOrDefaultLabel(
            'notifications',
            `detail.payment.status.${tooltip}-tooltip`
          )}
          tooltipProps={{ placement: 'top' }}
          chipProps={{ borderRadius: '6px' }}
        />
      )}
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
  const isMobile = useIsMobile();

  if (loading) {
    return <SkeletonCard />;
  }

  const isError =
    pagoPAItem.status === PaymentStatus.FAILED &&
    pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_CANCELED &&
    pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_EXPIRED;

  if (isError && handleTrackEventDetailPaymentError) {
    handleTrackEventDetailPaymentError(EventPaymentRecipientType.SEND_PAYMENT_DETAIL_ERROR, {
      detail: pagoPAItem.detail,
      errorCode: pagoPAItem.errorCode,
    });
  }

  const getErrorMessage = () => {
    switch (pagoPAItem.detail) {
      case PaymentInfoDetail.GENERIC_ERROR:
      case PaymentInfoDetail.PAYMENT_DUPLICATED: {
        const isGenericError = pagoPAItem.detail === PaymentInfoDetail.GENERIC_ERROR;
        return (
          <Box display="flex" alignItems="center" gap={0.5}>
            <InfoRounded
              sx={{
                color: isGenericError ? 'error.dark' : 'text-primary',
                width: '16px',
              }}
            />
            <Typography
              fontSize="12px"
              lineHeight="12px"
              fontWeight="600"
              color={isGenericError ? 'error.dark' : 'text-primary'}
              data-testid={isGenericError ? 'generic-error-message' : 'payment-duplicated-message'}
            >
              {isGenericError
                ? getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.generic-error')
                : getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.duplicated')}
            </Typography>
          </Box>
        );
      }
      case PaymentInfoDetail.PAYMENT_UNAVAILABLE:
      case PaymentInfoDetail.PAYMENT_UNKNOWN:
      case PaymentInfoDetail.DOMAIN_UNKNOWN:
        return (
          <Box display="flex" alignItems="flex-start" gap={0.25}>
            <InfoRounded sx={{ color: 'error.dark', width: '16px', height: '16px' }} />
            <Box display="flex" flexDirection="column" data-testid="assistence-error-message">
              <Typography color="error.dark" fontSize="12px" lineHeight="12px" fontWeight="600">
                {getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.notice-error')}
              </Typography>
              <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
                <Typography color="error.dark" fontSize="12px" lineHeight="12px" fontWeight="600">
                  {getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.assistence')}
                  &nbsp;
                  {pagoPAItem.detail_v2}
                </Typography>
                <CopyToClipboardButton
                  value={() => pagoPAItem.detail_v2 ?? ''}
                  size="small"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      width: '16px',
                      height: '16px',
                    },
                    ml: 0,
                  }}
                />
              </Box>
            </Box>
          </Box>
        );
      default:
        return undefined;
    }
  };

  return (
    <Box
      id={`paymentPagoPa-${pagoPAItem.noticeCode}`}
      px={2}
      py={isMobile ? 2 : 1}
      gap={1}
      display="flex"
      alignItems={isMobile ? 'flex-start' : 'center'}
      flexDirection={isMobile ? 'column-reverse' : 'row'}
      sx={{
        backgroundColor: isSelected ? 'rgba(107, 207, 251, 0.08)' : 'grey.50',
        borderRadius: '6px',
      }}
    >
      <Box
        display="flex"
        justifyContent={isMobile ? 'flex-start' : 'inherit'}
        gap={0.5}
        flexDirection="column"
        flex="1 0 0"
      >
        {pagoPAItem.causaleVersamento && (
          <Typography variant="sidenav" color="text.primary">
            {pagoPAItem.causaleVersamento}
          </Typography>
        )}
        <Box lineHeight="1.4rem">
          <Typography variant="caption" color="text.secondary" mr={0.5}>
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.notice-code')}
          </Typography>
          <Typography variant="caption-semibold" color="text.secondary">
            {pagoPAItem.noticeCode}
          </Typography>
        </Box>
        {isCancelled && (
          <Box lineHeight="1.4rem">
            <Typography variant="caption" color="text.secondary" mr={0.5}>
              {getLocalizedOrDefaultLabel('notifications', 'detail.creditor-tax-id')}
            </Typography>
            <Typography
              variant="caption-semibold"
              color="text.secondary"
              data-testid="creditorTaxId"
            >
              {pagoPAItem.creditorTaxId}
            </Typography>
          </Box>
        )}

        {pagoPAItem.dueDate && (
          <Box lineHeight="1.4rem">
            <Typography variant="caption" color="text.secondary" mr={0.5}>
              {getLocalizedOrDefaultLabel('notifications', 'detail.payment.due', 'Scade il')}
            </Typography>
            <Typography variant="caption-semibold" color="text.secondary">
              {formatDate(pagoPAItem.dueDate, false)}
            </Typography>
          </Box>
        )}

        {isError && <Fragment>{getErrorMessage()}</Fragment>}
      </Box>

      {isError ? (
        <ButtonNaked color="primary" data-testid="reload-button" onClick={handleFetchPaymentsInfo}>
          <Refresh sx={{ width: '20px' }} />
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.reload')}
        </ButtonNaked>
      ) : (
        <NotificationPaymentPagoPAStatusElem
          pagoPAItem={pagoPAItem}
          isSelected={isSelected}
          handleDeselectPayment={handleDeselectPayment}
          isSinglePayment={isSinglePayment}
        />
      )}
    </Box>
  );
};

export default NotificationPaymentPagoPAItem;
