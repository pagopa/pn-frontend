import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';

import {
  CardElem,
  CardSort,
  CustomMobileDialog,
  getNotificationStatusLabelAndColor,
  Notification,
  NotificationsCard,
  NotificationStatus,
  Row,
  Sort,
  StatusTooltip,
} from '@pagopa-pn/pn-commons';

type Props = {
  notifications: Array<Notification>;
  /** Card sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
};

const MobileNotifications = ({ notifications, sort, onChangeSorting }: Props) => {
  const { t } = useTranslation('notifiche');
  const [value, setValue] = useState(sort ? `${sort.orderBy}-${sort.order}` : '');
  const prevSort = useRef(value);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sortSelected = (event.target as HTMLInputElement).value;
    setValue(sortSelected);
  };


  const handleConfirm = () => {
    const sortField = sortFields.find(f => f.id === value);
    if (onChangeSorting && sortField && prevSort.current !== sortField.value) {
      onChangeSorting({order: sortField.value, orderBy: sortField.field});
      /* eslint-disable-next-line functional/immutable-data */
      prevSort.current = sortField.value;
    }
  };

  const handleCancel = () => {
    setValue('');
    if (onChangeSorting) {
      onChangeSorting({order: 'asc', orderBy: ''});
    }
  };

  return (
    <Fragment>
      <Grid container direction="row">
        <Grid item xs={6}>
          Cerca
        </Grid>
        <Grid item xs={6} textAlign="right">
          {(sort && onChangeSorting) && (
            <CustomMobileDialog
              title={t('sort.title')}
              actions={[
                {
                  key: 'confirm',
                  component: (
                    <Button variant="outlined" onClick={handleConfirm}>
                      {t('sort.title')}
                    </Button>
                  ),
                  closeOnClick: true,
                },
                {
                  key: 'cancel',
                  component: <Button onClick={handleCancel}>{t('sort.cancel')}</Button>,
                  closeOnClick: true,
                },
              ]}
            >
              <RadioGroup
                aria-labelledby={t('sort.options')}
                name="radio-buttons-group"
                onChange={handleChange}
                value={value}
              >
                {sortFields.map((f) => (
                  <FormControlLabel key={f.id} value={f.id} control={<Radio />} label={f.label} />
                ))}
              </RadioGroup>
            </CustomMobileDialog>
          )}
        </Grid>
      </Grid>
      <NotificationsCard cardHeader={cardHeader} cardBody={cardBody} cardData={cardData} />
    </Fragment>
  );
};

export default MobileNotifications;
