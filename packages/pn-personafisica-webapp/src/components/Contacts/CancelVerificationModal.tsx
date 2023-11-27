import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent, useIsMobile } from '@pagopa-pn/pn-commons';

import { resetPecValidation } from '../../redux/contact/reducers';
import { useAppDispatch } from '../../redux/hooks';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const CancelVerificationModal = ({ open, handleClose }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);

  const handleConfirm = () => {
    // we remove the default legal address only interface side, with the goal of letting the user know that needs to add
    // a new email to modify the verifying pec address
    dispatch(resetPecValidation());
    handleClose();
  };

  return (
    <PnDialog open={open} onClose={handleClose} data-testid="cancelVerificationModal">
      <DialogTitle id="dialog-title" sx={{ textAlign: textPosition, pt: 4, px: 4 }}>
        {t('legal-contacts.validation-cancel-title', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent sx={{ px: 4 }}>
        <DialogContentText>
          {t('legal-contacts.validation-cancel-content', { ns: 'recapiti' })}
        </DialogContentText>
      </PnDialogContent>
      <PnDialogActions
        disableSpacing={isMobile}
        sx={{
          textAlign: textPosition,
          flexDirection: isMobile ? 'column-reverse' : 'row',
          px: 4,
          pb: 4,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={isMobile ? { width: '100%', mt: 2 } : null}
        >
          {t('button.annulla')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{ width: isMobile ? '100%' : null }}
        >
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default CancelVerificationModal;
