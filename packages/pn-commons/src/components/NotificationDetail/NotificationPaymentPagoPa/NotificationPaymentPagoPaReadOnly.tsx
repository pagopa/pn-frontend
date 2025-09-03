import { useCallback } from 'react';

import { Stack } from '@mui/material';

import { useIsMobile } from '../../../hooks';
import { PagoPAPaymentFullDetails, PaymentInfoDetail, PaymentStatus } from '../../../models';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import StatusTooltip from '../../Notifications/StatusTooltip';
import NotificationPaymentPagoPaAmount from './NotificationPaymentPagoPaAmount';
import NotificationPaymentPagoPaDescription from './NotificationPaymentPagoPaDescription';

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  isCancelled: boolean;
};

type StatusVisualInfo = {
  color: 'warning' | 'error' | 'success' | 'info';
  key: string;
};

const NotificationPaymentPagoPaReadOnly: React.FC<Props> = ({ pagoPAItem, isCancelled }) => {
  const isMobile = useIsMobile();

  const getStatusVisualInfo = useCallback(
    (status: PaymentStatus, detail?: PaymentInfoDetail): StatusVisualInfo | undefined => {
      switch (status) {
        case PaymentStatus.SUCCEEDED:
          return { color: 'success', key: 'succeeded' };

        case PaymentStatus.FAILED:
          if (detail === PaymentInfoDetail.PAYMENT_CANCELED) {
            return { color: 'warning', key: 'canceled' };
          }
          return { color: 'error', key: 'failed' };

        case PaymentStatus.INPROGRESS:
          return { color: 'info', key: 'inprogress' };

        case PaymentStatus.REQUIRED:
        default:
          return undefined;
      }
    },
    []
  );
  const statusVisualInfo = getStatusVisualInfo(pagoPAItem.status, pagoPAItem.detail);

  return (
    <>
      <NotificationPaymentPagoPaDescription pagoPAItem={pagoPAItem} isCancelled={isCancelled} />
      <Stack
        direction="row"
        spacing={isMobile ? 1 : 1.5}
        alignItems="center"
        justifyContent={isMobile ? 'space-between' : 'flex-end'}
        width={isMobile ? '100%' : 'auto'}
        mb={isMobile ? 1 : 0}
      >
        <NotificationPaymentPagoPaAmount pagoPAItem={pagoPAItem} />
        {statusVisualInfo && (
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
            chipProps={{ borderRadius: '6px' }}
          />
        )}
      </Stack>
    </>
  );
};

export default NotificationPaymentPagoPaReadOnly;
