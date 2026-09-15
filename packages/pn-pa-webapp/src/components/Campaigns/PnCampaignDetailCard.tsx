import { Divider, Grid, Stack, Typography } from '@mui/material';
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
}: CampaignDetailCardProps) => (
  <MIPaper padding={24}>
    <Grid container columnSpacing={3}>
      <Grid item xs={12} md={4}>
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Data di creazione
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {creationDate}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Comunicazioni
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {communications}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Codice ID
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {campaignId}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Canali selezionati
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {channels}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Servizio
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

export default PnCampaignDetailCard;
