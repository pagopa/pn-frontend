import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, Fragment, ReactNode } from 'react';
import { Grid, Box, Paper, Button, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import {
  NotificationStatus,
  TitleBox,
  // NotificationDetailTableRow,
  NotificationDetailTable,
  NotificationDetailDocuments,
  LegalFactId,
  NotificationDetailTimeline,
  useIsMobile,
  PnBreadcrumb,
} from '@pagopa-pn/pn-commons';
import { Tag, TagGroup } from '@pagopa/mui-italia';

import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  resetState,
} from '../redux/notification/actions';
import { setCancelledIun } from '../redux/newNotification/actions';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

const NotificationDetail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const notification = useAppSelector((state: RootState) => state.notificationState.notification);
  const sender = useAppSelector((state: RootState) => state.userState.user.organization?.id);
  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );

  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
  );
  const unfilteredDetailTableRows: Array<{ label: string; rawValue: string | undefined; value: ReactNode }> = [{
      label: 'Data',
      rawValue: notification.sentAt,
      value: <Box fontWeight={600}>{notification.sentAt}</Box>
    }, {
      label: 'Termini di pagamento',
      rawValue: notification.paymentExpirationDate,
      value: <Box fontWeight={600}>{notification.paymentExpirationDate}</Box>
    }, {
      label: 'Destinatario',
      rawValue: notification.recipients.map(recipient => recipient.denomination).join(", "),
      value:
        notification.recipients.length > 1 ? (
          <Box fontWeight={600}>
            {notification.recipients.map((recipient, i) => (
              <Box key={i}>
                {recipient.taxId} - {recipient.denomination}
              </Box>
            ))}
          </Box>
        ) : (
          <Box fontWeight={600}>{notification.recipients[0]?.taxId}</Box>
        ),
    }, {
    // ...(notification.recipients.length > 1
    //   ? []
    //   : [
    //       {
    //         label: 'Cognome Nome',
    //         rawValue: notification.recipients[0]?.denomination,
    //         value: <Box fontWeight={600}>{notification.recipients[0]?.denomination}</Box>,
    //       },
    //     ]),
      label: 'Nome e cognome',
      rawValue: notification.recipients.map(recipient => recipient.denomination).join(", "),
      value: notification.recipients.map((recipient, index) => <Box key={index}>{recipient.denomination}</Box>)
    }, {
      label: 'Mittente',
      rawValue: sender,
      value: <Box fontWeight={600}>{sender}</Box>
    }, {
      label: 'Codice IUN annullato',
      rawValue: notification.cancelledIun,
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    }, {
      label: 'Codice IUN',
      rawValue: notification.iun,
      value: <Box fontWeight={600}>{notification.iun}</Box>,
    }, {
      label: 'Gruppi',
      rawValue: notification.group,
      value: notification.group && (
        <TagGroup visibleItems={4}>
          <Tag value={notification.group} />
        </TagGroup>
      ),
    },
  ];

  const filteredDetailTableRows = unfilteredDetailTableRows.filter((row) => row.rawValue);

  const detailTableRows = filteredDetailTableRows.map((row, index) => ({
    id: index + 1,
    label: row.label,
    value: row.value,
  }));

  const documentDowloadHandler = (documentIndex: string | undefined) => {
    if (documentIndex) {
      void dispatch(getSentNotificationDocument({ iun: notification.iun, documentIndex }));
    }
  };
  const legalFactDownloadHandler = (legalFact: LegalFactId) => {
    void dispatch(
      getSentNotificationLegalfact({
        iun: notification.iun,
        legalFact: {
          key: legalFact.key.substring(legalFact.key.lastIndexOf('/') + 1),
          category: legalFact.category,
        },
      })
    );
  };
  const dowloadDocument = (url: string) => {
    /* eslint-disable functional/immutable-data */
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.click();
    /* eslint-enable functional/immutable-data */
  };

  const handleCancelNotification = () => {
    dispatch(setCancelledIun(notification.iun));
    navigate(routes.NUOVA_NOTIFICA);
  };

  useEffect(() => {
    if (id) {
      void dispatch(getSentNotification(id));
    }
    return () => void dispatch(resetState());
  }, []);

  useEffect(() => {
    if (documentDownloadUrl) {
      dowloadDocument(documentDownloadUrl);
    }
  }, [documentDownloadUrl]);

  useEffect(() => {
    if (legalFactDownloadUrl) {
      dowloadDocument(legalFactDownloadUrl);
    }
  }, [legalFactDownloadUrl]);

  const breadcrumb = (
    <Fragment>
      <PnBreadcrumb
        linkRoute={routes.DASHBOARD}
        linkLabel={
          <Fragment>
            <EmailIcon sx={{ mr: 0.5 }} />
            Notifiche
          </Fragment>
        }
        currentLocationLabel="Dettaglio notifica"
      />
      <TitleBox variantTitle="h4" title={notification.subject} sx={{ pt: 3, mb: 2 }}></TitleBox>
      {notification.notificationStatus !== NotificationStatus.PAID && (
        <Button
          sx={{ my: 1 }}
          variant="outlined"
          onClick={handleCancelNotification}
          data-testid="cancelNotificationBtn"
        >
          Annulla notifica
        </Button>
      )}
    </Fragment>
  );

  return (
    <Box className={classes.root} sx={{ p: { xs: 3, lg: 0 } }}>
      {isMobile && breadcrumb}
      <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
        <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
          {!isMobile && breadcrumb}
          <Stack spacing={3}>
            <NotificationDetailTable rows={detailTableRows} />
            <Paper sx={{ p: 3, mb: 3 }} className="paperContainer">
              <NotificationDetailDocuments
                title="Atti Allegati"
                documents={notification.documents}
                clickHandler={documentDowloadHandler}
                documentsAvailable={notification.documentsAvailable as boolean}
              />
            </Paper>
          </Stack>
        </Grid>
        <Grid item lg={5} xs={12}>
          <Box sx={{ backgroundColor: 'white', height: '100%', p: 3 }}>
            <NotificationDetailTimeline
              recipients={notification.recipients}
              statusHistory={notification.notificationStatusHistory}
              title="Stato della notifica"
              clickHandler={legalFactDownloadHandler}
              legalFactLabels={{ attestation: 'Attestazione opponibile a terzi', receipt: 'Ricevuta' }}
              historyButtonLabel="Mostra storico"
              showMoreButtonLabel="Mostra di più"
              showLessButtonLabel="Mostra di meno"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationDetail;
