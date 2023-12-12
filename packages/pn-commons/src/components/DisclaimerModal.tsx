import { useState } from 'react';

import { Box, Button, Checkbox, DialogTitle, FormControlLabel } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import PnDialog from './PnDialog/PnDialog';
import PnDialogActions from './PnDialog/PnDialogActions';
import PnDialogContent from './PnDialog/PnDialogContent';

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  title?: string;
  content?: string;
  checkboxLabel?: string;
};

const DisclaimerModal: React.FC<Props> = ({
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

  return (
    <PnDialog open={true} data-testid="disclaimerDialog">
      {title && <DialogTitle>{title}</DialogTitle>}
      <PnDialogContent>
        {content && <Box>{content}</Box>}
        {checkboxLabel && (
          <Box sx={{ mt: 2, ml: 0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
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
        <Button variant="outlined" onClick={onCancel} data-testid="disclaimer-cancel-button">
          {getLocalizedOrDefaultLabel('common', 'button.annulla', 'Annulla')}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={disabledConfirm}
          data-testid="disclaimer-confirm-button"
        >
          {confirmLabel}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default DisclaimerModal;
