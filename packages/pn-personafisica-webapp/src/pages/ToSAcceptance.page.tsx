import { ReactNode, useEffect, useState } from 'react';
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

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
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
  const [accepted, setAccepted] = useState(false);

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
      sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
      onClick={redirectPrivacyLink}
      data-testid="privacy-link"
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
        data-testid="tos-acceptance-page"
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
                sx={{ margin: 2 }}
              />
              <Typography color="text.secondary" variant="body1">
                <Trans
                  ns={'common'}
                  i18nKey={'tos.switch-label'}
                  components={[<PrivacyLink key={'privacy-link'} />, <TosLink key={'tos-link'} />]}
                />
              </Typography>
            </Box>
          </TOSAgreement>
        </Grid>
      </Grid>
    </LoadingPageWrapper>
  );
};

export default TermsOfService;
