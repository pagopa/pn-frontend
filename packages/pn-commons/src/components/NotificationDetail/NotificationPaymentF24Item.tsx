import { Download } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import _ from 'lodash';
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
  isF24Ready?: boolean;
}

const NotificationPaymentF24Item: React.FC<Props> = ({
  f24Item,
  handleDownloadAttachment,
  isF24Ready,
}) => {
  const isMobile = useIsMobile();

  // const messages = [
  //   'detail.payment.download-f24-in-progress',
  //   'download-f24-waiting',
  //   'download-f24-ongoing',
  // ];

  const downloadF24 = () => {
    if (!_.isNil(f24Item.recipientIdx)) {
      handleDownloadAttachment(
        PaymentAttachmentSName.F24,
        f24Item.recipientIdx,
        f24Item.attachmentIdx
      );
    }
  };

  const getElement = () => {
    if (isF24Ready) {
      return (
        <ButtonNaked color="primary" onClick={downloadF24} data-testid="download-f24-button">
          <Download fontSize="small" sx={{ mr: 1 }} />
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-f24')}
        </ButtonNaked>
      );
    }

    return (
      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
        <Typography variant="caption" color="text.secondary">
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.download-f24-in-progress')}
        </Typography>
        <CircularProgress size="1.125rem" role="loadingSpinner" sx={{ color: 'text.secondary' }} />
      </Box>
    );
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
      <Box>{getElement()}</Box>
    </Box>
  );
};

export default NotificationPaymentF24Item;
