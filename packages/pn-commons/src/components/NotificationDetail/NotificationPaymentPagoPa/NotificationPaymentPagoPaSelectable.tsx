import { FormControlLabel, Radio, Stack } from '@mui/material';
import { MIBoxedModule } from '@pagopa/mui-italia';

import { useIsMobile } from '../../../hooks/useIsMobile';
import { PagoPAPaymentFullDetails } from '../../../models/NotificationDetail';
import NotificationPaymentPagoPaAmount from './NotificationPaymentPagoPaAmount';
import NotificationPaymentPagoPaDescription from './NotificationPaymentPagoPaDescription';

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  isSelected: boolean;
  isCancelled: boolean;
  handleDeselectPayment: () => void;
};

const NotificationPaymentPagoPaSelectable: React.FC<Props> = ({
  pagoPAItem,
  isSelected,
  isCancelled,
  handleDeselectPayment,
}) => {
  const isMobile = useIsMobile('sm');

  const radioId = `radio-${pagoPAItem.noticeCode}`;

  const formControl = (
    <Radio
      id={radioId}
      inputProps={{ 'aria-labelledby': `label-${radioId}` }}
      data-testid="radio-button"
      checked={isSelected}
      value={pagoPAItem.noticeCode}
      onClick={() => {
        if (isSelected) {
          handleDeselectPayment();
        }
      }}
    />
  );

  const formLabel = (
    <Stack
      id={`label-${radioId}`}
      direction={isMobile ? 'column' : 'row'}
      justifyContent={'space-between'}
      alignItems={isMobile ? 'flex-start' : 'center'}
      rowGap={1}
    >
      <NotificationPaymentPagoPaDescription pagoPAItem={pagoPAItem} isCancelled={isCancelled} />
      <NotificationPaymentPagoPaAmount pagoPAItem={pagoPAItem} isSelectable />
    </Stack>
  );

  return (
    <MIBoxedModule id={`paymentPagoPa-${pagoPAItem.noticeCode}`} data-testid="pagopa-item">
      <FormControlLabel
        control={formControl}
        label={formLabel}
        labelPlacement="start"
        sx={{
          margin: 0,
          alignItems: isMobile ? 'flex-start' : 'center',
          width: '100%',
          justifyContent: 'space-between',
          '& .MuiFormControlLabel-label': {
            width: '100%',
          },
        }}
      />
    </MIBoxedModule>
  );
};

export default NotificationPaymentPagoPaSelectable;
