import { Stack } from '@mui/material';
import { MIBoxedModule } from '@pagopa/mui-italia';

import { useIsMobile } from '../../../hooks/useIsMobile';
import { PagoPAPaymentFullDetails } from '../../../models/NotificationDetail';
import NotificationPaymentPagoPaAmount from './NotificationPaymentPagoPaAmount';
import NotificationPaymentPagoPaDescription from './NotificationPaymentPagoPaDescription';

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  isCancelled: boolean;
};

const NotificationPaymentPagoPaReadOnly: React.FC<Props> = ({ pagoPAItem, isCancelled }) => {
  const isMobile = useIsMobile('sm');

  return (
    <MIBoxedModule id={`paymentPagoPa-${pagoPAItem.noticeCode}`} data-testid="pagopa-item">
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent={'space-between'}
        alignItems={isMobile ? 'flex-start' : 'center'}
        flexGrow={1}
        rowGap={1}
      >
        <NotificationPaymentPagoPaDescription pagoPAItem={pagoPAItem} isCancelled={isCancelled} />
        <NotificationPaymentPagoPaAmount pagoPAItem={pagoPAItem} />
      </Stack>
    </MIBoxedModule>
  );
};

export default NotificationPaymentPagoPaReadOnly;
