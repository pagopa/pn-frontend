import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type DialogProps = {
  showModal: boolean;
  handleModalClose: () => void;
  removeModalTitle: string;
  removeModalBody: string;
  removeButtonLabel?: string;
  blockDelete?: boolean;
  confirmHandler: () => void;
};

const DeleteDialog: React.FC<DialogProps> = ({
  showModal,
  handleModalClose,
  removeModalTitle,
  removeModalBody,
  removeButtonLabel,
  blockDelete,
  confirmHandler,
}) => {
  const { t } = useTranslation(['common']);

  const deleteModalActions = blockDelete ? (
    <Button id="buttonClose" onClick={handleModalClose} variant="outlined">
      {t('button.close')}
    </Button>
  ) : (
    [
      <Button key="cancel" onClick={handleModalClose} variant="outlined" id="buttonAnnulla">
        {t('button.annulla')}
      </Button>,
      <Button id="buttonConferma" key="confirm" onClick={confirmHandler} variant="contained">
        {removeButtonLabel ?? t('button.conferma')}
      </Button>,
    ]
  );
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
      <PnDialogActions>{deleteModalActions}</PnDialogActions>
    </PnDialog>
  );
};

export default DeleteDialog;
