import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';

import {
  CardElem,
  CustomMobileDialog,
  getNotificationStatusLabelAndColor,
  Notification,
  NotificationsCard,
  NotificationStatus,
  Row,
  StatusTooltip,
} from '@pagopa-pn/pn-commons';

type Props = {
  notifications: Array<Notification>;
};

const MobileNotifications = ({ notifications }: Props) => {
  const { t } = useTranslation('notifiche');
  const cardHeader: [CardElem, CardElem] = [
    {
      id: 'sentAt',
      label: t('table.data'),
      getLabel(value: string) {
        return value;
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

  return (
    <Fragment>
      <Grid container direction="row">
        <Grid item xs={6}>
          Cerca
        </Grid>
        <Grid item xs={6} textAlign="right">
          <CustomMobileDialog
            title={t('sort.title')}
            actions={[
              {key: 'confirm', component: <Button variant="outlined" onClick={() => console.log('clicked')}>{t('sort.title')}</Button>, closeOnClick: true},
              {key: 'cancel', component: <Button>{t('sort.cancel')}</Button>, closeOnClick: true},
            ]}
          >
            content
          </CustomMobileDialog>
        </Grid>
      </Grid>
      <NotificationsCard cardHeader={cardHeader} cardBody={cardBody} cardData={cardData} />
    </Fragment>
  );
};

export default MobileNotifications;
