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

  slotsProps?: {
    primaryButton?: ButtonProps;
    secondaryButton?: ButtonProps;
    label?: {
      primary: string;
      secondary: string;
    };
  };
};

const DeleteDialog: React.FC<Props> = ({
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
          {...slotsProps?.secondaryButton}
        >
          {slotsProps?.label?.secondary ?? t('button.annulla')}
        </Button>
        ,
        <Button
          id="buttonConferma"
          key="confirm"
          onClick={confirmHandler}
          variant="contained"
          {...slotsProps?.primaryButton}
        >
          {slotsProps?.label?.primary ?? t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default DeleteDialog;
