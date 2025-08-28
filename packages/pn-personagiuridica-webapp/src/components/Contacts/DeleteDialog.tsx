import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonProps, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type Props = {
  showModal: boolean;
  handleModalClose: () => void;
  removeModalTitle: string;
  removeModalBody: string | ReactNode;
  confirmHandler: () => void;
  blockDelete?: boolean;
  slotsProps?: {
    primaryButton?: ButtonProps & { label?: string };
    secondaryButton?: ButtonProps & { label?: string };
  };
};

const DeleteDialog: React.FC<Props> = ({
  showModal,
  handleModalClose,
  removeModalTitle,
  removeModalBody,
  confirmHandler,
  blockDelete,
  slotsProps,
}) => {
  const { t } = useTranslation(['common']);

  const deleteModalActions = blockDelete ? (
    <Button id="buttonClose" onClick={handleModalClose} variant="contained" autoFocus>
      {t('button.understand')}
    </Button>
  ) : (
    [
      <Button
        key="cancel"
        onClick={handleModalClose}
        variant="outlined"
        id="buttonAnnulla"
        {...slotsProps?.secondaryButton}
      >
        {slotsProps?.secondaryButton?.label ?? t('button.annulla')}
      </Button>,
      <Button
        id="buttonConferma"
        key="confirm"
        onClick={confirmHandler}
        variant="contained"
        autoFocus
        {...slotsProps?.primaryButton}
      >
        {slotsProps?.primaryButton?.label ?? t('button.conferma')}
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
