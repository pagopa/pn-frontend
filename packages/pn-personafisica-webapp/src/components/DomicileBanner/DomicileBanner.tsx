import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { Box } from '@mui/material';
import { EventAction } from '@pagopa-pn/pn-commons';
import { Banner, BannerCTA } from '@pagopa/mui-italia';

import { useBannerDismiss } from '../../hooks/useBannerDismiss';
import { PFEventsType } from '../../models/PFEventsType';
import {
  ChannelType,
  ContactOperation,
  ContactSource,
  IOAllowedValues,
} from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { contactsSelectors, setExternalEvent } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

type Props = {
  source: ContactSource;
};

type DomicileBannerData = {
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
  hasAppIODisabled: boolean,
  isDodEnabled: boolean
): DomicileBannerData | null => {
  const sessionClosed = getOpenStatusFromSession();
  if (isDodEnabled && source !== ContactSource.RECAPITI && !hasSercqSend && !sessionClosed) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return {
      destination: ChannelType.SERCQ_SEND,
      operation: ContactOperation.ADD,
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
      message: 'no-courtesy-no-sercq-send',
      canBeClosed: false,
      callToAction: 'no-courtesy-no-sercq-send-cta',
    };
  } else if (isDodEnabled && hasSercqSend && !hasCourtesyAddresses) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return {
      destination: ChannelType.EMAIL,
      operation: ContactOperation.SCROLL,
      message: 'no-courtesy',
      canBeClosed: false,
      callToAction: source === ContactSource.RECAPITI ? undefined : 'complete-addresses',
    };
  } else if (
    source !== ContactSource.RECAPITI &&
    (hasSercqSend || !isDodEnabled) &&
    hasAppIODisabled &&
    hasCourtesyAddresses
  ) {
    return {
      destination: ChannelType.EMAIL,
      operation: ContactOperation.SCROLL,
      message: 'no-io',
      canBeClosed: true,
      callToAction: 'add-io',
    };
  }
  return null;
};

const resolveIcon = (message: string) =>
  message === 'no-io' ? (
    <NotificationsActiveOutlinedIcon fontSize="small" />
  ) : (
    <SavingsOutlinedIcon fontSize="small" />
  );

const resolveCta = (
  data: DomicileBannerData,
  t: TFunction,
  onClick: (destination?: ChannelType, operation?: ContactOperation) => void
): BannerCTA | undefined => {
  if (!data.callToAction) {
    return undefined;
  }
  return {
    label: t(`domicile-banner.${data.callToAction}`),
    onClick: () => onClick(data.destination, data.operation),
  };
};

const DomicileBanner: React.FC<Props> = ({ source }) => {
  const { t } = useTranslation(['recapiti']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { IS_DOD_ENABLED } = getConfiguration();
  const {
    defaultPECAddress,
    defaultSERCQ_SENDAddress,
    defaultAPPIOAddress,
    courtesyAddresses,
    addresses,
  } = useAppSelector(contactsSelectors.selectAddresses);

  const { open, handleClose } = useBannerDismiss();

  const hasAppIODisabled = defaultAPPIOAddress?.value === IOAllowedValues.DISABLED;

  const hasCourtesyAddresses = courtesyAddresses.some(
    (addr) => addr.value !== IOAllowedValues.DISABLED
  );

  const domicileBannerData: DomicileBannerData | null = defaultPECAddress
    ? null
    : getDomicileData(
        source,
        !!defaultSERCQ_SENDAddress,
        hasCourtesyAddresses,
        hasAppIODisabled,
        IS_DOD_ENABLED
      );

  const handleClick = (destination?: ChannelType, operation?: ContactOperation) => {
    if (destination && operation) {
      if (destination === ChannelType.SERCQ_SEND && operation === ContactOperation.ADD) {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ENTER_FLOW, {
          event_type: EventAction.ACTION,
          addresses,
          source,
        });
        navigate(routes.DIGITAL_DOMICILE_ACTIVATION);
      } else {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_VIEW_CONTACT_DETAILS, { source });
        navigate(routes.RECAPITI);
      }
      dispatch(setExternalEvent({ destination, source, operation }));
    }
  };

  return open && domicileBannerData ? (
    <Box my={4}>
      <Banner
        variant="tertiary"
        color="info"
        title={t(`domicile-banner.${domicileBannerData.message}-title`)}
        message={t(`domicile-banner.${domicileBannerData.message}-description`)}
        icon={resolveIcon(domicileBannerData.message)}
        onClose={domicileBannerData.canBeClosed ? handleClose : undefined}
        closeAriaLabel={t('domicile-banner.close')}
        cta={resolveCta(domicileBannerData, t, handleClick)}
        data-testid="addDomicileBanner"
      />
    </Box>
  ) : (
    <></>
  );
};

export default DomicileBanner;
