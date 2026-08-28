import { useState } from 'react';

import { Box, Button, Checkbox, DialogTitle, FormControlLabel } from '@mui/material';
import { MIButton } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import PnDialog from './PnDialog/PnDialog';
import PnDialogActions from './PnDialog/PnDialogActions';
import PnDialogContent from './PnDialog/PnDialogContent';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  title?: string;
  content?: string;
  checkboxLabel?: string;
};

const DisclaimerModal: React.FC<Props> = ({
  open = false,
  onConfirm,
  onCancel,
  confirmLabel,
  title,
  content,
  checkboxLabel,
}) => {
  const [checked, setChecked] = useState(false);
  const disabledConfirm = !checked && !!checkboxLabel;

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleCancel = () => {
    setChecked(false);
    onCancel();
  };

  const handleConfirm = () => {
    setChecked(false);
    onConfirm();
  };

  return (
    <PnDialog open={open} data-testid="disclaimerDialog">
      {title && <DialogTitle>{title}</DialogTitle>}
      <PnDialogContent>
        {content && <Box>{content}</Box>}
        {checkboxLabel && (
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  id="checkbox-agree"
                  checked={checked}
                  onChange={handleChange}
                  data-testid="disclaimer-checkbox"
                />
              }
              label={checkboxLabel}
            />
          </Box>
        )}
      </PnDialogContent>
      <PnDialogActions>
        <MIButton
          id="cancelButton"
          variant="outlined"
          onClick={handleCancel}
          data-testid="disclaimer-cancel-button"
        >
          {getLocalizedOrDefaultLabel('common', 'button.annulla', 'Annulla')}
        </MIButton>
        <Button
          id="confirmButton"
          variant="contained"
          onClick={handleConfirm}
          data-testid="disclaimer-confirm-button"
          disabled={disabledConfirm}
        >
          {confirmLabel}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default DisclaimerModal;
