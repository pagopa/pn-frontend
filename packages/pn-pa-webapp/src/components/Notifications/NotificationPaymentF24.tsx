import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, DialogTitle, Divider, ListItem, Typography } from '@mui/material';
import {
  CollapsedList,
  F24PaymentDetails,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
} from '@pagopa-pn/pn-commons';
import { MIBoxedModule, MIButton } from '@pagopa/mui-italia';

type Props = {
  iun: string;
  payments: Array<F24PaymentDetails>;
};

const NotificationPaymentF24: React.FC<Props> = ({ iun, payments }) => {
  const { t } = useTranslation(['notifiche']);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PnDialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="dialog-title">{t('payment.f24-dialog-title', { iun })}</DialogTitle>
        <PnDialogContent>
          {payments.map((payment, index) => (
            <Fragment key={`${payment.recIndex} - ${payment.attachmentIdx}`}>
              <ListItem sx={{ px: 0, py: '4px' }} data-testid="dialog-all-attachments">
                <Typography variant="body2" color="action.active">
                  {payment.title}
                </Typography>
              </ListItem>
              {index !== payments.length - 1 && <Divider sx={{ my: 1 }} />}
            </Fragment>
          ))}
        </PnDialogContent>
        <PnDialogActions>
          <MIButton variant="outlined" onClick={() => setOpen(false)} data-testid="close-dialog">
            {t('button.close', { ns: 'common' })}
          </MIButton>
        </PnDialogActions>
      </PnDialog>
      <MIBoxedModule>
        <Box width="100%">
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            {t('payment.f24-attached')}
          </Typography>

          <Box display="flex" flexWrap="wrap" alignItems="center">
            <CollapsedList
              maxNumberOfItems={5}
              items={payments}
              renderItem={(f24) => (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  mr={1}
                  key={`${f24.recIndex} - ${f24.attachmentIdx}`}
                  data-testid="f24"
                  sx={{ wordBreak: 'break-all' }}
                >
                  {f24.title}
                </Typography>
              )}
              renderRemainingItem={(count) => (
                <Typography variant="caption" color="text.secondary" data-testid="remaining-f24">
                  &nbsp;+&nbsp;{count}&nbsp;{t('payment.attachments')}
                  <MIButton
                    variant="text"
                    sx={{ ml: 1 }}
                    data-testid="show-all-attachments"
                    onClick={() => setOpen(true)}
                  >
                    {t('detail.show-all')}
                  </MIButton>
                </Typography>
              )}
            />
          </Box>
        </Box>
      </MIBoxedModule>
    </>
  );
};

export default NotificationPaymentF24;
