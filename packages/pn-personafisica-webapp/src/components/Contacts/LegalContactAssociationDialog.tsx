import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  dialogContentText: React.ReactNode;
  handleClose: () => void;
  handleConfirm: () => void;
};

const LegalContactAssociationDialog: React.FC<Props> = ({
  open = false,
  dialogContentText,
  handleClose,
  handleConfirm,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <PnDialog
      open={open}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="legalContactAssociationDialog"
    >
      <DialogTitle id="dialog-title">
        {t('special-contacts.legal-association-title', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description" color="textPrimary">
          {dialogContentText}
        </DialogContentText>
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={handleClose} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button onClick={handleConfirm} variant="contained">
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default LegalContactAssociationDialog;
