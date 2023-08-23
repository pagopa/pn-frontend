import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Typography,
} from '@mui/material';

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
  const { t } = useTranslation(['notifiche']);

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
        {t('detail.cancel-notification-modal.title')}
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 4 }}>
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
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4 }}>
        <Button onClick={onClose} variant="outlined" data-testid="modalCloseBtnId">
          {t('button.indietro', { ns: 'common' })}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={payment ? !checked : false}
          variant="contained"
          data-testid="modalCloseAndProceedBtnId"
        >
          {t('detail.cancel-notification')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
