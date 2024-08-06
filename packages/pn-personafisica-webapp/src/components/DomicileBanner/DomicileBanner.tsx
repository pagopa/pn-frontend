import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Alert, Box, Link, Typography } from '@mui/material';

import { PFEventsType } from '../../models/PFEventsType';
import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeDomicileBanner } from '../../redux/sidemenu/reducers';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

type Props = {
  source?: string;
};

const DomicileBanner = forwardRef(({ source = 'home_notifiche' }: Props, ref) => {
  const { t } = useTranslation(['notifiche']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state: RootState) => state.generalInfoState.domicileBannerOpened);
  const defaultAddresses = useAppSelector(
    (state: RootState) => state.generalInfoState.defaultAddresses
  );

  const handleClose = useCallback(() => {
    dispatch(closeDomicileBanner());
  }, [closeDomicileBanner]);

  const handleAddDomicile = useCallback(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_VIEW_CONTACT_DETAILS, { source });
    navigate(routes.RECAPITI);
  }, []);

  const messageType = useMemo(() => {
    const lackingAddressTypes = [
      LegalChannelType.PEC,
      CourtesyChannelType.EMAIL,
      CourtesyChannelType.IOMSG,
    ].filter((type) => !defaultAddresses.some((address) => address.channelType === type));
    const messageIndex = Math.floor(Math.random() * lackingAddressTypes.length);
    return lackingAddressTypes.length > 0 ? (lackingAddressTypes[messageIndex] as string) : null;
  }, [defaultAddresses]);

  useEffect(() => {
    if (!messageType) {
      dispatch(closeDomicileBanner());
    }
  }, [messageType]);

  useImperativeHandle(ref, () => messageType);

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
              fontWeight="bold"
              onClick={handleAddDomicile}
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
});

export default DomicileBanner;
