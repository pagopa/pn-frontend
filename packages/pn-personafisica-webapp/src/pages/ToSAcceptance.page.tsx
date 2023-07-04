import { ReactNode, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Link, Switch, Typography } from '@mui/material';
import { TOSAgreement } from '@pagopa/mui-italia';
import {
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
  ConsentUser,
} from '@pagopa-pn/pn-commons';

import { useAppDispatch } from '../redux/hooks';
import { acceptPrivacy, acceptToS } from '../redux/auth/actions';
import * as routes from '../navigation/routes.const';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';

type TermsOfServiceProps = {
  tosConsent: ConsentUser;
  privacyConsent: ConsentUser;
};

const TermsOfService = ({ tosConsent, privacyConsent }: TermsOfServiceProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [accepted, setAccepted] = useState(false);

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

  const handleAccept = async () => {
    try {
      if (!tosConsent.accepted) {
        await dispatch(acceptToS(tosConsent.consentVersion)).unwrap();
      }
      if (!privacyConsent.accepted) {
        await dispatch(acceptPrivacy(privacyConsent.consentVersion)).unwrap();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (tosConsent.accepted && privacyConsent.accepted) {
      navigate(routes.NOTIFICHE);
    }
  }, [tosConsent, privacyConsent]);

  return (
    <LoadingPageWrapper isInitialized>
      <Grid
        container
        sx={{ backgroundColor: '#FAFAFA', height: '100%' }}
        justifyContent="center"
        alignContent="center"
      >
        <Grid item xs={10} sm={8} md={6}>
          <TOSAgreement
            productName={t('tos.title', 'SEND - Servizio Notifiche Digitali')}
            description={t(
              tosConsent.isFirstAccept && privacyConsent.isFirstAccept
                ? 'tos.body'
                : 'tos.redo-body'
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
                  components={[<PrivacyLink key={'privacy-link'} />, <TosLink key={'tos-link'} />]}
                >
                  Accetto l’<PrivacyLink>Informativa Privacy</PrivacyLink> e i
                  <TosLink>Termini e condizioni d’uso </TosLink> di SEND.
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
