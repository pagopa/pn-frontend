import { useTranslation } from 'react-i18next';

import { Divider, Grid, Stack, Typography } from '@mui/material';
import { formatDate } from '@pagopa-pn/pn-commons';
import { MIPaper } from '@pagopa/mui-italia';

type CampaignDetailCardProps = {
  creationDate: string;
  campaignId: string;
  serviceName: string;
  channels: string;
};

const PnCampaignDetailCard = ({
  creationDate,
  campaignId,
  serviceName,
  channels,
}: CampaignDetailCardProps) => {
  const { t } = useTranslation('campaigns');

  return (
    <MIPaper padding={24}>
      <Grid container columnSpacing={3}>
        <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              {t('detail.creation-date')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatDate(creationDate, false)}
            </Typography>

            <Divider sx={{ my: 2 }} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              {t('list.id')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {campaignId}
            </Typography>

            <Divider sx={{ my: 2 }} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6} order={{ xs: 3, md: 3 }}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              {t('detail.service-name')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {serviceName}
            </Typography>

            <Divider sx={{ my: 2, display: { xs: 'block', md: 'none' } }} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6} order={{ xs: 4, md: 4 }}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              {t('detail.channels-label')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {channels}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </MIPaper>
  );
};

export default PnCampaignDetailCard;
