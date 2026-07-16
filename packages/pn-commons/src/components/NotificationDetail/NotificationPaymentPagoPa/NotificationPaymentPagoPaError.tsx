import { InfoRounded, Refresh } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { CopyToClipboardButton, MIBoxedModule, MIButton } from '@pagopa/mui-italia';

import { PagoPAPaymentFullDetails, PaymentInfoDetail } from '../../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import NotificationPaymentPagoPaDescription from './NotificationPaymentPagoPaDescription';

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  handleFetchPaymentsInfo: () => void;
  isCancelled: boolean;
};

const getErrorMessage = (pagoPAItem: PagoPAPaymentFullDetails) => {
  switch (pagoPAItem.detail) {
    case PaymentInfoDetail.GENERIC_ERROR:
    case PaymentInfoDetail.PAYMENT_DUPLICATED: {
      const isGenericError = pagoPAItem.detail === PaymentInfoDetail.GENERIC_ERROR;
      return (
        <Box display="flex" alignItems="center" gap={0.5} data-testid="error-container">
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
        <Box display="flex" alignItems="flex-start" gap={0.25} data-testid="error-container">
          <InfoRounded sx={{ color: 'error.dark', width: '16px', height: '16px' }} />
          <Box data-testid="assistence-error-message">
            <Typography color="error.dark" fontSize="12px" lineHeight="12px" fontWeight="600">
              {getLocalizedOrDefaultLabel('notifications', 'detail.payment.error.notice-error')}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
              <Typography color="error.dark" fontSize="12px" lineHeight="12px" fontWeight="600">
                {`${getLocalizedOrDefaultLabel(
                  'notifications',
                  'detail.payment.error.assistence'
                )} ${pagoPAItem.detail_v2}`}
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

const NotificationPaymentPagoPaError: React.FC<Props> = ({
  pagoPAItem,
  handleFetchPaymentsInfo,
  isCancelled,
}) => (
  <MIBoxedModule
    action={
      <MIButton
        variant="text"
        data-testid="reload-button"
        onClick={handleFetchPaymentsInfo}
        startIcon={<Refresh />}
      >
        {getLocalizedOrDefaultLabel('notifications', 'detail.payment.reload')}
      </MIButton>
    }
    direction="horizontal"
    data-testid="pagopa-item"
  >
    <NotificationPaymentPagoPaDescription pagoPAItem={pagoPAItem} isCancelled={isCancelled} />
    {getErrorMessage(pagoPAItem)}
  </MIBoxedModule>
);

export default NotificationPaymentPagoPaError;
