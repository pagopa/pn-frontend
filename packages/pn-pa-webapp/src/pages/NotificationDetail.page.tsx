import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, Fragment, ReactNode, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  DialogTitle,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import EmailIcon from '@mui/icons-material/Email';
import {
  // PN-1714
  // NotificationStatus,
  LegalFactId,
  NotificationDetailDocuments,
  NotificationDetailTable,
  NotificationDetailTableRow,
  NotificationDetailTimeline,
  PnBreadcrumb,
  TitleBox,
  useIsMobile,
  NotificationDetailRecipient,
  NotificationStatus,
} from '@pagopa-pn/pn-commons';
import { Tag, TagGroup } from '@pagopa/mui-italia';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';

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
  const { recipients } = notification;
  const recipientsWithNoticeCode = recipients.filter((recipient) => recipient.payment?.noticeCode);
  const recipientsWithAltNoticeCode = recipients.filter(
    (recipient) => recipient.payment?.noticeCodeAlternative
  );
  const { t } = useTranslation(['common', 'notifiche']);

  const getRecipientsNoticeCodeField = (
    filteredRecipients: Array<NotificationDetailRecipient>,
    alt: boolean = false
  ): ReactNode => {
    if (filteredRecipients.length > 1) {
      return filteredRecipients.map((recipient, index) => (
        <Box key={index} fontWeight={600}>
          {recipient.taxId} -{' '}
          {recipient?.payment?.creditorTaxId} -{' '}
          {alt ? recipient.payment?.noticeCodeAlternative : recipient.payment?.noticeCode}
        </Box>
      ));
    }
    return (
      <Box fontWeight={600}>
        {filteredRecipients[0]?.payment?.creditorTaxId} -{' '}
        {alt
          ? filteredRecipients[0]?.payment?.noticeCodeAlternative
          : filteredRecipients[0]?.payment?.noticeCode}
      </Box>
    );
  };

  const unfilteredDetailTableRows: Array<{
    label: string;
    rawValue: string | undefined;
    value: ReactNode;
  }> = [
    {
      label: t('detail.sender', { ns: 'notifiche' }),
      rawValue: notification.senderDenomination,
      value: <Box fontWeight={600}>{notification.senderDenomination}</Box>,
    },
    {
      label: t('detail.recipient', { ns: 'notifiche' }),
      rawValue: recipients.length > 1 ? '' : recipients[0]?.denomination,
      value: <Box fontWeight={600}>{recipients[0]?.denomination}</Box>,
    },
    {
      label:
        recipients.length > 1
          ? t('detail.recipients', { ns: 'notifiche' })
          : t('detail.fiscal-code-recipient', { ns: 'notifiche' }),
      rawValue: recipients.map((recipient) => recipient.denomination).join(', '),
      value: (
        <>
          {recipients.map((recipient, i) => (
            <Box key={i} fontWeight={600}>
              {recipient.taxId}
            </Box>
          ))}
        </>
      ),
    },
    {
      label: t('detail.date', { ns: 'notifiche' }),
      rawValue: notification.sentAt,
      value: <Box fontWeight={600}>{notification.sentAt}</Box>,
    },
    {
      label: t('detail.payment-terms', { ns: 'notifiche' }),
      rawValue: notification.paymentExpirationDate,
      value: (
        <Box fontWeight={600} display="inline">
          {notification.paymentExpirationDate}
        </Box>
      ),
    },
    {
      label: t('detail.amount', { ns: 'notifiche' }),
      rawValue: notification.amount?.toFixed(2),
      value: <Box fontWeight={600}>{notification.amount?.toFixed(2)}</Box>,
    },
    {
      label: t('detail.iun', { ns: 'notifiche' }),
      rawValue: notification.iun,
      value: <Box fontWeight={600}>{notification.iun}</Box>,
    },
    {
      label: t('detail.cancelled-iun', { ns: 'notifiche' }),
      rawValue: notification.cancelledIun,
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    },
    {
      label: t('detail.notice-code', { ns: 'notifiche' }),
      rawValue: recipientsWithNoticeCode.join(', '),
      value: getRecipientsNoticeCodeField(recipientsWithNoticeCode),
    },
    {
      label: t('detail.secondary-notice-code', { ns: 'notifiche' }),
      rawValue: recipientsWithAltNoticeCode.join(', '),
      value: getRecipientsNoticeCodeField(recipientsWithAltNoticeCode, true),
    },
    {
      label: t('detail.groups', { ns: 'notifiche' }),
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

  const isCancelled =
    notification.notificationStatus === NotificationStatus.CANCELLED ? true : false;

  const hasDocumentsAvailable = isCancelled || !notification.documentsAvailable ? false : true;

  const getDownloadFilesMessage = useCallback((): string => {
    if (isCancelled) {
      return "Poich?? questa notifica ?? stata annullata, i documenti allegati non sono disponibili.";
    } else if (hasDocumentsAvailable) {
      return "I documenti allegati sono disponibili online per 120 giorni dal perfezionamento della notifica.";
    } else {
      return "Poich?? sono trascorsi 120 giorni dalla data di perfezionamento, i documenti non sono pi?? disponibili.";
    }
  }, [isCancelled, hasDocumentsAvailable]);

  // PN-1714
  /*
  const openModal = () => {
    trackEventByType(TrackEventType.NOTIFICATION_DETAIL_CANCEL_NOTIFICATION);
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
            {t('detail.breadcrumb-root', { ns: 'notifiche' })}
          </Fragment>
        }
        currentLocationLabel={t('detail.breadcrumb-leaf', { ns: 'notifiche' })}
        goBackLabel={t('button.indietro', { ns: 'common' })}
      />
      <TitleBox
        variantTitle="h4"
        title={notification.subject}
        sx={{ pt: 3, mb: 2 }}
        mbTitle={0}
      ></TitleBox>
      <Typography variant="body1" mb={{ xs: 3, md: 4 }}>
        {notification.abstract}
      </Typography>
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
          {t('detail.cancel-notification', { ns: 'notifiche' })}
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
        {t('detail.cancel-notification-modal.title', { ns: 'notifiche' })}
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 4 }}>
        <DialogContentText id="dialog-description">
          {t('detail.cancel-notification-modal.message', { ns: 'notifiche' })}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4 }}>
        <Button onClick={handleModalClose} variant="outlined" data-testid="modalCloseBtnId">
          {t('button.indietro')}
        </Button>
        <Button
          onClick={handleModalCloseAndProceed}
          variant="contained"
          data-testid="modalCloseAndProceedBtnId"
        >
          {t('new-notification-button', { ns: 'notifiche' })}
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
                  title={t('detail.acts', { ns: 'notifiche' })}
                  documents={notification.documents ?? []}
                  clickHandler={documentDowloadHandler}
                  documentsAvailable={hasDocumentsAvailable}
                  downloadFilesMessage={getDownloadFilesMessage()}
                  downloadFilesLink="Quando si perfeziona una notifica?"
                />
              </Paper>
            </Stack>
          </Grid>
          <Grid item lg={5} xs={12}>
            <Box sx={{ backgroundColor: 'white', height: '100%', p: 3 }}>
              <NotificationDetailTimeline
                recipients={recipients}
                statusHistory={notification.notificationStatusHistory}
                title={t('detail.timeline-title', { ns: 'notifiche' })}
                clickHandler={legalFactDownloadHandler}
                legalFactLabels={{
                  attestation: t('detail.legalfact', { ns: 'notifiche' }),
                  receipt: t('detail.receipt', { ns: 'notifiche' }),
                }}
                historyButtonLabel={t('detail.show-history', { ns: 'notifiche' })}
                showMoreButtonLabel={t('detail.show-more', { ns: 'notifiche' })}
                showLessButtonLabel={t('detail.show-less', { ns: 'notifiche' })}
                eventTrackingCallbackShowMore={() =>
                  trackEventByType(TrackEventType.NOTIFICATION_TIMELINE_VIEW_MORE)
                }
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
