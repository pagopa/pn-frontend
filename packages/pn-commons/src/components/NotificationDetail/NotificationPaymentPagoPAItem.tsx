import { Box, Radio, Skeleton, Typography } from '@mui/material';
import { useIsMobile } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import {
  ExtRegistriesPaymentDetails,
  PagoPAPaymentDetails,
  PaidDetails,
  PaymentStatus,
} from '../../types/NotificationDetail';
import { formatCurrency } from '../../utils';
import { formatDateString } from '../../utils/date.utility';
import StatusTooltip from '../Notifications/StatusTooltip';

interface Props {
  pagoPAItem: ExtRegistriesPaymentDetails & PagoPAPaymentDetails & PaidDetails;
  loading: boolean;
  isSelected: boolean;
}

const SkeletonCard = () => {
  const isMobile = useIsMobile();
  return (
    <Box
      px={2}
      py={isMobile ? 2 : 1}
      gap={1}
      display="flex"
      alignItems={isMobile ? 'flex-start' : 'center'}
      flexDirection={isMobile ? 'column-reverse' : 'row'}
      sx={{ backgroundColor: '#FAFAFA' }}
    >
      <Box display="flex" gap={1} flexDirection="column" flex="1 0 0">
        <Skeleton
          variant="rounded"
          width="196px"
          height="23px"
          sx={{ ...(isMobile ? { my: 1 } : null), borderRadius: '8px' }}
        />

        <Box lineHeight="1.4rem" display="flex" flexDirection={isMobile ? 'column' : 'row'}>
          <Skeleton
            variant="rounded"
            width="79px"
            height="15px"
            sx={{ ...(isMobile ? { my: 1 } : { mr: 2 }), borderRadius: '8px' }}
          />
          <Skeleton variant="rounded" width="160px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>

        <Box lineHeight="1.4rem">
          <Skeleton variant="rounded" width="137px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={isMobile ? 'space-between' : 'flex-end'}
        gap={1}
        width={isMobile ? '100%' : 'auto'}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Skeleton variant="rounded" width="79px" height="23px" sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rounded" width="120px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>

        <Box display="flex" justifyContent="center">
          <Skeleton variant="circular" width="22px" />
        </Box>
      </Box>
    </Box>
  );
};

const NotificationPaymentPagoPAItem = ({ pagoPAItem, loading, isSelected }: Props) => {
  const isMobile = useIsMobile();

  const getPaymentStatus = () => {
    switch (pagoPAItem.status) {
      case PaymentStatus.REQUIRED:
        return (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent={isMobile ? 'space-between' : 'flex-end'}
            gap={1}
            width={isMobile ? '100%' : 'auto'}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-end"
            >
              <Typography variant="h6" color="primary.main">
                {pagoPAItem.amount && formatCurrency(pagoPAItem.amount)}
              </Typography>
              {pagoPAItem.applyCostFlg && (
                <Typography
                  fontSize="0.625rem"
                  fontWeight="600"
                  lineHeight="0.875rem"
                  color="text.secondary"
                  data-testid="apply-costs-caption"
                >
                  {getLocalizedOrDefaultLabel(
                    'notifications',
                    'detail.payment.included-costs',
                    'Costi di notifica inclusi'
                  )}
                </Typography>
              )}
            </Box>

            <Box display="flex" justifyContent="center">
              <Radio value={JSON.stringify(pagoPAItem)} data-testid="radio-button" />
            </Box>
          </Box>
        );

      case PaymentStatus.SUCCEEDED:
        return (
          <Box display="flex" flexDirection="row">
            {pagoPAItem.amount && (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-end"
                sx={{ mr: 1 }}
              >
                <Typography variant="h6" color="primary.main">
                  {formatCurrency(pagoPAItem.amount)}
                </Typography>
                {pagoPAItem.applyCostFlg && (
                  <Typography
                    fontSize="0.625rem"
                    fontWeight="600"
                    lineHeight="0.875rem"
                    color="text.secondary"
                  >
                    {getLocalizedOrDefaultLabel(
                      'notifications',
                      'detail.payment.included-costs',
                      'Costi di notifica inclusi'
                    )}
                  </Typography>
                )}
              </Box>
            )}
            <StatusTooltip
              label={getLocalizedOrDefaultLabel(
                'notifications',
                'detail.payment.status.succeded',
                'Pagato'
              )}
              color="success"
              tooltip={getLocalizedOrDefaultLabel(
                'notifications',
                'detail.payment.status.succeded-tooltip',
                'Il pagamento è stato inviato correttamente.'
              )}
              tooltipProps={{ placement: 'top' }}
              chipProps={{ borderRadius: '6px' }}
            />
          </Box>
        );

      case PaymentStatus.FAILED:
        return (
          <StatusTooltip
            label={getLocalizedOrDefaultLabel(
              'notifications',
              'detail.payment.status.failed',
              'Scaduto'
            )}
            color="error"
            tooltip={getLocalizedOrDefaultLabel(
              'notifications',
              'detail.payment.status.failed-tooltip',
              'L’avviso è scaduto e non è più possibile pagarlo. Per maggiori informazioni, contatta l’ente mittente.'
            )}
            tooltipProps={{ placement: 'top' }}
            chipProps={{ borderRadius: '6px' }}
          />
        );

      case PaymentStatus.INPROGRESS:
        return (
          <StatusTooltip
            label={getLocalizedOrDefaultLabel(
              'notifications',
              'detail.payment.status.inprogress',
              'In elaborazione'
            )}
            color="info"
            tooltip={getLocalizedOrDefaultLabel(
              'notifications',
              'detail.payment.status.inprogress-tooltip',
              'Il pagamento è in corso. Ricarica la pagina tra qualche ora per verificarlo. Se dovesse risultare ancora in corso, contatta l’assistenza.'
            )}
            tooltipProps={{ placement: 'top' }}
            chipProps={{ borderRadius: '6px' }}
          />
        );
    }
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <Box
      px={2}
      py={isMobile ? 2 : 1}
      gap={1}
      display="flex"
      alignItems={isMobile ? 'flex-start' : 'center'}
      flexDirection={isMobile ? 'column-reverse' : 'row'}
      sx={{
        backgroundColor: isSelected ? 'rgba(107, 207, 251, 0.08)' : 'grey.50',
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
        {pagoPAItem.causaleVersamento && (
          <Typography variant="sidenav" color="text.primary">
            {pagoPAItem.causaleVersamento}
          </Typography>
        )}

        <Box lineHeight="1.4rem">
          <Typography variant="caption" color="text.secondary" mr={0.5}>
            {getLocalizedOrDefaultLabel(
              'notifications',
              'detail.payment.notice-code',
              'Codice avviso'
            )}
          </Typography>
          <Typography variant="caption-semibold" color="text.secondary">
            {pagoPAItem.noticeCode}
          </Typography>
        </Box>

        {pagoPAItem.dueDate && (
          <Box lineHeight="1.4rem">
            <Typography variant="caption" color="text.secondary" mr={0.5}>
              {getLocalizedOrDefaultLabel('notifications', 'detail.payment.due', 'Scade il')}
            </Typography>
            <Typography variant="caption-semibold" color="text.secondary">
              {formatDateString(pagoPAItem.dueDate)}
            </Typography>
          </Box>
        )}
      </Box>

      {getPaymentStatus()}
    </Box>
  );
};

export default NotificationPaymentPagoPAItem;
