import { Refresh } from '@mui/icons-material';
import { Box, Radio, Skeleton, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import {
  PagoPAPaymentHistory,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../types/NotificationDetail';
import { formatCurrency } from '../../utils';
import { formatDateString } from '../../utils/date.utility';
import CopyToClipboard from '../CopyToClipboard';
import StatusTooltip from '../Notifications/StatusTooltip';

interface Props {
  pagoPAItem: PagoPAPaymentHistory;
  loading: boolean;
  isSelected: boolean;
  handleReloadPayment: (noticeCode: string, creditorTaxId: string) => void;
}

const SkeletonCard = () => {
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

const ErrorCard: React.FC<{
  isMobile: boolean;
  pagoPAItem: PagoPAPaymentHistory;
  handleReloadPayment: (noticeCode: string, creditorTaxId: string) => void;
}> = ({ isMobile, pagoPAItem, handleReloadPayment }) => {
  const { detail, detail_v2, noticeCode, creditorTaxId } = pagoPAItem;
  const getErrorMessage = () => {
    switch (detail) {
      case PaymentInfoDetail.GENERIC_ERROR:
        return (
          <Typography
            variant="caption-semibold"
            color="error.dark"
            data-testid="generic-error-message"
          >
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.generic-error')}
          </Typography>
        );
      case PaymentInfoDetail.PAYMENT_UNAVAILABLE:
      case PaymentInfoDetail.PAYMENT_UNKNOWN:
      case PaymentInfoDetail.DOMAIN_UNKNOWN:
        return (
          <Box display="flex" flexDirection="column" data-testid="assistence-error-message">
            <Typography variant="caption-semibold" color="error.dark">
              {getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.notice-error')}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
              <Typography variant="caption-semibold" color="error.dark">
                {getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.assistence')}
                &nbsp;
                {detail_v2}
              </Typography>
              <CopyToClipboard
                getValue={() => detail_v2 || ''}
                tooltipMode={true}
                iconProps={{ color: 'text.secondary', width: '16px' }}
              />
            </Box>
          </Box>
        );
      default:
        return undefined;
    }
  };

  return (
    <Box
      px={2}
      py={isMobile ? 2 : 1}
      gap={1}
      display="flex"
      alignItems={isMobile ? 'flex-start' : 'center'}
      flexDirection={isMobile ? 'column-reverse' : 'row'}
      sx={{
        backgroundColor: 'grey.50',
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
        <Box lineHeight="1.4rem">
          <Typography variant="caption" color="text.secondary" mr={0.5}>
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.notice-code')}
          </Typography>
          <Typography variant="caption-semibold" color="text.secondary">
            {noticeCode}
          </Typography>
        </Box>
        {getErrorMessage()}
      </Box>
      <ButtonNaked
        color="primary"
        data-testid="reload-button"
        onClick={() => handleReloadPayment(noticeCode, creditorTaxId)}
      >
        <Refresh sx={{ width: '20px' }} />
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.reload')}
      </ButtonNaked>
    </Box>
  );
};

const NotificationPaymentPagoPAStatusElem: React.FC<{
  pagoPAItem: PagoPAPaymentHistory;
  isSelected: boolean;
}> = ({ pagoPAItem, isSelected }) => {
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
          alignItems="flex-end"
          sx={{ mr: pagoPAItem.status === PaymentStatus.SUCCEEDED ? 1 : 0 }}
        >
          <Typography variant="h6" color="primary.main">
            {formatCurrency(pagoPAItem.amount)}
          </Typography>
          {pagoPAItem.applyCostFlg && (
            <Typography
              fontSize="0.625rem"
              fontWeight="600"
              lineHeight="0.875rem"
              color="text.secondary"
              data-testid="apply-costs-caption"
            >
              {getLocalizedOrDefaultLabel('notifications', 'detail.payment.included-costs')}
            </Typography>
          )}
        </Box>
      )}
      {pagoPAItem.status === PaymentStatus.REQUIRED && (
        <Box display="flex" justifyContent="center">
          <Radio data-testid="radio-button" checked={isSelected} value={pagoPAItem.noticeCode} />
        </Box>
      )}
      {pagoPAItem.status !== PaymentStatus.REQUIRED && (
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
  handleReloadPayment,
}) => {
  const isMobile = useIsMobile();

  if (loading) {
    return <SkeletonCard />;
  }

  // TODO forse qui meglio fare un includes del detail in un array con i valori che dovrebbero mostrare la card di errore
  if (
    pagoPAItem.errorCode &&
    pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_CANCELED &&
    pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_EXPIRED
  ) {
    return (
      <ErrorCard
        isMobile={isMobile}
        pagoPAItem={pagoPAItem}
        handleReloadPayment={handleReloadPayment}
      />
    );
  }

  return (
    <Box
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
        {pagoPAItem.dueDate && (
          <Box lineHeight="1.4rem">
            <Typography variant="caption" color="text.secondary" mr={0.5}>
              {getLocalizedOrDefaultLabel('notifications', 'detail.payment.due', 'Scade il')}
            </Typography>
            <Typography variant="caption-semibold" color="text.secondary">
              {formatDateString(pagoPAItem.dueDate)}
            </Typography>
          </Box>
        )}
      </Box>
      <NotificationPaymentPagoPAStatusElem pagoPAItem={pagoPAItem} isSelected={isSelected} />
    </Box>
  );
};

export default NotificationPaymentPagoPAItem;
