import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, DialogTitle, FormControl, FormControlLabel, Typography } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

type Props = {
  showModal: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
  payment: boolean;
};

const ConfirmCancellationDialog: React.FC<Props> = ({ showModal, onClose, onConfirm, payment }) => {
  const { t } = useTranslation(['notifiche']);

  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    if (!showModal && checked) {
      setChecked(false);
    }
  }, [showModal]);

  return (
    <PnDialog open={showModal} data-testid="cancel-notification-modal">
      <DialogTitle id="dialog-title">{t('detail.cancel-notification-modal.title')}</DialogTitle>
      <PnDialogContent>
        <Typography data-testid="dialogText" component="p">
          {payment
            ? t('detail.cancel-notification-modal.message-with-payment')
            : t('detail.cancel-notification-modal.message')}
        </Typography>
        {payment && (
          <FormControl>
            <FormControlLabel
              sx={{
                mt: {
                  xs: 2,
                  md: 3,
                },
              }}
              control={
                <Checkbox
                  data-testid="checkbox"
                  checked={checked}
                  onChange={handleChange}
                ></Checkbox>
              }
              label={t('detail.cancel-notification-modal.i-understand')}
              labelPlacement="end"
            />
          </FormControl>
        )}
      </PnDialogContent>
      <PnDialogActions>
        <MIButton onClick={onClose} variant="outlined" data-testid="modalCloseBtnId">
          {t('button.indietro', { ns: 'common' })}
        </MIButton>
        <MIButton onClick={onConfirm} variant="contained" data-testid="modalCloseAndProceedBtnId">
          {t('detail.cancel-notification')}
        </MIButton>
      </PnDialogActions>
    </PnDialog>
  );
};

export default ConfirmCancellationDialog;
