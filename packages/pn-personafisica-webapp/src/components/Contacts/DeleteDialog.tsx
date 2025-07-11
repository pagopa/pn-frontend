import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonProps, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type DialogProps = {
  showModal: boolean;
  handleModalClose: () => void;
  removeModalTitle: string;
  removeModalBody: string | ReactNode;
  confirmHandler: () => void;
  slotsProps?: {
    nextButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
};

const DeleteDialog: React.FC<DialogProps> = ({
  showModal,
  handleModalClose,
  removeModalTitle,
  removeModalBody,
  confirmHandler,
  slotsProps,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <PnDialog
      open={showModal}
      onClose={handleModalClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">{removeModalTitle}</DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description">{removeModalBody}</DialogContentText>
      </PnDialogContent>
      <PnDialogActions>
        <Button
          key="cancel"
          onClick={handleModalClose}
          variant="outlined"
          id="buttonAnnulla"
          {...slotsProps?.cancelButton}
        >
          {t('button.annulla')}
        </Button>
        ,
        <Button
          id="buttonConferma"
          key="confirm"
          onClick={confirmHandler}
          variant="contained"
          {...slotsProps?.nextButton}
        >
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default DeleteDialog;
