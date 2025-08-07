import { InfoRounded, Refresh } from '@mui/icons-material';
import {
  Box,
  FormControlLabel,
  Radio,
  RadioProps,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ButtonNaked, CopyToClipboardButton } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import {
  EventPaymentRecipientType,
  PagoPAPaymentFullDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../models';
import { formatEurocentToCurrency } from '../../utility';
import { formatDate } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import StatusTooltip from '../Notifications/StatusTooltip';

type PaymentItemContainerProps = {
  id: string;
  isSelected: boolean;
  children: React.ReactNode;
  enableLayout?: boolean;
};

const PaymentItemContainer: React.FC<PaymentItemContainerProps> = ({
  id,
  isSelected,
  children,
  enableLayout = false,
}) => {
  const isMobile = useIsMobile();

  return (
    <Box
      id={id}
      data-testid="PaymentItem"
      px={2}
      py={isMobile ? 2 : 1}
      sx={{
        backgroundColor: isSelected ? 'rgba(107, 207, 251, 0.08)' : 'grey.50',
        borderRadius: '6px',
        ...(isMobile && { position: 'relative' }),
        ...(enableLayout && {
          display: 'flex',
          flexDirection: isMobile ? 'column-reverse' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
        }),
      }}
    >
      {children}
    </Box>
  );
};

type Props = {
  pagoPAItem: PagoPAPaymentFullDetails;
  loading: boolean;
  isSelected: boolean;
  handleFetchPaymentsInfo: () => void;
  handleDeselectPayment: () => void;
  isSinglePayment?: boolean;
  isCancelled: boolean;
  handleTrackEventDetailPaymentError?: (event: EventPaymentRecipientType, param?: object) => void;
  slotProps?: {
    radio?: RadioProps;
  };
};

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
      data-testid="skeleton-card"
    >
      <Box display="flex" gap={1} flexDirection="column" flex="1 0 0">
        <Skeleton variant="rounded" width="196px" height="23px" sx={{ borderRadius: '8px' }} />
        <Box lineHeight="1.4rem" display="flex" flexDirection={isMobile ? 'column' : 'row'}>
          <Skeleton
            variant="rounded"
            width="79px"
            height="15px"
            sx={{ borderRadius: '8px', mr: isMobile ? 0 : 2, my: isMobile ? 1 : 0 }}
          />
          <Skeleton variant="rounded" width="160px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>
        <Skeleton variant="rounded" width="137px" height="15px" sx={{ borderRadius: '8px' }} />
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Skeleton variant="rounded" width="79px" height="23px" sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rounded" width="120px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>
        <Skeleton variant="circular" width="22px" height="22px" />
      </Box>
    </Box>
  );
};

const PagoPADescription = ({
  pagoPAItem,
  isCancelled,
}: {
  pagoPAItem: PagoPAPaymentFullDetails;
  isCancelled: boolean;
}) => (
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
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.due', 'Scade il')}
        </Typography>
        <Typography variant="caption-semibold" color="text.secondary">
          {formatDate(pagoPAItem.dueDate, false)}
        </Typography>
      </Box>
    )}
  </Box>
);

