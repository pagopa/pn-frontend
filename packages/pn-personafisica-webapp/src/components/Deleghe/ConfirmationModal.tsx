import * as React from 'react';

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  title: string;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onConfirmLabel?: string;
  handleClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onCloseLabel?: string;
  minHeight?: string;
  width?: string;
};
export default function ConfirmationModal({
  open,
  title,
  onConfirm,
  onConfirmLabel = 'Riprova',
  handleClose,
  onCloseLabel = 'Annulla',
  minHeight = '4em',
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useIsMobile();

  return (
    <Dialog
      id="confirmation-dialog"
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      data-testid="confirmationDialog"
    >
      <Grid container direction="column" sx={{ minHeight, minWidth: isMobile ? 0 : '32em' }}>
        <Box mx={3} sx={{ height: '100%' }}>
          <Grid container item mt={4}>
            <Grid item xs={10}>
              <Typography
                id="confirmation-dialog-title"
                variant="h5"
                sx={{ fontSize: '18px', fontWeight: '600' }}
              >
                {title}
              </Typography>
            </Grid>
          </Grid>

          <Stack
            direction={isMobile ? 'column-reverse' : 'row'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            ml={'auto'}
            pb={isMobile ? 4 : 0}
          >
            <Grid
              item
              sx={{ width: isMobile ? '100%' : null }}
              mt={isMobile ? 2 : 4}
              mr={isMobile ? 0 : 1}
            >
              <Button
                id="dialog-close-button"
                sx={{ width: isMobile ? '100%' : null }}
                onClick={handleClose}
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
                  id="dialog-action-button"
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
