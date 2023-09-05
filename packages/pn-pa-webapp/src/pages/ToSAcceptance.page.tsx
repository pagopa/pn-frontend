import { ReactNode, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Grid, Link, Typography } from '@mui/material';
import {
  ConsentUser,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
} from '@pagopa-pn/pn-commons';
import { TOSAgreement } from '@pagopa/mui-italia';

import * as routes from '../navigation/routes.const';
import { acceptPrivacy, acceptToS } from '../redux/auth/actions';
import { useAppDispatch } from '../redux/hooks';

type TermsOfServiceProps = {
  tosConsent: ConsentUser;
  privacyConsent: ConsentUser;
};

const TermsOfService = ({ tosConsent, privacyConsent }: TermsOfServiceProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const redirectPrivacyLink = () => navigate(`${PRIVACY_LINK_RELATIVE_PATH}`);
  const redirectToSLink = () => navigate(`${TOS_LINK_RELATIVE_PATH}`);

  const PrivacyLink = ({ children }: { children?: ReactNode }) => (
    <Link
      key="privacy-link"
      data-testid="privacy-link"
      sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
      onClick={redirectPrivacyLink}
    >
      {children}
    </Link>
  );

  const TosLink = ({ children }: { children?: ReactNode }) => (
    <Link
      key="tos-link"
      data-testid="tos-link"
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
      navigate(routes.DASHBOARD);
    }
  }, [tosConsent, privacyConsent]);

  return (
    <Grid
      container
      sx={{ backgroundColor: '#FAFAFA', height: '100%' }}
      justifyContent="center"
      alignContent="center"
      data-testid="tos-acceptance-page"
    >
      <Grid item xs={10} sm={8} md={6}>
        <TOSAgreement
          productName={t('tos.title', 'SEND - Servizio Notifiche Digitali')}
          description={
            <Box display="flex" alignItems="center">
              <Typography color="text.secondary" variant="body1">
                <Trans
                  ns={'common'}
                  i18nKey={'tos.switch-label'}
                  components={[<TosLink key={'tos-link'} />, <PrivacyLink key={'privacy-link'} />]}
                >
                  Accedendo, accetti i <TosLink>Termini e condizioni d’uso</TosLink> del servizio e
                  confermi di aver letto l’<PrivacyLink>Informativa Privacy</PrivacyLink>.
                </Trans>
              </Typography>
            </Box>
          }
          onConfirm={handleAccept}
          confirmBtnLabel={t('tos.button', 'Accedi')}
        />
      </Grid>
    </Grid>
  );
};

export default TermsOfService;
