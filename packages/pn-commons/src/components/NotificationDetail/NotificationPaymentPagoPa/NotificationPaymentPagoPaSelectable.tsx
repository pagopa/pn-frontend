import { Box, FormControlLabel, Radio } from '@mui/material';

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
  const isMobile = useIsMobile();

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
      sx={{ alignSelf: isMobile ? 'flex-start' : 'center' }}
    />
  );

  const formLabel = (
    <Box
      id={`label-${radioId}`}
      display="flex"
      flexDirection={isMobile ? 'column-reverse' : 'row'}
      alignItems={isMobile ? 'flex-start' : 'center'}
      justifyContent="space-between"
      width="100%"
    >
      <Box flex={1} display="flex" flexDirection="column" gap={0.5}>
        <NotificationPaymentPagoPaDescription pagoPAItem={pagoPAItem} isCancelled={isCancelled} />
      </Box>
      <NotificationPaymentPagoPaAmount pagoPAItem={pagoPAItem} />
    </Box>
  );

  return (
    <FormControlLabel
      control={formControl}
      label={formLabel}
      labelPlacement="start"
      sx={{
        m: 0,
        width: '100%',
        alignItems: 'flex-start',
        '.MuiFormControlLabel-label': {
          flex: 1,
          display: 'flex',
          width: '100%',
        },
      }}
    />
  );
};

export default NotificationPaymentPagoPaSelectable;
