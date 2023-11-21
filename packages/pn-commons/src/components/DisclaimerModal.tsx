import { useMemo, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from '@mui/material';

import { useIsMobile } from '../hooks';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  title?: string;
  content?: string;
  checkboxLabel?: string;
};

const DisclaimerModal = ({
  onConfirm,
  onCancel,
  confirmLabel,
  title,
  content,
  checkboxLabel,
}: Props) => {
  const isMobile = useIsMobile();
  const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
  const [checked, setChecked] = useState(false);
  const disabledConfirm = !checked && !!checkboxLabel;

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <Dialog open={true} data-testid="disclaimerDialog">
      {title && <DialogTitle sx={{ p: 4, pb: 2 }}>{title}</DialogTitle>}
      <DialogContent sx={{ p: 4 }}>
        {content && <Box>{content}</Box>}
        {checkboxLabel && (
          <Box sx={{ mt: 2, ml: 0.5 }}>
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
      </DialogContent>
      <DialogActions
        disableSpacing={isMobile}
        sx={{
          textAlign: textPosition,
          flexDirection: isMobile ? 'column-reverse' : 'row',
          p: 4,
          pt: 0,
        }}
      >
        <Button
          id="cancelButton"
          variant="outlined"
          onClick={onCancel}
          fullWidth={isMobile}
          data-testid="disclaimer-cancel-button"
        >
          {getLocalizedOrDefaultLabel('common', 'button.annulla', 'Annulla')}
        </Button>
        <Button
          id="confirmButton"
          variant="contained"
          onClick={onConfirm}
          disabled={disabledConfirm}
          fullWidth={isMobile}
          data-testid="disclaimer-confirm-button"
          sx={{ mb: isMobile ? 2 : 0 }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisclaimerModal;
