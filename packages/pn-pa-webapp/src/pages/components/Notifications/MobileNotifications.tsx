import { Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Sort,
  Notification,
  CardElement,
  Item,
  getNotificationStatusInfos,
  NotificationStatus,
  StatusTooltip,
  ItemsCard,
  EmptyState,
  CardAction,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import * as routes from '../../../navigation/routes.const';

type Props = {
  notifications: Array<Notification>;
  /** The function to be invoked if the user resets filters */
  onCancelSearch: () => void;
  /** Table sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
  /** The function to be invoked if the user clicks on new notification link */
  onManualSend: () => void;
  /** The function to be invoked if the user clicks on api keys link */
  onApiKeys: () => void;
};

const cardStyle = {
  '& .card-header': {
    padding: 0,
  },
  '& .card-actions': {
    paddingLeft: 0,
    paddingRight: 0,
  },
};

const MobileNotifications = ({
  notifications,
  onCancelSearch,
  sort,
  onChangeSorting,
  onManualSend,
  onApiKeys,
}: Props) => {
  const navigate = useNavigate();
  const filterNotificationsRef = useRef({ filtersApplied: false });

  console.log(sort);
  console.log(onChangeSorting);

  const cardHeader: [CardElement, CardElement] = [
    {
      id: 'sentAt',
      label: 'Data',
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'notificationStatus',
      label: 'Stato',
      getLabel(_, row: Item) {
        const { label, tooltip, color } = getNotificationStatusInfos(
          row.notificationStatus as NotificationStatus
        );
        return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
      },
    },
  ];

  const cardBody: Array<CardElement> = [
    {
      id: 'recipients',
      label: 'Destinatario',
      getLabel(value: Array<string>) {
        return value.map((v) => (
          <Typography key={v} variant="body2">
            {v}
          </Typography>
        ));
      },
    },
    {
      id: 'subject',
      label: 'Oggetto',
      getLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
    },
    {
      id: 'iun',
      label: 'Codice IUN',
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'group',
      label: 'Gruppi',
      getLabel(value: string) {
        return value;
      },
      hideIfEmpty: true
    },
  ];

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    // log event
    trackEventByType(TrackEventType.NOTIFICATIONS_GO_TO_DETAIL);
  };

  const cardActions: Array<CardAction> = [
    {
      id: 'go-to-detail',
      component: <ButtonNaked endIcon={<ArrowForwardIcon />} color="primary">Vedi dettaglio</ButtonNaked>,
      onClick: handleRowClick,
    },
  ];

  const cardData: Array<Item> = notifications.map((n: Notification, i: number) => ({
    ...n,
    id: i.toString(),
  }));

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;
  const emptyMessage: string = "L'ente non ha ancora inviato nessuna notifica. Usa le";
  const emptyActionLabel: string = 'Chiavi API';
  const secondaryMessage: object = {
    emptyMessage: 'o fai un',
    emptyActionLabel: 'invio manuale',
    emptyActionCallback: () => {
      onManualSend();
    },
  };
  const EmptyStateProps = {
    emptyMessage: filtersApplied ? undefined : emptyMessage,
    emptyActionLabel: filtersApplied ? undefined : emptyActionLabel,
    disableSentimentDissatisfied: !filtersApplied,
    emptyActionCallback: filtersApplied ? onCancelSearch : onApiKeys,
    secondaryMessage: filtersApplied ? undefined : secondaryMessage,
  };

  return (
    <Fragment>
      <Grid container direction="row" sx={{ marginBottom: '16px' }}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} textAlign="right"></Grid>
      </Grid>
      {cardData.length ? (
        <ItemsCard cardData={cardData} cardHeader={cardHeader} cardBody={cardBody} cardActions={cardActions} sx={cardStyle} />
      ) : (
        <EmptyState {...EmptyStateProps} />
      )}
    </Fragment>
  );
};

export default MobileNotifications;
