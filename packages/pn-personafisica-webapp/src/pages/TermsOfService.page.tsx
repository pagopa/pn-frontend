import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';

import { PRIVACY_LINK_RELATIVE_PATH, TermsOfServiceHandler, URL_DIGITAL_NOTIFICATIONS, useIsMobile } from '@pagopa-pn/pn-commons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { acceptToS } from '../redux/auth/actions';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';

const TermsOfService = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tos = useAppSelector((state: RootState) => state.userState.tos);

  const redirectPrivacyLink = () => window.location.assign(`${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`);

  const redirectToSLink = () => window.location.assign(`${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`);

  const handleAccept = () => {
    void dispatch(acceptToS()).unwrap()
    .then(() => {
      navigate(routes.NOTIFICHE);
    })
    .catch(_ => {
      console.error(_);
    });
  };

  useEffect(() => {
    if (tos) {
      navigate(routes.NOTIFICHE);
    }
  }, [tos]);

  return (
    <Fragment>
      <Grid container justifyContent="center" my={isMobile ? 4 : 16}>
        <Grid item xs={10} sm={8} md={4} display="flex" alignItems="center" flexDirection="column">
          <Typography mb={2} variant="h2" color="textPrimary" textAlign="center">
            {t('tos.title')}
          </Typography>
          <TermsOfServiceHandler
            handleRedirectPrivacyLink={redirectPrivacyLink}
            handleRedirectTosLink={redirectToSLink}
            handleAcceptTos={handleAccept}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default TermsOfService;
