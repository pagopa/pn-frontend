import { Download } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useIsMobile } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { F24PaymentDetails, PaymentAttachmentSName } from '../../types';

interface Props {
  f24Item: F24PaymentDetails;
  handleDownloadAttachment: (
    name: PaymentAttachmentSName,
    recipientIdx: number,
    attachmentIdx?: number
  ) => void;
}

const NotificationPaymentF24Item: React.FC<Props> = ({ f24Item, handleDownloadAttachment }) => {
  const isMobile = useIsMobile();

  const downloadF24 = () => {
    if (f24Item.recipientIdx) {
      handleDownloadAttachment(
        PaymentAttachmentSName.F24,
        f24Item.recipientIdx,
        f24Item.attachmentIdx
      );
    }
  };
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
        <ButtonNaked color="primary" onClick={downloadF24}>
          <Download fontSize="small" sx={{ mr: 1 }} />
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-f24')}
        </ButtonNaked>
      </Box>
    </Box>
  );
};

export default NotificationPaymentF24Item;
