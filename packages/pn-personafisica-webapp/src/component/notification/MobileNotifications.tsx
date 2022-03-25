import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  CardElem,
  CardSort,
  getNotificationStatusLabelAndColor,
  Notification,
  NotificationsCard,
  NotificationStatus,
  Row,
  Sort,
  StatusTooltip,
  CardAction
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import * as routes from '../../navigation/routes.const';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';
import MobileNotificationsSort from './MobileNotificationsSort';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Card sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
};

const MobileNotifications = ({ notifications, sort, onChangeSorting }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('notifiche');

  const cardHeader: [CardElem, CardElem] = [
    {
      id: 'sentAt',
      label: t('table.data'),
      getLabel(value: string) {
        return getNewNotificationBadge(value);
      },
    },
    {
      id: 'notificationStatus',
      label: t('table.status'),
      getLabel(value: string) {
        const { label, tooltip, color } = getNotificationStatusLabelAndColor(
          value as NotificationStatus
        );
        return <StatusTooltip label={t(label)} tooltip={t(tooltip)} color={color}></StatusTooltip>;
      },
    },
  ];

  const cardBody: Array<CardElem> = [
    {
      id: 'senderId',
      label: t('table.mittente'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      getLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      getLabel(value: string) {
        return value;
      },
    },
  ];

  const cardData: Array<Row> = notifications.map((n, i) => ({
    ...n,
    id: i.toString(),
  }));

  const sortFields: Array<CardSort> = [
    { id: 'sentAt', label: t('table.data') },
    { id: 'senderId', label: t('table.mittente') },
  ].reduce((arr, el) => {
    /* eslint-disable functional/immutable-data */
    arr.push(
      {
        id: `${el.id}-asc`,
        label: `${el.label} ${t('sort.asc')}`,
        field: el.id,
        value: 'asc',
      },
      {
        id: `${el.id}-desc`,
        label: `${el.label} ${t('sort.desc')}`,
        field: el.id,
        value: 'desc',
      }
    );
    /* eslint-enable functional/immutable-data */
    return arr;
  }, [] as Array<CardSort>);

  // Navigation handlers
  const handleRowClick = (row: Row) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
  };

  // TODO: sostituire con button naked
  const cardActions: Array<CardAction> = [
    {id: 'go-to-detail', component: <ButtonNaked endIcon={<ArrowForwardIcon />}>{t('table.show-detail')}</ButtonNaked>, onClick: handleRowClick}
  ];

  return (
    <Fragment>
      <Grid container direction="row">
        <Grid item xs={6}>
          <FilterNotifications />
        </Grid>
        <Grid item xs={6} textAlign="right">
          {sort && onChangeSorting && (
            <MobileNotificationsSort sortFields={sortFields} sort={sort} onChangeSorting={onChangeSorting}/>
          )}
        </Grid>
      </Grid>
      <NotificationsCard cardHeader={cardHeader} cardBody={cardBody} cardData={cardData} cardActions={cardActions}/>
    </Fragment>
  );
};

export default MobileNotifications;
