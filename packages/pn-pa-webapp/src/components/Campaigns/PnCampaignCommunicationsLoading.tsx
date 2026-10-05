import { useTranslation } from 'react-i18next';

import { Box, Grid, Skeleton, Typography } from '@mui/material';

const PnCampaignCommunicationsLoading = () => {
  const { t } = useTranslation('campaigns');

  return (
    <Box data-testid="campaignCommunicationsLoading">
      <Grid
        container
        sx={{
          mt: 3,
          px: 3,
          py: 3,
          bgcolor: 'grey.100',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <Grid item xs={3}>
          <Typography variant="body2" fontWeight={600}>
            {t('detail.communications.tax-id')}
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body2" fontWeight={600}>
            {t('detail.communications.iun')}
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body2" fontWeight={600}>
            {t('detail.communications.status')}
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body2" fontWeight={600}>
            {t('detail.communications.outcome')}
          </Typography>
        </Grid>
      </Grid>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid
          key={index}
          container
          alignItems="center"
          sx={{
            px: 3,
            py: 2,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Grid item xs={3}>
            <Skeleton variant="rounded" width={140} height={16} sx={{ borderRadius: '8px' }} />
          </Grid>

          <Grid item xs={3}>
            <Skeleton variant="rounded" width={160} height={16} sx={{ borderRadius: '8px' }} />
          </Grid>

          <Grid item xs={3}>
            <Skeleton variant="rounded" width={100} height={16} sx={{ borderRadius: '8px' }} />
          </Grid>

          <Grid item xs={1}>
            <Skeleton variant="rounded" width={120} height={16} sx={{ borderRadius: '8px' }} />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default PnCampaignCommunicationsLoading;
