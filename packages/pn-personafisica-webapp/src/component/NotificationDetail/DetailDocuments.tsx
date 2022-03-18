import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Button } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { NotificationDetail } from '@pagopa-pn/pn-commons/src/types/Notifications';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getReceivedNotificationDocument } from '../../redux/notification/actions';
import { RootState } from '../../redux/store';

type Props = {
  notification: NotificationDetail;
};

const DetailDocuments = ({ notification }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche']);

  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );

  const clickHandler = (documentIndex: number) => {
    void dispatch(getReceivedNotificationDocument({ iun: notification.iun, documentIndex }));
  };

  useEffect(() => {
    if (documentDownloadUrl) {
      /* eslint-disable functional/immutable-data */
      const link = document.createElement('a');
      link.href = documentDownloadUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.click();
      /* eslint-enable functional/immutable-data */
    }
  }, [documentDownloadUrl]);

  return (
    <Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography color="text.primary" fontWeight={700} textTransform="uppercase" fontSize={14}>
            {t('Atti Allegati')}
          </Typography>
        </Grid>
        {/* TODO: ripristinare quando sarà completata la issue pn-720 */}
        {/* <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli Atti</Button>
        </Grid> */}
      </Grid>
      {notification.documents.map((d, i) => (
        <Button
          data-testid="documentButton"
          key={d.digests.sha256}
          startIcon={<AttachFileIcon />}
          onClick={() => clickHandler(i)}
        >
          {d.title}
        </Button>
      ))}
    </Fragment>
  );
};

export default DetailDocuments;
