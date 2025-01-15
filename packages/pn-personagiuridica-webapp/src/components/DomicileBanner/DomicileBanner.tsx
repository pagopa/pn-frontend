import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Alert, AlertColor, Box, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, ContactOperation, ContactSource } from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { setExternalEvent } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeDomicileBanner } from '../../redux/sidemenu/reducers';
import { RootState } from '../../redux/store';
import { getConfiguration } from '../../services/configuration.service';

type Props = {
  source: ContactSource;
};

type DomicileBannerData = {
  severity: AlertColor;
  message: string;
  canBeClosed: boolean;
  callToAction?: string;
  destination?: ChannelType;
  operation?: ContactOperation;
};

const getOpenStatusFromSession = () => {
  const sessionClosed = sessionStorage.getItem('domicileBannerClosed');
  // validate data
  if (sessionClosed === 'true' || sessionClosed === 'false') {
    return Boolean(sessionClosed);
  }
  return false;
};

const getDomicileData = (
  source: ContactSource,
  hasSercqSend: boolean,
  hasCourtesyAddresses: boolean,
  isDodEnabled: boolean
): DomicileBannerData | null => {
  const sessionClosed = getOpenStatusFromSession();
  if (isDodEnabled && source !== ContactSource.RECAPITI && !hasSercqSend && !sessionClosed) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return {
      destination: ChannelType.SERCQ_SEND,
      operation: ContactOperation.ADD,
      severity: 'info',
      message: 'no-sercq-send',
      canBeClosed: true,
      callToAction: 'no-sercq-cta',
    };
  } else if (
    source !== ContactSource.RECAPITI &&
    ((!hasSercqSend && sessionClosed) || !isDodEnabled) &&
    !hasCourtesyAddresses
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return {
      destination: ChannelType.EMAIL,
      operation: ContactOperation.SCROLL,
      severity: 'info',
      message: 'no-courtesy-no-sercq-send',
      canBeClosed: false,
      callToAction: 'no-courtesy-no-sercq-send-cta',
    };
  } else if (isDodEnabled && hasSercqSend && !hasCourtesyAddresses) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return {
      destination: ChannelType.EMAIL,
      operation: ContactOperation.SCROLL,
      severity: 'warning',
      message: 'no-courtesy',
      canBeClosed: false,
      callToAction: source === ContactSource.RECAPITI ? undefined : 'complete-addresses',
    };
  }
  return null;
};

const DomicileBanner: React.FC<Props> = ({ source }) => {
  const { t } = useTranslation(['recapiti']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state: RootState) => state.generalInfoState.domicileBannerOpened);
  const { IS_DOD_ENABLED } = getConfiguration();

  const digitalAddresses = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses
  );

  const hasSercqSend = digitalAddresses.find((addr) => addr.channelType === ChannelType.SERCQ_SEND);
  const hasCourtesyAddresses =
    digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY).length > 0;
  const domicileBannerData: DomicileBannerData | null = getDomicileData(
    source,
    !!hasSercqSend,
    hasCourtesyAddresses,
    IS_DOD_ENABLED
  );

  const handleClose = () => {
    dispatch(closeDomicileBanner());
    // sessionStorage.setItem('domicileBannerClosed', 'true');
  };

  const handleClick = (destination?: ChannelType, operation?: ContactOperation) => {
    if (destination && operation) {
      dispatch(setExternalEvent({ destination, source, operation }));
    }
    navigate(routes.RECAPITI);
  };

  return open && domicileBannerData ? (
    <Box mb={5}>
      <Alert
        severity={domicileBannerData.severity}
        variant="outlined"
        onClose={domicileBannerData.canBeClosed ? handleClose : undefined}
        data-testid="addDomicileBanner"
      >
        <Typography variant="body2" fontWeight={600}>
          {t(`domicile-banner.${domicileBannerData.message}-title`)}
        </Typography>
        <Typography variant="body2">
          {t(`domicile-banner.${domicileBannerData.message}-description`)}
        </Typography>
        {domicileBannerData.callToAction && (
          <ButtonNaked
            color="primary"
            onClick={() =>
              handleClick(domicileBannerData?.destination, domicileBannerData?.operation)
            }
            sx={{ mt: '12px', fontSize: '1rem', fontWeight: 700, textAlign: 'left' }}
          >
            {t(`domicile-banner.${domicileBannerData.callToAction}`)}
          </ButtonNaked>
        )}
      </Alert>
    </Box>
  ) : (
    <></>
  );
};

export default DomicileBanner;
