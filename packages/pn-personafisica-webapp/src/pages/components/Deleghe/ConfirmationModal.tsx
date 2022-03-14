import * as React from 'react';
import { Typography, Box, Button, Grid, IconButton, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

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
  width = '32em',
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Grid container direction="column" sx={{ minHeight, width }}>
        <Box mx={3} sx={{ height: '100%' }}>
          <Grid container item mt={4}>
            <Grid item xs={10}>
              <IconButton
                onClick={handleClose}
                style={{ position: 'absolute', top: '20px', right: '16px', zIndex: 100 }}
              >
                <ClearOutlinedIcon />
              </IconButton>
              <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: '600' }}>
                {title}
              </Typography>
            </Grid>
          </Grid>

          <Stack direction={'row'} justifyContent={'flex-end'} ml={'auto'} mt={4}>
            <Grid item mr={1}>
              <Button onClick={handleClose} color="primary" variant="outlined">
                {onCloseLabel}
              </Button>
            </Grid>

            {onConfirm && (
              <Grid item>
                <Button color="primary" variant="contained" onClick={onConfirm}>
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
