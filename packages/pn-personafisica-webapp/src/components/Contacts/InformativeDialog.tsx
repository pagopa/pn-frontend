import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
  TypographyProps,
} from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

type DialogProps = {
  open: boolean;
  title: string;
  subtitle: string | ReactNode;
  content?: string;
  slotProps?: {
    contentProps: TypographyProps;
  };
  illustration?: ReactNode;
  onConfirm: () => void;
  onDiscard?: () => void;
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
              <Typography sx={{ mt: 2 }} color="text.primary" {...slotProps?.contentProps}>
                {content}
              </Typography>
            )}
          </Stack>

          {illustration && (
            <Box
              sx={{
                flex: { xs: '0 0 auto', lg: '0 0 249px' },
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
