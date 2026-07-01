import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton, Stack, Typography } from '@mui/material';
import { MIChip, MIPaper } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';

type NotificationTimelineBoxProps = {
  isCancelled: boolean;
  timelineSummary: string;
};

const NotificationTimelineBox = ({
  isCancelled,
  timelineSummary,
}: NotificationTimelineBoxProps) => {
  const isMobile = useIsMobile('sm');
  console.log('isMobile', isMobile);
  return (
    <MIPaper padding={24}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
        <Stack width="85%">
          <Typography component="h2" variant="h5" sx={{ mb: 1 }}>
            Stato della timeline
          </Typography>
          <MIChip
            color={isCancelled ? 'warning' : 'success'}
            variant="filled"
            label={isCancelled ? 'Notifica annullata' : 'Notifica a valore di legge'}
            sx={{ my: 1, width: 'fit-content' }}
          />
          {!isMobile && <Typography variant="body2">{timelineSummary}</Typography>}
        </Stack>
        <IconButton size="small" aria-label="Vai alla timeline" onClick={() => {}}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>
    </MIPaper>
  );
};

export default NotificationTimelineBox;
