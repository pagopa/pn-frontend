import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, DialogTitle, Grid, Typography } from '@mui/material';
import {
  CollapsedList,
  NotificationDetailRecipient,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  RecipientType,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked, CopyToClipboardButton } from '@pagopa/mui-italia';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  iun: string;
};

const NotificationRecipientsDetail: React.FC<Props> = ({ recipients, iun }) => {
  const { t } = useTranslation(['notifiche', 'common']);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PnDialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="dialog-title">{t('detail.recipients-dialog-title', { iun })}</DialogTitle>
        <PnDialogContent>
          {recipients.map((recipient) => (
            <Grid
              key={recipient.taxId}
              container
              direction="row"
              alignItems="center"
              spacing={2}
              mt={1}
              data-testid="dialog-all-recipients"
            >
              <Grid item xs>
                <Box fontWeight={600}>
                  {recipient.denomination} - {recipient.taxId}
                  <Typography variant="body2" color="action.active">
                    {recipient.recipientType === RecipientType.PF
                      ? t('detail.physical-person')
                      : t('detail.legal-person')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs="auto">
                <CopyToClipboardButton
                  value={`${recipient.denomination} - ${recipient.taxId}`}
                  autoFocus
                />
              </Grid>
            </Grid>
          ))}
        </PnDialogContent>
        <PnDialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)} data-testid="close-dialog">
            {t('button.close', { ns: 'common' })}
          </Button>
        </PnDialogActions>
      </PnDialog>
      {
        <CollapsedList
          maxNumberOfItems={3}
          items={recipients}
          renderItem={(recipient) => (
            <Box key={recipient.taxId} fontWeight={600} data-testid="recipients">
              {recipients.length > 1
                ? `${recipient.denomination} - ${recipient.taxId}`
                : recipient.taxId}
            </Box>
          )}
          renderRemainingItem={(count) => (
            <Box fontWeight={600} data-testid="remaining-recipients">
              +&nbsp;{count}&nbsp;{t('detail.recipients', { ns: 'notifiche' }).toLowerCase()}&nbsp;
              <ButtonNaked
                sx={{ verticalAlign: 'inherit' }}
                onClick={() => setOpen(true)}
                data-testid="show-all-recipients"
              >
                <Typography color="primary" variant="body2" fontWeight={'bold'}>
                  {t('detail.show-all')}
                </Typography>
              </ButtonNaked>
            </Box>
          )}
        />
      }
    </>
  );
};

export default NotificationRecipientsDetail;
