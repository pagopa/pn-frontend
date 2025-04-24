import { ReactNode, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Grid, Link, Switch, Typography } from '@mui/material';
import {
  ConsentActionType,
  ConsentType,
  ConsentUser,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
} from '@pagopa-pn/pn-commons';
import { TOSAgreement } from '@pagopa/mui-italia';

import * as routes from '../navigation/routes.const';
import { acceptTosPrivacy } from '../redux/auth/actions';
import { useAppDispatch } from '../redux/hooks';

type TermsOfServiceProps = {
  tosConsent: ConsentUser;
  privacyConsent: ConsentUser;
};

const TermsOfService = ({ tosConsent, privacyConsent }: TermsOfServiceProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  /*
  This is a temporary fix to resolve the bug PN-9921.
  The problem is in useProcess hook, more precisely in the setCurrentSituation call in endCurrentStep.
  Here the currentValue remains equal to NOT_STARTED and the app loops.
  const redirectPrivacyLink = () => navigate(`${PRIVACY_LINK_RELATIVE_PATH}`);
  const redirectToSLink = () => navigate(`${TOS_LINK_RELATIVE_PATH}`);
  ----------------------
  Andrea Cimini, 2024.03.13
  ----------------------
  */
  const redirectPrivacyLink = () => window.open(`${PRIVACY_LINK_RELATIVE_PATH}`, '_blank');
  const redirectToSLink = () => window.open(`${TOS_LINK_RELATIVE_PATH}`, '_blank');

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
    const tosPrivacyBody = [];

    if (!tosConsent.accepted) {
      // eslint-disable-next-line functional/immutable-data
      tosPrivacyBody.push({
        action: ConsentActionType.ACCEPT,
        version: tosConsent.consentVersion,
        type: ConsentType.TOS,
      });
    }

    if (!privacyConsent.accepted) {
      // eslint-disable-next-line functional/immutable-data
      tosPrivacyBody.push({
        action: ConsentActionType.ACCEPT,
        version: privacyConsent.consentVersion,
        type: ConsentType.DATAPRIVACY,
      });
    }

    await dispatch(acceptTosPrivacy(tosPrivacyBody));
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
