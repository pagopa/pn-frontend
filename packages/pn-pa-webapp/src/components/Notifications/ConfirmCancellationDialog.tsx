import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Checkbox,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

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
                  autoFocus
                ></Checkbox>
              }
              label={t('detail.cancel-notification-modal.i-understand')}
              labelPlacement="end"
            />
          </FormControl>
        )}
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={onClose} variant="outlined" data-testid="modalCloseBtnId">
          {t('button.indietro', { ns: 'common' })}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={payment ? !checked : false}
          variant="contained"
          data-testid="modalCloseAndProceedBtnId"
          autoFocus={!payment}
        >
          {t('detail.cancel-notification')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default ConfirmCancellationDialog;
