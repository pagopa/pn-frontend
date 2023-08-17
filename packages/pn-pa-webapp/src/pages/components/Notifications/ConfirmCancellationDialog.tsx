import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';

type Props = {
  showModal: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  onConfirm: React.MouseEventHandler<HTMLButtonElement>;
  payment: boolean;
};

export default function ConfirmCancellationDialog({
  showModal,
  onClose,
  onConfirm,
  payment,
}: Props) {
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    setChecked(false);
  }, [onClose]);

  return (
    <Dialog open={showModal} data-testid="modalId">
      <DialogTitle id="dialog-title" sx={{ p: 4 }}>
        {t('detail.cancel-notification-modal.title', { ns: 'notifiche' })}
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 4 }}>
        <Typography data-testid="dialogText" component="p">
          {payment
            ? t('detail.cancel-notification-modal.message-with-payment', { ns: 'notifiche' })
            : t('detail.cancel-notification-modal.message', { ns: 'notifiche' })}
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
              label={t('detail.cancel-notification-modal.i-understand', { ns: 'notifiche' })}
              labelPlacement="end"
            />
          </FormControl>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4 }}>
        <Button onClick={onClose} variant="outlined" data-testid="modalCloseBtnId">
          {t('button.indietro')}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!checked}
          variant="contained"
          data-testid="modalCloseAndProceedBtnId"
        >
          {t('detail.cancel-notification-modal.confirm-cancel-button', { ns: 'notifiche' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