const PagoPAAmountLabel = ({
  pagoPAItem,
  forceLeftAlign = false,
}: {
  pagoPAItem: PagoPAPaymentFullDetails;
  forceLeftAlign?: boolean;
}) => {
  const isMobile = useIsMobile();
  const align = isMobile || forceLeftAlign ? 'flex-start' : 'flex-end';
  return (
    <Box mr={1} display="flex" flexDirection="column" alignItems={align} mb={isMobile ? 1 : 0}>
      <Typography
        variant="body2"
        fontSize="24px"
        fontWeight={600}
        color="primary.main"
        data-testid="payment-amount"
      >
        {formatEurocentToCurrency(pagoPAItem.amount || 0)}
      </Typography>
      {pagoPAItem.applyCost && (
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

const getErrorMessage = (pagoPAItem: PagoPAPaymentFullDetails) => {
  switch (pagoPAItem.detail) {
    case PaymentInfoDetail.GENERIC_ERROR:
    case PaymentInfoDetail.PAYMENT_DUPLICATED: {
      const isGenericError = pagoPAItem.detail === PaymentInfoDetail.GENERIC_ERROR;
      return (
        <Box display="flex" alignItems="center" gap={0.5}>
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
        <Box display="flex" alignItems="flex-start" gap={0.25}>
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
};

const renderError = (
  pagoPAItem: PagoPAPaymentFullDetails,
  handleFetchPaymentsInfo: () => void,
  handleTrackEventDetailPaymentError?: (event: EventPaymentRecipientType, param?: object) => void,
  isSelected?: boolean,
  isCancelled?: boolean,
  isMobile?: boolean
) => {
  if (handleTrackEventDetailPaymentError) {
    handleTrackEventDetailPaymentError(EventPaymentRecipientType.SEND_PAYMENT_DETAIL_ERROR, {
      detail: pagoPAItem.detail,
      errorCode: pagoPAItem.errorCode,
    });
  }

  return (
    <PaymentItemContainer
      id={`paymentPagoPa-${pagoPAItem.noticeCode}`}
      isSelected={!!isSelected}
      enableLayout={true}
    >
      <Box flex={1} display="flex" flexDirection="column" gap={0.5}>
        <PagoPADescription pagoPAItem={pagoPAItem} isCancelled={!!isCancelled} />
        {getErrorMessage(pagoPAItem)}
      </Box>
      <Box mb={isMobile ? 1 : 0}>
        <ButtonNaked color="primary" data-testid="reload-button" onClick={handleFetchPaymentsInfo}>
          <Refresh sx={{ width: '20px' }} />
          {getLocalizedOrDefaultLabel('notifications', 'detail.payment.reload')}
        </ButtonNaked>
      </Box>
    </PaymentItemContainer>
  );
};

const renderSelectableItem = (
  pagoPAItem: PagoPAPaymentFullDetails,
  isSelected: boolean,
  handleDeselectPayment: () => void,
  isSinglePayment: boolean | undefined,
  isMobile: boolean,
  isCancelled: boolean
) => {
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
        <PagoPADescription pagoPAItem={pagoPAItem} isCancelled={isCancelled} />
        {getErrorMessage(pagoPAItem)}
      </Box>
      <PagoPAAmountLabel pagoPAItem={pagoPAItem} forceLeftAlign={isSinglePayment} />
    </Box>
  );

  return (
    <PaymentItemContainer id={`paymentPagoPa-${pagoPAItem.noticeCode}`} isSelected={isSelected}>
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
    </PaymentItemContainer>
  );
};

type StatusVisualInfo = {
  color: 'warning' | 'error' | 'success' | 'info';
  key: string;
};

const getStatusVisualInfo = (
  status: PaymentStatus,
  detail?: PaymentInfoDetail
): StatusVisualInfo | undefined => {
  switch (status) {
    case PaymentStatus.SUCCEEDED:
      return { color: 'success', key: 'succeeded' };

    case PaymentStatus.FAILED:
      if (detail === PaymentInfoDetail.PAYMENT_CANCELED) {
        return { color: 'warning', key: 'canceled' };
      }
      return { color: 'error', key: 'failed' };

    case PaymentStatus.INPROGRESS:
      return { color: 'info', key: 'inprogress' };

    case PaymentStatus.REQUIRED:
    default:
      return undefined;
  }
};

const renderReadOnlyItem = (
  pagoPAItem: PagoPAPaymentFullDetails,
  isSelected: boolean,
  isCancelled: boolean,
  isMobile: boolean
) => {
  const statusVisualInfo = getStatusVisualInfo(pagoPAItem.status, pagoPAItem.detail);

  return (
    <PaymentItemContainer
      id={`paymentPagoPa-${pagoPAItem.noticeCode}`}
      isSelected={isSelected}
      enableLayout
    >
      <PagoPADescription pagoPAItem={pagoPAItem} isCancelled={isCancelled} />
      <Stack
        direction="row"
        spacing={isMobile ? 1 : 1.5}
        alignItems="center"
        justifyContent={isMobile ? 'space-between' : 'flex-end'}
        width={isMobile ? '100%' : 'auto'}
        mb={isMobile ? 1 : 0}
      >
        <PagoPAAmountLabel pagoPAItem={pagoPAItem} forceLeftAlign={isMobile} />
        {statusVisualInfo && (
          <StatusTooltip
            label={getLocalizedOrDefaultLabel(
              'notifications',
              `detail.payment.status.${statusVisualInfo.key}`
            )}
            color={statusVisualInfo.color}
            tooltip={getLocalizedOrDefaultLabel(
              'notifications',
              `detail.payment.status.${statusVisualInfo.key}-tooltip`
            )}
            tooltipProps={{ placement: 'top' }}
            chipProps={{ borderRadius: '6px' }}
          />
        )}
      </Stack>
    </PaymentItemContainer>
  );
};

const NotificationPaymentPagoPAItem: React.FC<Props> = ({
  pagoPAItem,
  loading,
  isSelected,
  handleFetchPaymentsInfo,
  handleDeselectPayment,
  isSinglePayment,
  isCancelled,
  handleTrackEventDetailPaymentError,
}) => {
  const isMobile = useIsMobile();

  if (loading) {
    return <SkeletonCard />;
  }

  const isError =
    pagoPAItem.status === PaymentStatus.FAILED &&
    pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_CANCELED &&
    pagoPAItem.detail !== PaymentInfoDetail.PAYMENT_EXPIRED;

  if (isError) {
    return renderError(
      pagoPAItem,
      handleFetchPaymentsInfo,
      handleTrackEventDetailPaymentError,
      isSelected,
      isCancelled,
      isMobile
    );
  }

  const isSelectable = pagoPAItem.status === PaymentStatus.REQUIRED && !isSinglePayment;

  if (isSelectable) {
    return renderSelectableItem(
      pagoPAItem,
      isSelected,
      handleDeselectPayment,
      isSinglePayment,
      isMobile,
      isCancelled
    );
  }

  return renderReadOnlyItem(pagoPAItem, isSelected, isCancelled, isMobile);
};

export default NotificationPaymentPagoPAItem;
