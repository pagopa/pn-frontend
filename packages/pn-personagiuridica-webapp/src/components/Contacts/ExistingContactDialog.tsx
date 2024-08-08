import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  value: string;
  handleDiscard: () => void;
  handleConfirm: () => void;
};

const ExistingContactDialog: React.FC<Props> = ({
  open = false,
  value,
  handleDiscard,
  handleConfirm,
}) => {
  const { t } = useTranslation();
  return (
    <PnDialog
      open={open}
      onClose={handleDiscard}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="duplicateDialog"
    >
      <DialogTitle id="dialog-title">
        {t(`common.duplicate-contact-title`, { value, ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description">
          {t(`common.duplicate-contact-descr`, { value, ns: 'recapiti' })}
        </DialogContentText>
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={handleDiscard} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button onClick={handleConfirm} variant="contained">
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default ExistingContactDialog;
