import { FC } from 'react';

import { Box, Skeleton } from '@mui/material';
import { MIBoxedModule } from '@pagopa/mui-italia';

import { useIsMobile } from '../../../hooks/useIsMobile';

const PaymentSkeleton: FC = () => {
  const isMobile = useIsMobile();
  return (
    <Box
      gap={1}
      display="flex"
      alignItems={isMobile ? 'flex-start' : 'center'}
      flexDirection={isMobile ? 'column-reverse' : 'row'}
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
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={isMobile ? 'space-between' : 'flex-end'}
        gap={1}
        width={isMobile ? '100%' : 'auto'}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Skeleton variant="rounded" width="79px" height="23px" sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rounded" width="120px" height="15px" sx={{ borderRadius: '8px' }} />
        </Box>
        <Skeleton variant="circular" width="22px" height="22px" />
      </Box>
    </Box>
  );
};

const NotificationPaymentPagoPaLoading: FC = () => (
  <MIBoxedModule
    loading
    slots={{
      skeleton: PaymentSkeleton,
    }}
  />
);

export default NotificationPaymentPagoPaLoading;
