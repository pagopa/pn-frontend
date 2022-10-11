import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import { Grid } from '@mui/material';

import { TermsOfServiceHandler, useIsMobile } from '@pagopa-pn/pn-commons';
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
      navigate(routes.DASHBOARD);
    })
    .catch(_ => {
      console.error(_);
    });
  };

  useEffect(() => {
    if (tos) {
      navigate(routes.DASHBOARD);
    }
  }, [tos]);

  return (
    <Fragment>
      <Grid container justifyContent="center" my={isMobile ? 4 : 16}>
        <Grid item xs={10} sm={8} md={4} display="flex" alignItems="center" flexDirection="column">
          <TermsOfServiceHandler
            handleAcceptTos={handleAccept}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default TermsOfService;
