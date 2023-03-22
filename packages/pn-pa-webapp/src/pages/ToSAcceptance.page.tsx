import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Grid, Link, Typography } from '@mui/material';
import {
  ConsentUser,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
} from '@pagopa-pn/pn-commons';

import { TOSAgreement } from '@pagopa/mui-italia';
import { useAppDispatch } from '../redux/hooks';
import { acceptPrivacy, acceptToS } from '../redux/auth/actions';
import * as routes from '../navigation/routes.const';

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
      navigate(routes.DASHBOARD);
    }
  }, [tosConsent, privacyConsent]);

  return (
    <Grid
      container
      sx={{ backgroundColor: '#FAFAFA', height: '100%' }}
      justifyContent="center"
      alignContent="center"
    >
      <Grid item xs={10} sm={8} md={6}>
        <TOSAgreement
          productName={t('tos.title', 'SEND - Servizio Notifiche Digitali')}
          description={<></>}
          description={t(
            tosConsent.isFirstAccept && privacyConsent.isFirstAccept ? 'tos.body' : 'tos.redo-body',
            'Prima di accedere, accetta i Termini e condizioni d’uso del servizio e leggi l’Informativa Privacy.'
          )}
          onConfirm={handleAccept}
          confirmBtnLabel={t('tos.button', 'Accedi')}
        >
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
        </TOSAgreement>
      </Grid>
    </Grid>
  );
};

export default TermsOfService;
