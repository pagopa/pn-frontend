import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Grid, IconButton, Paper as MIPaper, Typography } from '@mui/material';
import { MIAlert, MIChip } from '@pagopa/mui-italia';

type NotificationTimelineBoxProps = {
  isCancelled: boolean;
  refinementDate: string | null;
  downtimeEvent?: boolean;
};

const NotificationTimelineBox = ({
  isCancelled,
  refinementDate,
  downtimeEvent,
}: NotificationTimelineBoxProps) => {
  console.log('NotificationTimelineBox rendered', refinementDate, downtimeEvent);
  return (
    <MIPaper>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={10} lg={10}>
          <Typography component="h2" variant="h5">
            Stato della timeline
          </Typography>
          <MIChip
            color={isCancelled ? 'warning' : 'success'}
            variant="filled"
            label={isCancelled ? 'Notifica annullata' : 'Notifica a valore di legge'}
            sx={{ my: 1 }}
          />
          <Typography variant="body2">
            L’ente ha annullato l’invio della notifica SEND, che quindi dannullamento non produrrà
            più effetti giuridici.
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
