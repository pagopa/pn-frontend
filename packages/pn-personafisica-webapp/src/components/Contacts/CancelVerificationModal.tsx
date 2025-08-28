import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import { resetPecValidation } from '../../redux/contact/reducers';
import { useAppDispatch } from '../../redux/hooks';

type Props = {
  open: boolean;
  senderId?: string;
  handleClose: () => void;
};

const CancelVerificationModal: React.FC<Props> = ({ open, senderId = 'default', handleClose }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    // we remove the default legal address only interface side, with the goal of letting the user know that needs to add
    // a new email to modify the verifying pec address
    dispatch(resetPecValidation(senderId));
    handleClose();
  };

  return (
    <PnDialog open={open} onClose={handleClose} data-testid="cancelVerificationModal">
      <DialogTitle id="dialog-title">
        {t('legal-contacts.validation-cancel-title', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText>
          {t('legal-contacts.validation-cancel-content', { ns: 'recapiti' })}
        </DialogContentText>
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={handleClose} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button onClick={handleConfirm} variant="contained" autoFocus>
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default CancelVerificationModal;
