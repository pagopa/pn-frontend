import { Box, Typography } from '@mui/material';

import { PagoPAPaymentFullDetails } from '../../../models/NotificationDetail';
import { formatDate } from '../../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  isCancelled: boolean;
};

const NotificationPaymentPagoPaDescription: React.FC<Props> = ({ pagoPAItem, isCancelled }) => (
  <Box flexGrow={1}>
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
        <Typography variant="caption-semibold" color="text.secondary" data-testid="creditorTaxId">
          {pagoPAItem.creditorTaxId}
        </Typography>
      </Box>
    )}
    {pagoPAItem.dueDate && (
      <Box lineHeight="1.4rem">
        <Typography variant="caption" color="text.secondary" mr={0.5}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.due')}
        </Typography>
        <Typography variant="caption-semibold" color="text.secondary">
          {formatDate(pagoPAItem.dueDate, false)}
        </Typography>
      </Box>
    )}
  </Box>
);

export default NotificationPaymentPagoPaDescription;
