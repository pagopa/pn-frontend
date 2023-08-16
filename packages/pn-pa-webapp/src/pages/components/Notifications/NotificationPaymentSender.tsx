import { ChangeEvent, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { Box, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { NotificationDetailRecipient, RecipientType } from '@pagopa-pn/pn-commons';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
};

const renderRecipientMenuItem = (
  index: number,
  option: NotificationDetailRecipient,
  t: TFunction<Array<string>, undefined>
) => (
  <MenuItem
    key={option.taxId}
    role="option"
    sx={{ mt: index === 0 ? 0 : 2, px: 4, py: 1 }}
    value={option.taxId}
  >
    <Box fontWeight={600}>
      {option.denomination} - {option.taxId}
      <Typography variant="body2" color="action.active">
        {option.recipientType === RecipientType.PF
          ? t('detail.physical-person')
          : t('detail.legal-person')}
      </Typography>
    </Box>
  </MenuItem>
);

const renderSelectValue = (
  value: string,
  recipients: Array<NotificationDetailRecipient>
): string => {
  const recipient = recipients.find((recipient) => recipient.taxId === value);
  return recipient ? `${recipient.denomination} - ${recipient.taxId}` : '';
};

const NotificationPaymentSender: React.FC<Props> = ({ recipients }) => {
  const { t } = useTranslation(['notifiche']);
  const [recipientSelected, setRecipientSelected] = useState<string>('');

  const recipientSelectionHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setRecipientSelected(event.target.value);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={0} data-testid="paymentInfoBox">
      <Typography variant="h6">{t('payment.title', { ns: 'notifiche' })}</Typography>
      {recipients.length === 1 && (
        <Typography variant="body2" my={2}>
          {t('payment.subtitle-single', { ns: 'notifiche' })}
        </Typography>
      )}
      {recipients.length > 1 && (
        <Typography variant="body2" my={2}>
          {t('payment.subtitle-multiple', { ns: 'notifiche' })}
        </Typography>
      )}
      {recipients.length > 1 && (
        <TextField
          id="recipients-select"
          data-testid="recipients-select"
          name="recipients-select"
          size="small"
          fullWidth
          onChange={recipientSelectionHandler}
          label={`${t('detail.recipient')}*`}
          aria-label={`${t('detail.recipient')}*`}
          sx={{ mt: 2 }}
          select
          SelectProps={{
            MenuProps: { MenuListProps: { sx: { py: 3, px: 0 } } },
            renderValue: (value) => renderSelectValue(value as string, recipients),
          }}
          value={recipientSelected}
        >
          {recipients.map((recipient, index) => renderRecipientMenuItem(index, recipient, t))}
        </TextField>
      )}
    </Paper>
  );
};

export default NotificationPaymentSender;
