import { Trans, useTranslation } from 'react-i18next';

import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import SpidBig from '../../assets/spid_big.svg';
import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { getConfiguration } from '../../services/configuration.service';
import { IdentityProvider, getIDPS } from '../../utility/IDPS';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import { shuffleList } from '../../utility/utils';

const SpidSelect = ({ onBack }: { onBack: () => void }) => {
  const { URL_API_LOGIN, SPID_TEST_ENV_ENABLED, SPID_VALIDATOR_ENV_ENABLED } = getConfiguration();
  const { t } = useTranslation(['login']);
  const IDPS = getIDPS(SPID_TEST_ENV_ENABLED, SPID_VALIDATOR_ENV_ENABLED);
  const shuffledIDPS = shuffleList(IDPS.identityProviders);

  const getSPID = (IDP: IdentityProvider) => {
    sessionStorage.setItem('IDP', IDP.entityId);

    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_IDP_SELECTED, {
      SPID_IDP_NAME: IDP.name,
      SPID_IDP_ID: IDP.entityId,
    });

    window.location.assign(
      `${URL_API_LOGIN}/login?entityID=${IDP.entityId}&authLevel=SpidL2&RelayState=send`
    );
  };

  return (
    <Grid
      container
      direction="column"
      sx={{ backgroundColor: '#FFF', minHeight: '100vh' }}
      id="spidSelect"
    >
      <Grid container direction="row" justifyContent="space-around" mt={3}>
        <Grid item xs={1}>
          <img src={SpidBig} />
        </Grid>
        <Grid item xs={1} sx={{ textAlign: 'right' }}>
          <IconButton color="primary" onClick={onBack} id="backIcon">
            <ClearOutlinedIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing="10">
        <Grid item>
          <Typography
            id="spid-select"
            py={5}
            px={0}
            color="textPrimary"
            variant="h3"
            sx={{
              textAlign: 'center',
            }}
            component="div"
          >
            {t('spidSelect.title')}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" justifyItems="center" spacing={2}>
            {shuffledIDPS.map((IDP, i) => (
              <Grid
                item
                key={IDP.entityId}
                xs={6}
                textAlign={i % 2 === 0 ? 'right' : 'left'}
                sx={{ minWidth: '100px' }}
              >
                <Button
                  id={`spid-select-${IDP.entityId}`}
                  onClick={() => getSPID(IDP)}
                  sx={{ width: '100px', padding: '0' }}
                  aria-label={IDP.name}
                >
                  <Icon sx={{ width: '100px', height: '48px' }}>
                    <img width="100px" src={IDP.imageUrl} alt={IDP.name} />
                  </Icon>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            py={3}
            px={0}
            color="textPrimary"
            variant="body2"
            sx={{
              fontSize: '14px',
              textAlign: 'center',
            }}
            component="div"
          >
            <Trans i18nKey="spidSelect.hintText" ns="login">
              <Link href={IDPS.richiediSpid} id="requestForSpid">
                {'spidSelect.hintText'}
              </Link>
            </Trans>
          </Typography>
          <Button
            type="submit"
            variant="outlined"
            id="backButton"
            sx={{
              borderRadius: '4px',
              width: '328px',
              height: '50px',
            }}
            onClick={onBack}
          >
            {t('spidSelect.cancelButton')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SpidSelect;
