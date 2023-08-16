import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';

type Props = {
  showModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
  payment: boolean;
};

const ConfirmCancellationDialog: React.FC<Props> = ({ showModal, onClose, onConfirm, payment }) => {
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    setChecked(false);
  }, [onClose]);
  return (
    <Dialog
      open={showModal}
      data-testid="modalId"
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title" sx={{ p: 4 }}>
        {t('detail.cancel-notification-modal.title', { ns: 'notifiche' })}
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 4 }}>
        <DialogContentText id="dialog-description">
          {t(
            payment
              ? 'detail.cancel-notification-modal.message-with-payment'
              : 'detail.cancel-notification-modal.message',
            { ns: 'notifiche' }
          )}
        </DialogContentText>
        {payment && (
          <FormControl>
            <FormControlLabel
              sx={{
                mt: {
                  xs: 2,
                  md: 3,
                },
              }}
              control={<Checkbox checked={checked} onChange={handleChange}></Checkbox>}
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
};

export default ConfirmCancellationDialog;
