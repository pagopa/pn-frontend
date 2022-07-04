import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, Fragment, ReactNode, useState } from 'react';
import {
  Grid,
  Box,
  Paper,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import {
  // PN-1714
  // NotificationStatus,
  TitleBox,
  NotificationDetailTableRow,
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
  const documentDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.documentDownloadUrl
  );
  const legalFactDownloadUrl = useAppSelector(
    (state: RootState) => state.notificationState.legalFactDownloadUrl
  );
  const unfilteredDetailTableRows: Array<{
    label: string;
    rawValue: string | undefined;
    value: ReactNode;
  }> = [
    {
      label: 'Data',
      rawValue: notification.sentAt,
      value: <Box fontWeight={600}>{notification.sentAt}</Box>,
    },
    {
      label: 'Da pagare entro il',
      rawValue: notification.paymentExpirationDate,
      value: (
        <Box fontWeight={600} display="inline">
          {notification.paymentExpirationDate}
        </Box>
      ),
    },
    {
      label: 'Codice Fiscale destinatario',
      rawValue: notification.recipients.map((recipient) => recipient.denomination).join(', '),
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
    },
    {
      label: 'Nome e cognome',
      rawValue: notification.recipients.map((recipient) => recipient.denomination).join(', '),
      value: notification.recipients.map((recipient, index) => (
        <Box key={index}>{recipient.denomination}</Box>
      )),
    },
    {
      label: 'Mittente',
      rawValue: notification.senderDenomination,
      value: <Box fontWeight={600}>{notification.senderDenomination}</Box>,
    },
    {
      label: 'Codice IUN annullato',
      rawValue: notification.cancelledIun,
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    },
    {
      label: 'Codice IUN',
      rawValue: notification.iun,
      value: <Box fontWeight={600}>{notification.iun}</Box>,
    },
    {
      label: 'Gruppi',
      rawValue: notification.group,
      value: notification.group && (
        <TagGroup visibleItems={4}>
          <Tag value={notification.group} />
        </TagGroup>
      ),
    },
  ];
  const detailTableRows: Array<NotificationDetailTableRow> = unfilteredDetailTableRows
    .filter((row) => row.rawValue)
    .map((row, index) => ({
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

  // PN-1714
  /*
  const openModal = () => {
    setShowModal(true);
  };
  */

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
      <TitleBox
        variantTitle="h4"
        title={notification.subject}
        sx={{
          pt: 3,
          mb: {
            xs: 3,
            md: 4,
          },
        }}
        mbTitle={0}
      ></TitleBox>
      {
        // PN-1714
        /*
        <TitleBox variantTitle="h4" title={notification.subject} sx={{
          pt: 3,
          mb: notification.notificationStatus !== NotificationStatus.PAID ? 2 : {
            xs: 3,
            md: 4,
          },
        }}
        mbTitle={0}></TitleBox>
        notification.notificationStatus !== NotificationStatus.PAID && (
        <Button
          sx={{
            mb: {
              xs: 3,
              md: 4,
            },
          }}
          variant="outlined"
          onClick={openModal}
          data-testid="cancelNotificationBtn"
        >
          Annulla notifica
        </Button>
        )
        */
      }
    </Fragment>
  );

  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalCloseAndProceed = () => {
    setShowModal(false);
    handleCancelNotification();
  };

  const ModalAlert = () => (
    <Dialog
      open={showModal}
      data-testid="modalId"
      onClose={handleModalClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title" sx={{ p: 4 }}>
        Ci siamo quasi
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 4 }}>
        <DialogContentText id="dialog-description">
          Per completare l’annullamento, devi inviare una nuova notifica che sostituisca la
          precedente.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4 }}>
        <Button onClick={handleModalClose} variant="outlined" data-testid="modalCloseBtnId">
          Indietro
        </Button>
        <Button
          onClick={handleModalCloseAndProceed}
          variant="contained"
          data-testid="modalCloseAndProceedBtnId"
        >
          Invia una nuova notifica
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Box className={classes.root} sx={{ p: { xs: 3, lg: 0 } }}>
        {isMobile && breadcrumb}
        <Grid container direction={isMobile ? 'column-reverse' : 'row'} spacing={isMobile ? 3 : 0}>
          <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
            {!isMobile && breadcrumb}
            <Stack spacing={3}>
              <NotificationDetailTable rows={detailTableRows} />
              <Paper sx={{ p: 3, mb: 3 }} className="paperContainer">
                <NotificationDetailDocuments
                  title="Documenti allegati"
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
                legalFactLabels={{
                  attestation: 'Attestazione opponibile a terzi',
                  receipt: 'Ricevuta',
                }}
                historyButtonLabel="Mostra storico"
                showMoreButtonLabel="Mostra di più"
                showLessButtonLabel="Mostra di meno"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ModalAlert />
    </>
  );
};

export default NotificationDetail;
