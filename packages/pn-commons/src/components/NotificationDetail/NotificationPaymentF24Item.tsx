import { Download } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useIsMobile } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { F24PaymentDetails } from '../../types';

interface Props {
  f24Item: F24PaymentDetails;
  loading: boolean;
}

const NotificationPaymentF24Item: React.FC<Props> = ({ f24Item, loading }) => {
  console.log(loading);
  const isMobile = useIsMobile();
  return (
    <Box
      p={2}
      gap={1}
      display="flex"
      alignItems="center"
      alignSelf="stretch"
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
        {f24Item.title && (
          <Typography variant="sidenav" color="text.primary">
            {f24Item.title}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          PDF
        </Typography>
      </Box>
      <Box>
        <ButtonNaked color="primary">
          <Download fontSize="small" sx={{ mr: 1 }} />
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-f24')}
        </ButtonNaked>
      </Box>
    </Box>
  );
};

export default NotificationPaymentF24Item;
