import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  pecValidationOpen: boolean;
  setPecValidationOpen: (value: boolean) => void;
};

const PecVerificationDialog: React.FC<Props> = ({ pecValidationOpen, setPecValidationOpen }) => {
  const { t } = useTranslation();
  return (
    <PnDialog
      open={pecValidationOpen}
      data-testid="validationDialog"
      aria-labelledby="dialog-title"
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
        <Button id="confirmDialog" onClick={() => setPecValidationOpen(false)} variant="contained">
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default PecVerificationDialog;
