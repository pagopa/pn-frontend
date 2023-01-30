import { Fragment } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { AppStatusData } from '../../types';

type Props = {
  appStatus: AppStatusData;
};

const NotificationRelatedDowntimes = (props: Props) => {
  const title = "DISSERVIZI";

  if (props.appStatus.downtimeLogPage) {
    console.log(props.appStatus.downtimeLogPage);
  }

  return <Fragment>
    <Grid
      key={'downtimes-section'}
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid key={'downtimes-section-title'} item sx={{ mb: 3 }}>
        <Typography
          color="text.primary"
          variant="overline"
          fontWeight={700}
          textTransform="uppercase"
          fontSize={14}
        >
          {title}
        </Typography>
      </Grid>
    </Grid>
    { props.appStatus && props.appStatus.downtimeLogPage && 
      <Grid key={'detail-documents-message'} item>
        <Stack direction="row">
          <div>Trovati {props.appStatus.downtimeLogPage?.downtimes.length} disservizi</div>
          {/* {downloadFilesMessage && (
            <Typography variant="body2" sx={{ mb: 3 }}>
              {downloadFilesMessage}
            </Typography>
          )} */}
        </Stack>
      </Grid>
    }
    {/* <Grid key={'download-files-section'} item>
      {documents && mapOtherDocuments(documents)}
    </Grid> */}
  </Fragment>;
};

export default NotificationRelatedDowntimes;