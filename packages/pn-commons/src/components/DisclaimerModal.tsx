import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel
} from "@mui/material";
import { useMemo, useState } from "react";
import { getLocalizedOrDefaultLabel } from "../services/localization.service";
import { useIsMobile } from "../hooks";

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  title?: string;
  content?: string;
};

const DisclaimerModal = ({ open, onConfirm, onCancel, confirmLabel, title, content }: Props) => {
  const isMobile = useIsMobile();
  const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };
  
  return (
    <Dialog open={open}>
      {title &&
        <DialogTitle>
          {title}
        </DialogTitle>
      }
      <DialogContent>
        {content &&
          <Box>
            {content}
          </Box>
        }
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
              />
            }
            label={getLocalizedOrDefaultLabel('common', 'capito', 'Ho capito')}
          />
        </Box>
      </DialogContent>
      <DialogActions
        disableSpacing={isMobile}
        sx={{
          textAlign: textPosition,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          fullWidth={isMobile}
          data-testid="disclaimer-confirm-button"
        >
          {getLocalizedOrDefaultLabel('common', 'button.annulla', 'Annulla')}
        </Button>
        <Button
          variant="outlined"
          onClick={onConfirm}
          disabled={!checked}
          fullWidth={isMobile}
          data-testid="disclaimer-confirm-button"
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisclaimerModal;