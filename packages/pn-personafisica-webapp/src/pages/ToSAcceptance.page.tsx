import { Fragment, ReactNode, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Grid, Link } from '@mui/material';
import { TOSAgreement } from '@pagopa/mui-italia';
import { PRIVACY_LINK_RELATIVE_PATH, TOS_LINK_RELATIVE_PATH } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { acceptToS } from '../redux/auth/actions';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';

const TermsOfService = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
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
    void dispatch(acceptToS())
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
    <Fragment>
      <Grid container justifyContent="center" sx={{ backgroundColor: '#FAFAFA' }}>
        <Grid item xs={10} sm={8} md={4} display="flex" alignItems="center" flexDirection="column">
          <TOSAgreement
            productName={t('tos.title', 'Piattaforma Notifiche')}
            description={
              <Trans
                ns={'common'}
                i18nKey={'tos.switch-label'}
                components={[<PrivacyLink key={'privacy-link'} />, <TosLink key={'tos-link'} />]}
              >
                Accedendo, accetti i <TosLink>Termini e condizioni d’uso</TosLink> del servizio e
                confermi di aver letto l’<PrivacyLink>Informativa Privacy</PrivacyLink>.
              </Trans>
            }
            onConfirm={handleAccept}
            confirmBtnLabel={t('tos.button', 'Accedi')}
            confirmBtnDisabled={false}
          >
            <></>
          </TOSAgreement>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default TermsOfService;
