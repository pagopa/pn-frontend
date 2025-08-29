import { useCallback } from 'react';

import { InfoRounded, Refresh } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { ButtonNaked, CopyToClipboardButton } from '@pagopa/mui-italia';

import { useIsMobile } from '../../../hooks';
import { PagoPAPaymentFullDetails, PaymentInfoDetail } from '../../../models';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import NotificationPaymentPagoPaDescription from './NotificationPaymentPagoPaDescription';

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  handleFetchPaymentsInfo: () => void;
  isCancelled: boolean;
};

const NotificationPaymentPagoPaError: React.FC<Props> = ({
  pagoPAItem,
  handleFetchPaymentsInfo,
  isCancelled,
}) => {
  const isMobile = useIsMobile();

  const getErrorMessage = useCallback((pagoPAItem: PagoPAPaymentFullDetails) => {
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
  }, []);

  return (
    <>
      <Box flex={1} display="flex" flexDirection="column" gap={0.5}>
        <NotificationPaymentPagoPaDescription pagoPAItem={pagoPAItem} isCancelled={isCancelled} />
        {getErrorMessage(pagoPAItem)}
      </Box>
      <Box mb={isMobile ? 1 : 0}>
        <ButtonNaked color="primary" data-testid="reload-button" onClick={handleFetchPaymentsInfo}>
          <Refresh sx={{ width: '20px' }} />
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.reload')}
        </ButtonNaked>
      </Box>
    </>
  );
};

export default NotificationPaymentPagoPaError;
