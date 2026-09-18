import { Divider, Grid, Skeleton, Stack } from '@mui/material';
import { MIPaper } from '@pagopa/mui-italia';

const PnCampaignDetailLoading = () => (
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
        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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
  </Stack>
);

export default PnCampaignDetailLoading;
