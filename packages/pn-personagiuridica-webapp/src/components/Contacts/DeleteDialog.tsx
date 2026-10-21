import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';
import { MIButton, MIButtonProps } from '@pagopa/mui-italia';

type Props = {
  showModal: boolean;
  handleModalClose: () => void;
  removeModalTitle: string;
  removeModalBody: string | ReactNode;
  confirmHandler: () => void;
  blockDelete?: boolean;
  slotsProps?: {
    primaryButton?: Omit<MIButtonProps, 'href'> & { label?: string };
    secondaryButton?: Omit<MIButtonProps, 'href'> & { label?: string };
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
    <MIButton id="buttonClose" onClick={handleModalClose} variant="contained">
      {t('button.understand')}
    </MIButton>
  ) : (
    [
      <MIButton
        onClick={handleModalClose}
        {...slotsProps?.secondaryButton}
        key="cancel"
        variant="outlined"
        id="buttonAnnulla"
      >
        {slotsProps?.secondaryButton?.label ?? t('button.annulla')}
      </MIButton>,
      <MIButton
        onClick={confirmHandler}
        {...slotsProps?.primaryButton}
        id="buttonConferma"
        key="confirm"
        variant="contained"
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
