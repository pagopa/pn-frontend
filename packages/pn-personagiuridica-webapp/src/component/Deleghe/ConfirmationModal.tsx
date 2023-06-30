import * as React from 'react';
import { Typography, Box, Button, Grid, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  title: string;
  subtitle?: string | JSX.Element;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onConfirmLabel?: string;
  onClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onCloseLabel?: string;
  minHeight?: string;
  width?: string;
};
export default function ConfirmationModal({
  open,
  title,
  subtitle = '',
  onConfirm,
  onConfirmLabel = 'Riprova',
  onClose,
  onCloseLabel = 'Annulla',
  minHeight = '4em',
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useIsMobile();

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      data-testid="confirmationDialog"
    >
      <Grid container direction="column" sx={{ minHeight, minWidth: isMobile ? 0 : '32em' }}>
        <Box mx={3} mt={4} sx={{ height: '100%' }}>
          <Typography mb={2} variant="h5" sx={{ fontSize: '24px', fontWeight: '600' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle2" sx={{ fontSize: '20px', fontWeight: '300' }}>
              {subtitle}
            </Typography>
          )}

          <Stack
            direction={isMobile ? 'column' : 'row'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            ml={'auto'}
            pb={4}
            data-testid="dialogStack"
          >
            <Grid item sx={{ width: isMobile ? '100%' : null }} mt={4} mr={isMobile ? 0 : 1}>
              <Button
                sx={{ width: isMobile ? '100%' : null }}
                onClick={onClose}
                color="primary"
                variant="outlined"
                data-testid="dialogAction"
              >
                {onCloseLabel}
              </Button>
            </Grid>

            {onConfirm && (
              <Grid item sx={{ width: isMobile ? '100%' : null }} mt={4}>
                <Button
                  sx={{ width: isMobile ? '100%' : null }}
                  color="primary"
                  variant="contained"
                  onClick={onConfirm}
                  data-testid="dialogAction"
                >
                  {onConfirmLabel}
                </Button>
              </Grid>
            )}
          </Stack>
        </Box>
      </Grid>
    </Dialog>
  );
}
