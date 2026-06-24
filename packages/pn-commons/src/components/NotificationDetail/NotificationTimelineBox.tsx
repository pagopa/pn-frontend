import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Grid, IconButton, Typography } from '@mui/material';
import { MIAlert, MIChip, MIPaper } from '@pagopa/mui-italia';

const NotificationTimelineBox = () => {
  console.log('NotificationTimelineBox rendered');
  return (
    <MIPaper padding={24}>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={10} lg={10}>
          <Typography component="h2" variant="h5">
            Stato della timeline
          </Typography>
          <MIChip
            color="success"
            variant="filled"
            label="Notifica a valore di legge"
            sx={{ my: 1 }}
          />
          <Typography variant="body1">
            Hai effettuato un accesso alla notifica, che si è quindi perfezionata il giorno
            DD/MM/YYYY.
          </Typography>
          <MIAlert
            title="Disservizi"
            severity="warning"
            description="Disservizio iniziato il 11/06/2026 e non ancora concluso sulle seguenti funzionalità: Invio delle notifiche. L'attestazione sarà disponibile al termine del disservizio."
            sx={{ mt: 2 }}
          />
        </Grid>
        <Grid item xs={2} lg={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton size="small" aria-label="Vai alla timeline" onClick={() => {}}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>
    </MIPaper>
  );
};

export default NotificationTimelineBox;
