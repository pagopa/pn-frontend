import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type DialogProps = {
  open: boolean;
  title: string;
  subtitle: string | ReactNode;
  content?: string;
  onConfirm: () => void;
  onDiscard?: () => void;
};

const InformativeDialog: React.FC<DialogProps> = ({
  open,
  title,
  subtitle,
  content,
  onConfirm,
  onDiscard,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <PnDialog
      open={open}
      onClose={onDiscard}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="informativeDialog"
    >
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description" color="text.primary">
          {subtitle}
        </DialogContentText>

        {content && (
          <Typography sx={{ mt: 2 }} color="text.primary">
            {content}
          </Typography>
        )}
      </PnDialogContent>
      <PnDialogActions>
        {onDiscard && (
          <Button key="cancel" onClick={onDiscard} variant="outlined" data-testid="discardButton">
            {t('button.annulla')}
          </Button>
        )}
        <Button
          key="confirm"
          onClick={onConfirm}
          variant="contained"
          data-testid="understandButton"
          autoFocus
        >
          {t('button.understand')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default InformativeDialog;
