import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  handleConfirm: () => void;
};

const PecVerificationDialog: React.FC<Props> = ({ open = false, handleConfirm }) => {
  const { t } = useTranslation();
  return (
    <PnDialog
      open={open}
      data-testid="validationDialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        {t('legal-contacts.validation-progress-title', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description">
          {t('legal-contacts.validation-progress-content', { ns: 'recapiti' })}
        </DialogContentText>
      </PnDialogContent>
      <PnDialogActions>
        <Button id="confirmDialog" onClick={handleConfirm} variant="contained" autoFocus>
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default PecVerificationDialog;
