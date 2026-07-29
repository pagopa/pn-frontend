import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';
import { MIButton, MIButtonProps } from '@pagopa/mui-italia';

type DialogProps = {
  showModal: boolean;
  handleModalClose: () => void;
  removeModalTitle: string;
  removeModalBody: string | ReactNode;
  blockDelete?: boolean;
  confirmHandler: () => void;
  slotsProps?: {
    primaryButton?: MIButtonProps & { label?: string };
    secondaryButton?: MIButtonProps & { label?: string };
  };
};

const DeleteDialog: React.FC<DialogProps> = ({
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
    <MIButton id="buttonClose" onClick={handleModalClose} variant="contained">
      {t('button.understand')}
    </MIButton>
  ) : (
    [
      <MIButton
        key="cancel"
        onClick={handleModalClose}
        variant="outlined"
        id="buttonAnnulla"
        {...slotsProps?.secondaryButton}
      >
        {slotsProps?.secondaryButton?.label ?? t('button.annulla')}
      </MIButton>,
      <MIButton
        id="buttonConferma"
        key="confirm"
        onClick={confirmHandler}
        variant="contained"
        {...slotsProps?.primaryButton}
      >
        {slotsProps?.primaryButton?.label ?? t('button.conferma')}
      </MIButton>,
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
