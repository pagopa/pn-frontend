import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { CollapsedList, NotificationDetailRecipient } from '@pagopa-pn/pn-commons';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  showAll?: boolean;
};

const NotificationRecipientsDetail: React.FC<Props> = ({ recipients, showAll = false }) => {
  const { t } = useTranslation(['notifiche', 'common']);
  const MAX_VISIBLE_RECIPIENTS = 3;

  const renderRecipient = (recipient: NotificationDetailRecipient) => (
    <Box component="li" key={recipient.taxId} data-testid="recipients">
      {recipient.denomination} - {recipient.taxId}
    </Box>
  );

  const getRemainingText = (count: number) =>
    `+${count} ` +
    (count === 1
      ? t('detail.recipient', { ns: 'notifiche' }).toLowerCase()
      : t('detail.recipients', { ns: 'notifiche' }).toLowerCase());

  const renderRecipients = () => {
    if (recipients.length === 0) {
      return null;
    }

    if (recipients.length === 1) {
      return `${recipients[0].denomination} - ${recipients[0].taxId}`;
    }

    return (
      <Box component="ul" sx={{ pl: 3, m: 0 }}>
        {showAll ? (
          recipients.map(renderRecipient)
        ) : (
          <CollapsedList
            maxNumberOfItems={MAX_VISIBLE_RECIPIENTS}
            items={recipients}
            renderItem={renderRecipient}
            renderRemainingItem={(count) => (
              <Box component="li" key="remaining-recipients" data-testid="remaining-recipients">
                {getRemainingText(count)}
              </Box>
            )}
          />
        )}
      </Box>
    );
  };

  return <>{renderRecipients()}</>;
};

export default NotificationRecipientsDetail;
