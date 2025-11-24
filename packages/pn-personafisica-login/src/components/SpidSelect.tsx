import { Trans, useTranslation } from 'react-i18next';

import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Icon,
  IconButton,
  Link,
  Typography,
} from '@mui/material';

import SpidBig from '../assets/spid_big.svg';
import { PFLoginEventsType } from '../models/PFLoginEventsType';
import { getConfiguration } from '../services/configuration.service';
import { IdentityProvider, getIDPS } from '../utility/IDPS';
import PFLoginEventStrategyFactory from '../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import { shuffleList } from '../utility/utils';

const SpidSelect = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
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
    <Dialog
      open={show}
      fullScreen
      aria-labelledby="spid-select"
      transitionDuration={0}
      onClose={onClose}
    >
      <DialogContent sx={{ p: 0 }}>
        <Grid
          container
          direction="column"
          id="spidSelect"
          justifyContent="center"
          alignItems="center"
        >
          <Grid container direction="row" justifyContent="space-around" mt={3}>
            <Grid item xs={1}>
              <img src={SpidBig} aria-hidden />
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'right' }}>
              <IconButton
                color="primary"
                onClick={onClose}
                id="backIcon"
                aria-label={t('button.close', { ns: 'common' })}
              >
                <ClearOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item>
            <Typography
              id="spid-select"
              py={5}
              px={0}
              color="textPrimary"
              variant="h3"
              component="h1"
              sx={{ textAlign: 'center' }}
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
              onClick={onClose}
            >
              {t('spidSelect.cancelButton')}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SpidSelect;
