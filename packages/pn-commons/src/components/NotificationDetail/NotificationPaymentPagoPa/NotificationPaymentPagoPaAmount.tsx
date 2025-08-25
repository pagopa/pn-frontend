import { Box, Typography } from '@mui/material';

import { useIsMobile } from '../../../hooks';
import { PagoPAPaymentFullDetails } from '../../../models';
import { formatEurocentToCurrency } from '../../../utility';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
};

const NotificationPaymentPagoPaAmount: React.FC<Props> = ({ pagoPAItem }) => {
  const isMobile = useIsMobile();
  const align = isMobile ? 'flex-start' : 'flex-end';

  return (
    <Box mr={1} display="flex" flexDirection="column" alignItems={align} mb={isMobile ? 1 : 0}>
      {pagoPAItem.amount && (
        <Typography
          variant="body2"
          fontSize="24px"
          fontWeight={600}
          color="primary.main"
          data-testid="payment-amount"
        >
          {formatEurocentToCurrency(pagoPAItem.amount)}
        </Typography>
      )}
      {pagoPAItem.amount && pagoPAItem.applyCost && (
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
  );
};

export default NotificationPaymentPagoPaAmount;
