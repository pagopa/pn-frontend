import { Divider, Grid, Stack, Typography } from '@mui/material';
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
}: CampaignDetailCardProps) => (
  <MIPaper padding={24}>
    <Grid container columnSpacing={3} rowSpacing={2}>
      <Grid item xs={12} md={6}>
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Data di creazione
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {creationDate}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} md={6}>
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Codice ID
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {campaignId}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Servizio
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {serviceName}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} md={6}>
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Canali selezionati
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {channels}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  </MIPaper>
);

export default PnCampaignDetailCard;
