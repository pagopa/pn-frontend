import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { Alert, Box, Link, Typography } from '@mui/material';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeDomicileBanner } from '../../redux/sidemenu/reducers';
import { RootState } from '../../redux/store';
import { TrackEventType } from '../../utility/events';
import { trackEventByType } from '../../utility/mixpanel';

const DomicileBanner = () => {
  const { t } = useTranslation(['notifiche']);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state: RootState) => state.generalInfoState.domicileBannerOpened);
  const defaultAddresses = useAppSelector(
    (state: RootState) => state.generalInfoState.defaultAddresses
  );
  const path = pathname.split('/');
  const source = path[path.length - 1] === 'notifica' ? 'detail' : 'list';

  const handleClose = useCallback(() => {
    trackEventByType(TrackEventType.DIGITAL_DOMICILE_BANNER_CLOSE, { source });
    dispatch(closeDomicileBanner());
  }, [closeDomicileBanner]);

  const handleAddDomicile = useCallback(() => {
    trackEventByType(TrackEventType.DIGITAL_DOMICILE_LINK);
    navigate(routes.RECAPITI);
  }, []);

  const lackingAddressTypes = useMemo(
    () =>
      [LegalChannelType.PEC, CourtesyChannelType.EMAIL].filter(
        (type) => !defaultAddresses.some((address) => address.channelType === type)
      ),
    [defaultAddresses]
  );

  useEffect(() => {
    if (lackingAddressTypes.length === 0) {
      dispatch(closeDomicileBanner());
    }
  }, [lackingAddressTypes]);

  const messageIndex = Math.floor(Math.random() * lackingAddressTypes.length);
  const messageType = lackingAddressTypes[messageIndex] as string;

  return open ? (
    <Box mb={5}>
      <Alert
        severity="info"
        variant="outlined"
        onClose={handleClose}
        data-testid="addDomicileBanner"
        sx={{ padding: 2 }}
      >
        {/* 
          The link has the attribute component="button" since this allows it to be launched by pressing the Enter key,
          otherwise it is launched through the mouse only.
          Cfr. PN-5528.
        */}
        <Box>
          <Typography variant="body2">
            {t(`detail.domicile_${messageType}`)}{' '}
            <Link
              role="button"
              component="button"
              variant="body2"
              fontWeight={'bold'}
              onClick={handleAddDomicile}
              tabIndex={0}
              display="inline-block"
              sx={{ cursor: 'pointer' }}
            >
              {t(`detail.add_domicile_${messageType}`)}
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
