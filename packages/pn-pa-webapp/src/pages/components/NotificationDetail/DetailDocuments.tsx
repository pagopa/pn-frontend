import { Fragment, useEffect } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { NotificationDetail } from '../../../redux/notification/types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getSentNotificationDocument } from '../../../redux/notification/actions';
import { RootState } from '../../../redux/store';


type Props = {
  notification: NotificationDetail;
};

const DetailDocuments = ({ notification }: Props) => {
  const dispatch = useAppDispatch();
  const documentDownloadUrl = useAppSelector((state: RootState) => state.notificationState.documentDownloadUrl);
  
  const clickHandler = (documentIndex: number) => {
    void dispatch(getSentNotificationDocument({iun: notification.iun, documentIndex}));
  };

  useEffect(() => {
    if (documentDownloadUrl) {
      window.location.assign(documentDownloadUrl);
    }
  }, [documentDownloadUrl]);

  return (
    <Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography color="text.primary" fontWeight={700} textTransform="uppercase" fontSize={14}>
            Atti Allegati
          </Typography>
        </Grid>
        {/* TODO: ripristinare quando sarà completata la issue pn-720 */}
        {/* <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli Atti</Button>
        </Grid> */}
      </Grid>
      {notification.documents.map((d, i) => (
        <Button data-testid="documentButton" key={d.digests.sha256} startIcon={<AttachFileIcon />} onClick={() => clickHandler(i)}>
          {d.title}
        </Button>
      ))}
    </Fragment>
  );
};

export default DetailDocuments;
