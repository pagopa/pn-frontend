import { Alert, Box, Link, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import * as routes from '../../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeDomicileBanner } from '../../redux/sidemenu/actions';
import { RootState } from '../../redux/store';

const messageIndex = Math.floor(Math.random() * 4) + 1;
// const messages = [
//   'detail.domicile_1',
//   'detail.domicile_2',
//   'detail.domicile_3',
//   'detail.domicile_4',
// ];

const DomicileBanner = () => {
  const { t } = useTranslation(['notifiche']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state: RootState) => state.generalInfoState.domicileBannerOpened);
  const legalDomicile = useAppSelector((state: RootState) => state.generalInfoState.legalDomicile);

  const handleClose = () => {
    dispatch(closeDomicileBanner());
  };
  const handleAddDomicile = () => {
    navigate(routes.RECAPITI);
  };

  useEffect(() => {
    if (legalDomicile && legalDomicile.length > 0) {
      dispatch(closeDomicileBanner());
    }
  }, [legalDomicile]);

  return open ? (
    <Box mb={2.5}>
      <Alert
        severity="info"
        variant="outlined"
        onClose={handleClose}
        data-testid="addDomicileBanner"
        sx={{ padding: '16px' }}
      >
        <Typography variant="body2" sx={{overflow: 'hidden'}}>
          {t(`detail.domicile_${messageIndex}`)}{' '}
          <Link role="button" fontWeight={'bold'} onClick={handleAddDomicile}>
            {t(`detail.add_domicile_${messageIndex}`)}
          </Link>
        </Typography>
      </Alert>
    </Box>
  ) : (
    <></>
  );
};

export default DomicileBanner;
