import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, DialogContentText, DialogTitle, Stack, TypographyProps } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type DialogProps = {
  open: boolean;
  title: string;
  subtitle: string;
  content?: string;
  slotProps?: {
    contentProps: TypographyProps;
  };
  illustration?: ReactNode;
  onConfirm: () => void;
  onDiscard: () => void;
};

const InformativeDialog: React.FC<DialogProps> = ({
  open,
  title,
  subtitle,
  content,
  slotProps,
  illustration,
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
        <Stack
          spacing={2}
          direction={{ xs: 'column', lg: 'row' }}
          alignItems={illustration ? 'center' : 'flex-start'}
        >
          <Stack spacing={1}>
            <DialogContentText id="dialog-description" color="text.primary">
              {subtitle}
            </DialogContentText>

            {content && (
              <DialogContentText sx={{ mt: 2 }} color="text.primary" {...slotProps?.contentProps}>
                {content}
              </DialogContentText>
            )}
          </Stack>

          {illustration && (
            <Box
              sx={{
                flex: '0 0 249px',
                position: 'relative',
                top: 8,
              }}
            >
              {illustration}
            </Box>
          )}
        </Stack>
      </PnDialogContent>
      <PnDialogActions>
        <Button key="cancel" onClick={onDiscard} variant="outlined" data-testid="discardButton">
          {t('button.annulla')}
        </Button>
        <Button
          key="confirm"
          onClick={onConfirm}
          variant="contained"
          data-testid="understandButton"
        >
          {t('button.understand')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default InformativeDialog;
