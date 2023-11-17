import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button } from '@mui/material';
import {
  INotificationDetailTimeline,
  NotificationDetail,
  NotificationDetailTable,
  NotificationDetailTableAction,
  NotificationDetailTableBody,
  NotificationDetailTableBodyRow,
  NotificationDetailTableCell,
  NotificationDetailTableContents,
  NotificationDetailTableRow,
  TimelineCategory,
  dataRegex,
  formatDate,
  formatEurocentToCurrency,
  useIsCancelled,
} from '@pagopa-pn/pn-commons';
import { Tag, TagGroup } from '@pagopa/mui-italia';

import { TrackEventType } from '../../utility/events';
import { trackEventByType } from '../../utility/mixpanel';
import ConfirmCancellationDialog from './ConfirmCancellationDialog';
import NotificationRecipientsDetail from './NotificationRecipientsDetail';

type Props = {
  notification: NotificationDetail;
  onCancelNotification: () => void;
};

const NotificationDetailTableSender: React.FC<Props> = ({ notification, onCancelNotification }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { cancellationInProgress, cancelled } = useIsCancelled({ notification });
  const { recipients } = notification;
  const withPayment =
    notification.timeline.findIndex(
      (el: INotificationDetailTimeline) => el.category === TimelineCategory.PAYMENT
    ) > -1;

  const openModal = () => {
    trackEventByType(TrackEventType.NOTIFICATION_DETAIL_CANCEL_NOTIFICATION);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalCloseAndProceed = () => {
    setShowModal(false);
    onCancelNotification();
  };

  const getTaxIdLabel = (taxId: string): string =>
    dataRegex.pIva.test(taxId)
      ? 'detail.tax-id-organization-recipient'
      : 'detail.tax-id-citizen-recipient';

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
      value: (
        <Box data-testid="recipientRow" fontWeight={600}>
          {recipients[0]?.denomination}
        </Box>
      ),
    },
    {
      label:
        recipients.length > 1
          ? t('detail.recipients', { ns: 'notifiche' })
          : t(getTaxIdLabel(recipients[0]?.taxId), { ns: 'notifiche' }),
      rawValue: recipients.map((recipient) => recipient.denomination).join(', '),
      value: <NotificationRecipientsDetail recipients={recipients} iun={notification.iun} />,
    },
    {
      label: t('detail.date', { ns: 'notifiche' }),
      rawValue: formatDate(notification.sentAt),
      value: <Box fontWeight={600}>{formatDate(notification.sentAt)}</Box>,
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
      rawValue: notification.amount
        ? formatEurocentToCurrency(notification.amount).toString()
        : undefined,
      value: (
        <Box fontWeight={600}>
          {notification.amount && formatEurocentToCurrency(notification.amount)}
        </Box>
      ),
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

  return (
    <>
      <NotificationDetailTable>
        <NotificationDetailTableContents label={t('detail.table-aria-label', { ns: 'notifiche' })}>
          <NotificationDetailTableBody>
            {detailTableRows.map((row) => (
              <NotificationDetailTableBodyRow key={row.id}>
                <NotificationDetailTableCell
                  id={`row-label-${row.id}`}
                  cellProps={{ py: { xs: 0, lg: 1 } }}
                >
                  {row.label}
                </NotificationDetailTableCell>
                <NotificationDetailTableCell
                  id={`row-value-${row.id}`}
                  cellProps={{ pb: 1, pt: { xs: 0, lg: 1 } }}
                >
                  {row.value}
                </NotificationDetailTableCell>
              </NotificationDetailTableBodyRow>
            ))}
          </NotificationDetailTableBody>
        </NotificationDetailTableContents>
        {!cancellationInProgress && !cancelled && (
          <NotificationDetailTableAction>
            <Button
              variant="outlined"
              sx={{
                my: {
                  xs: 3,
                  md: 2,
                },
                borderColor: 'error.dark',
                outlineColor: 'error.dark',
                color: 'error.dark',
              }}
              onClick={openModal}
              data-testid="cancelNotificationBtn"
            >
              {t('detail.cancel-notification', { ns: 'notifiche' })}
            </Button>
          </NotificationDetailTableAction>
        )}
      </NotificationDetailTable>
      <ConfirmCancellationDialog
        onClose={handleModalClose}
        onConfirm={handleModalCloseAndProceed}
        payment={withPayment}
        showModal={showModal}
      />
    </>
  );
};

export default NotificationDetailTableSender;
