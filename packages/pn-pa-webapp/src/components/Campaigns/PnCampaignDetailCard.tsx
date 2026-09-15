import { useTranslation } from 'react-i18next';

import { Divider, Grid, Stack, Typography } from '@mui/material';
import { formatDate } from '@pagopa-pn/pn-commons';
import { MIPaper } from '@pagopa/mui-italia';

type CampaignDetailCardProps = {
  creationDate: string;
  campaignId: string;
  serviceName: string;
  communications: number;
  channels: string;
};

const PnCampaignDetailCard = ({
  creationDate,
  campaignId,
  serviceName,
  communications,
  channels,
}: CampaignDetailCardProps) => {
  const { t } = useTranslation('campaigns');

  return (
    <MIPaper padding={24}>
      <Grid container columnSpacing={3}>
        <Grid item xs={12} md={4}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              {t('detail.creation-date')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatDate(creationDate, false)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              {t('detail.communications')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {communications}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              {t('list.id')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {campaignId}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              {t('detail.channels')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {channels}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              {t('detail.service-name')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {serviceName}
            </Typography>

            <Divider sx={{ my: 2 }} />
          </Stack>
        </Grid>
      </Grid>
    </MIPaper>
  );
};

export default PnCampaignDetailCard;
