import { Button, Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../redux/hooks";
import { resetPecValidation } from "../../redux/contact/reducers";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const CancelVerificationModal = ({ open, handleClose }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    // we remove the default legal address only interface side, with the goal of letting the user know that needs to add
    // a new email to modify the verifying pec address
    dispatch(resetPecValidation());
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="dialog-title" sx={{ pt: 4, px: 4 }}>
        {t('legal-contacts.validation-cancel-title', { ns: 'recapiti' })}
      </DialogTitle>
      <DialogContent sx={{ px: 4 }}>
        {t('legal-contacts.validation-cancel-content', { ns: 'recapiti' })}
      </DialogContent>
      <DialogActions sx={{ pb: 4, px: 4 }}>
        <Button onClick={handleClose} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button onClick={handleConfirm} variant="contained">
          {t('button.conferma')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelVerificationModal;