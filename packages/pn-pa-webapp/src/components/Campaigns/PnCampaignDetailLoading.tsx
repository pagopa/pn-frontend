import { useTranslation } from 'react-i18next';

import { Box, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { MIPaper } from '@pagopa/mui-italia';

const PnCampaignDetailLoading = () => {
  const { t } = useTranslation('campaigns');

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Skeleton
          variant="rounded"
          width={200}
          height={32}
          sx={{ borderRadius: '8px', bgcolor: 'grey.100' }}
        />

        <Skeleton
          variant="rounded"
          width={400}
          height={16}
          sx={{ borderRadius: '16px', bgcolor: 'grey.100' }}
        />
      </Stack>
      <MIPaper padding={24}>
        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Skeleton
                variant="rounded"
                width={120}
                height={14}
                sx={{
                  borderRadius: '8px',
                  bgcolor: 'grey.100',
                }}
              />

              <Skeleton
                variant="rounded"
                width={80}
                height={18}
                sx={{
                  borderRadius: '8px',
                  bgcolor: 'grey.100',
                }}
              />

              <Divider sx={{ my: 2 }} />

              <Skeleton
                variant="rounded"
                width={120}
                height={14}
                sx={{
                  borderRadius: '8px',
                  bgcolor: 'grey.100',
                }}
              />

              <Skeleton
                variant="rounded"
                width={80}
                height={18}
                sx={{
                  borderRadius: '8px',
                  bgcolor: 'grey.100',
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Skeleton
                variant="rounded"
                width={120}
                height={14}
                sx={{
                  borderRadius: '8px',
                  bgcolor: 'grey.100',
                }}
              />

              <Skeleton
                variant="rounded"
                width={80}
                height={18}
                sx={{
                  borderRadius: '8px',
                  bgcolor: 'grey.100',
                }}
              />

              <Divider sx={{ my: 2 }} />

              <Skeleton
                variant="rounded"
                width={120}
                height={14}
                sx={{
                  borderRadius: '8px',
                  bgcolor: 'grey.100',
                }}
              />

              <Skeleton
                variant="rounded"
                width={80}
                height={18}
                sx={{
                  borderRadius: '8px',
                  bgcolor: 'grey.100',
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </MIPaper>
      <Box sx={{ mt: 2 }}>
        <Typography component="h2" variant="h6">
          {t('detail.communications.title')}
        </Typography>
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
    </Stack>
  );
};

export default PnCampaignDetailLoading;
