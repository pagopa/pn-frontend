import * as React from 'react';
import { Typography, Box, Button, Grid, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';
import VerificationCodeComponent from './VerificationCodeComponent';

type Props = {
  open: boolean;
  code: string;
  name: string;
  handleClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onCloseLabel?: string;
  minHeight?: string;
  width?: string;
};
const VerificationCodeModal = ({
  open,
  code,
  name,
  handleClose,
  minHeight = '4em',
}: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useIsMobile();
  const { t } = useTranslation(['deleghe']);
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Grid container direction="column" sx={{ minHeight, minWidth: isMobile ? 0 : '32em' }}>
        <Box mx={3} sx={{ height: '100%' }}>
          <Grid container item mt={4}>
            <Grid item xs={10}>
              <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: '600' }}>
                  {t('Codice di verifica delega ')}{name}
              </Typography>
              <Typography>
                  {t('Condividi questo codice con la persona delegata: dovrà inserirlo all’accettazione della notifica.')}
              </Typography>
              <Divider sx={{my:2}}/>
              <Typography sx={{fontWeight:600}}>
                  {t('Codice di verifica')}
              </Typography>
              <Box sx={{mt:1}}>
                <VerificationCodeComponent code={code}/>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{my:2}}/>

          <Stack
            direction={isMobile ? 'column' : 'row'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            ml={'auto'}
            pb={isMobile ? 4 : 0}
          >
            <Grid item sx={{ width: isMobile ? '100%' : null }} my={4} mr={isMobile ? 0 : 1}>
              <Button
                sx={{ width: isMobile ? '100%' : null }}
                onClick={handleClose}
                color="primary"
                variant="outlined"
              >
                {t('Chiudi')}
              </Button>
            </Grid>
          </Stack>
        </Box>
      </Grid>
    </Dialog>
  );
};

export default VerificationCodeModal;
