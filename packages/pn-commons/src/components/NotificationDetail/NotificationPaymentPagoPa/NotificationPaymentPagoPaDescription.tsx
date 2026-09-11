import { Box, Typography } from '@mui/material';

import { useIsMobile } from '../../../hooks';
import {
  PagoPAPaymentFullDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../../models/NotificationDetail';
import { formatDate } from '../../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import StatusTooltip from '../../Notifications/StatusTooltip';

type StatusVisualInfo = {
  color: 'warning' | 'error' | 'success' | 'info';
  key: string;
};

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  isCancelled: boolean;
};

const getStatusVisualInfo = (
  status: PaymentStatus,
  detail?: PaymentInfoDetail
): StatusVisualInfo | undefined => {
  switch (status) {
    case PaymentStatus.SUCCEEDED:
      return { color: 'success', key: 'succeeded' };

    case PaymentStatus.FAILED:
      if (detail === PaymentInfoDetail.PAYMENT_CANCELED) {
        return { color: 'warning', key: 'canceled' };
      }
      if (detail === PaymentInfoDetail.PAYMENT_EXPIRED) {
        return { color: 'error', key: 'failed' };
      }
      return undefined;

    case PaymentStatus.INPROGRESS:
      return { color: 'info', key: 'inprogress' };

    case PaymentStatus.REQUIRED:
    default:
      return undefined;
  }
};

const NotificationPaymentPagoPaDescription: React.FC<Props> = ({ pagoPAItem, isCancelled }) => {
  const statusVisualInfo = getStatusVisualInfo(pagoPAItem.status, pagoPAItem.detail);
  const isMobile = useIsMobile('sm');

  const dataContainerStyle = {
    mb: isMobile ? 1 : 0,
  };
  const dataLabelStyle = {
    mr: isMobile ? 0 : 0.5,
    display: isMobile ? 'block' : 'initial',
  };

  return (
    <Box>
      {pagoPAItem.causaleVersamento && (
        <Typography
          variant="sidenav"
          color="text.primary"
          display={isMobile ? 'block' : 'initial'}
          mb={isMobile ? 0.5 : 0}
        >
          {pagoPAItem.causaleVersamento}
        </Typography>
      )}
      <Box lineHeight="1.4rem" {...dataContainerStyle}>
        <Typography variant="caption" color="text.secondary" {...dataLabelStyle}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.notice-code')}
        </Typography>
        <Typography variant="caption-semibold" color="text.secondary">
          {pagoPAItem.noticeCode}
        </Typography>
      </Box>
      {isCancelled && (
        <Box lineHeight="1.4rem" {...dataContainerStyle}>
          <Typography variant="caption" color="text.secondary" {...dataLabelStyle}>
            {getLocalizedOrDefaultLabel('notifications', 'detail.creditor-tax-id')}
          </Typography>
          <Typography variant="caption-semibold" color="text.secondary" data-testid="creditorTaxId">
            {pagoPAItem.creditorTaxId}
          </Typography>
        </Box>
      )}
      {pagoPAItem.dueDate && (
        <Box lineHeight="1.4rem" {...dataContainerStyle}>
          <Typography variant="caption" color="text.secondary" {...dataLabelStyle}>
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.due')}
          </Typography>
          <Typography variant="caption-semibold" color="text.secondary">
            {formatDate(pagoPAItem.dueDate, false)}
          </Typography>
        </Box>
      )}
      {statusVisualInfo && (
        <Box lineHeight="1.4rem">
          <Typography variant="caption" color="text.secondary" {...dataLabelStyle}>
            {getLocalizedOrDefaultLabel('notifications', 'detail.payment.status.title')}
          </Typography>
          <StatusTooltip
            label={getLocalizedOrDefaultLabel(
              'notifications',
              `detail.payment.status.${statusVisualInfo.key}`
            )}
            color={statusVisualInfo.color}
            tooltip={getLocalizedOrDefaultLabel(
              'notifications',
              `detail.payment.status.${statusVisualInfo.key}-tooltip`
            )}
            tooltipProps={{ placement: 'top' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default NotificationPaymentPagoPaDescription;
