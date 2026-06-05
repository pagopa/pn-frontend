import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, CircularProgress, Grid, styled } from '@mui/material';
import { CieIcon, SpidIcon } from '@pagopa/mui-italia/icons';

import { getConfiguration } from '../../services/configuration.service';

type Props = {
  authorizingEntityId: string | null;
  handleCieClick: () => void;
  handleSpidClick: () => void;
};

const LoginButton = styled(Button)({
  borderRadius: '4px',
  width: '272px',
  height: '48px',
  '& .MuiButton-startIcon': { svg: { fontSize: '25px' } },
});

const LoginButtons: React.FC<Props> = ({
  authorizingEntityId,
  handleCieClick,
  handleSpidClick,
}) => {
  const { t } = useTranslation(['login']);

  const { ONE_IDENTITY_CIE_ENTITY_ID } = getConfiguration();

  return (
    <Grid
      item
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: {
          xs: `${(100 / 12) * 10}%`,
          sm: `${(100 / 12) * 6}%`,
          md: `${(100 / 12) * 4}%`,
          lg: `${(100 / 12) * 4}%`,
          xl: `${(100 / 12) * 3}%`,
        },
      }}
    >
      <LoginButton
        id="spidButton"
        variant="contained"
        onClick={handleSpidClick}
        startIcon={<SpidIcon />}
        disabled={authorizingEntityId !== null}
        sx={{ mb: 3 }}
      >
        {t('loginPage.loginBox.spidLogin')}
      </LoginButton>
      <LoginButton
        id="cieButton"
        variant="contained"
        onClick={handleCieClick}
        startIcon={<CieIcon />}
        disabled={authorizingEntityId !== null}
        sx={{ position: 'relative' }}
      >
        {t('loginPage.loginBox.cieLogin')}
        {authorizingEntityId === ONE_IDENTITY_CIE_ENTITY_ID && (
          <CircularProgress size={20} sx={{ position: 'absolute' }} data-testid="cie-loader" />
        )}
      </LoginButton>
    </Grid>
  );
};

export default LoginButtons;
