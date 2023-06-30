import { Alert, Box, Link, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import * as routes from '../../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeDomicileBanner } from '../../redux/sidemenu/reducers';
import { RootState } from '../../redux/store';
import { TrackEventType } from '../../utils/events';
import { trackEventByType } from '../../utils/mixpanel';

const messageIndex = Math.floor(Math.random() * 4) + 1;
// const messages = [
//   'detail.domicile_1',
//   'detail.domicile_2',
//   'detail.domicile_3',
//   'detail.domicile_4',
// ];

const DomicileBanner = () => {
  const { t } = useTranslation(['notifiche']);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state: RootState) => state.generalInfoState.domicileBannerOpened);
  const legalDomicile = useAppSelector((state: RootState) => state.generalInfoState.legalDomicile);
  const path = pathname.split('/');
  const source = path[path.length - 1] === 'notifica' ? 'detail' : 'list';

  const handleClose = () => {
    trackEventByType(TrackEventType.DIGITAL_DOMICILE_BANNER_CLOSE, { source });
    dispatch(closeDomicileBanner());
  };
  const handleAddDomicile = () => {
    trackEventByType(TrackEventType.DIGITAL_DOMICILE_LINK);
    navigate(routes.RECAPITI);
  };

  useEffect(() => {
    if (legalDomicile && legalDomicile.length > 0) {
      dispatch(closeDomicileBanner());
    }
  }, [legalDomicile]);

  return open ? (
    <Box mb={5}>
      <Alert
        severity="info"
        variant="outlined"
        onClose={handleClose}
        data-testid="addDomicileBanner"
        sx={{ padding: '16px' }}
      >
        {/* 
          The link has the attribute component="button" since this allows it to be launched by pressing the Enter key,
          otherwise it is launched through the mouse only.
          As the Typography renders as a <p> element, I added the stack to let the link be next (and not below) the text.
          An explicit left margin had to be added to insert a slight separation between text and link.
          Cfr. PN-5528.
        */}
        <Box>
          <Typography variant="body2">
            {t(`detail.domicile_${messageIndex}`)}{' '}
            <Link
              role="button"
              variant="body2"
              fontWeight={'bold'}
              onClick={handleAddDomicile}
              tabIndex={0}
              display="inline-block"
              sx={{ cursor: 'pointer' }}
            >
              {t(`detail.add_domicile_${messageIndex}`)}
            </Link>
          </Typography>
        </Box>
      </Alert>
    </Box>
  ) : (
    <></>
  );
};

export default DomicileBanner;
