import { ReactNode, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Link, Switch, Typography } from '@mui/material';
import { TOSAgreement } from '@pagopa/mui-italia';
import { PRIVACY_LINK_RELATIVE_PATH, TOS_LINK_RELATIVE_PATH } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { acceptToS } from '../redux/auth/actions';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';

type TermsOfServiceProps = {
  isFirstAccept: boolean;
  consentVersion: string;
};

const TermsOfService = ({ isFirstAccept, consentVersion }: TermsOfServiceProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [accepted, setAccepted] = useState(false);
  const tos = useAppSelector((state: RootState) => state.userState.tos);

  const redirectPrivacyLink = () => navigate(`${PRIVACY_LINK_RELATIVE_PATH}`);
  const redirectToSLink = () => navigate(`${TOS_LINK_RELATIVE_PATH}`);

  const PrivacyLink = ({ children }: { children?: ReactNode }) => (
    <Link
      key="privacy-link"
      sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
      onClick={redirectPrivacyLink}
    >
      {children}
    </Link>
  );

  const TosLink = ({ children }: { children?: ReactNode }) => (
    <Link
      key="tos-link"
      data-testid="terms-and-conditions"
      sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
      onClick={redirectToSLink}
    >
      {children}
    </Link>
  );

  const handleAccept = () => {
    void dispatch(acceptToS(consentVersion))
      .unwrap()
      .then(() => {
        navigate(routes.NOTIFICHE);
      })
      .catch((_) => {
        console.error(_);
      });
  };

  useEffect(() => {
    if (tos) {
      navigate(routes.NOTIFICHE);
    }
  }, [tos]);

  return (
    <LoadingPageWrapper isInitialized>
      <Grid container height="100%" justifyContent="center" sx={{ backgroundColor: '#FAFAFA' }}>
        <Grid item xs={10} sm={8} md={4} display="flex" alignItems="center" flexDirection="column">
          <TOSAgreement
            productName={t('tos.title', 'Piattaforma Notifiche')}
            description={t(
              isFirstAccept ? 'tos.body' : 'tos.redo-body',
              'Prima di accedere, accetta i Termini e condizioni d’uso del servizio e leggi l’Informativa Privacy.'
            )}
            onConfirm={handleAccept}
            confirmBtnLabel={t('tos.button', 'Accedi')}
            confirmBtnDisabled={!accepted}
          >
            <Box display="flex" alignItems="center">
              <Switch
                value={accepted}
                onClick={() => setAccepted(!accepted)}
                data-testid="tosSwitch"
              />
              <Typography color="text.secondary" variant="body1">
                <Trans
                  ns={'common'}
                  i18nKey={'tos.switch-label'}
                  components={[<TosLink key={'tos-link'} />, <PrivacyLink key={'privacy-link'} />]}
                >
                  Accetto i <TosLink>Termini e condizioni d’uso del servizio</TosLink>
                  e confermo di avere letto <PrivacyLink>l’Informativa Privacy</PrivacyLink>.
                </Trans>
              </Typography>
            </Box>
          </TOSAgreement>
        </Grid>
      </Grid>
    </LoadingPageWrapper>
  );
};

export default TermsOfService;
