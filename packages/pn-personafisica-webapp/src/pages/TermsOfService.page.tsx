import { ReactNode, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { TermsOfServiceHandler, useIsMobile } from '@pagopa-pn/pn-commons';

import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { acceptToS } from '../redux/auth/actions';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';

const TermsOfService = () => {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tos = useAppSelector((state: RootState) => state.userState.tos);

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
    <LoadingPageWrapper isInitialized>
      <Grid container justifyContent="center" my={isMobile ? 4 : 16}>
        <Grid item xs={10} sm={8} md={4} display="flex" alignItems="center" flexDirection="column">
          <TermsOfServiceHandler
            handleAcceptTos={handleAccept}
            transComponent={(path: string, components: Array<ReactNode>, defaultLoaclization: ReactNode) => (
              <Trans i18nKey={path} components={components}>
                {defaultLoaclization}
              </Trans>
            )}
          />
        </Grid>
      </Grid>
    </LoadingPageWrapper>
  );
};

export default TermsOfService;
