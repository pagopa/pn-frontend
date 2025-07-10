import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonProps, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import { ChannelType } from '../../models/contacts';

type Props = {
  showModal: boolean;
  handleModalClose: () => void;
  removeModalTitle: string;
  removeModalBody: string | ReactNode;
  blockDelete?: boolean;
  channelType?: ChannelType;
  confirmHandler: () => void;
  slotsProps?: {
    nextButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
};

const DeleteDialog: React.FC<Props> = ({
  showModal,
  handleModalClose,
  removeModalTitle,
  removeModalBody,
  blockDelete,
  confirmHandler,
  slotsProps,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const deleteModalActions = blockDelete ? (
    <Button id="buttonClose" onClick={handleModalClose} variant="contained">
      {t('button.understand')}
    </Button>
  ) : (
    [
      <Button
        key="cancel"
        onClick={handleModalClose}
        variant="outlined"
        id="buttonAnnulla"
        {...slotsProps?.cancelButton}
      >
        {t('button.annulla')}
      </Button>,
      <Button
        id="buttonConferma"
        key="confirm"
        onClick={confirmHandler}
        variant="contained"
        {...slotsProps?.nextButton}
      >
        {t('button.conferma')}
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
