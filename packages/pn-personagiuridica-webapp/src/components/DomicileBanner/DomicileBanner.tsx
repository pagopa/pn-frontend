import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { Box } from '@mui/material';
import { appStorage } from '@pagopa-pn/pn-commons';
import { Banner, type BannerCTA } from '@pagopa/mui-italia';

import { ChannelType, ContactOperation, ContactSource } from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { contactsSelectors, setExternalEvent } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeDomicileBanner } from '../../redux/sidemenu/reducers';
import { RootState } from '../../redux/store';
import { getConfiguration } from '../../services/configuration.service';

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

const getDomicileData = (
  source: ContactSource,
  hasSercqSend: boolean,
  hasCourtesyAddresses: boolean,
  isDodEnabled: boolean
): DomicileBannerData | null => {
  const sessionClosed = !appStorage.domicileBanner.isEnabled();
  if (isDodEnabled && source !== ContactSource.RECAPITI && !hasSercqSend && !sessionClosed) {
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
    return {
      destination: ChannelType.EMAIL,
      operation: ContactOperation.SCROLL,
      message: 'no-courtesy-no-sercq-send',
      canBeClosed: false,
      callToAction: 'no-courtesy-no-sercq-send-cta',
    };
  } else if (isDodEnabled && hasSercqSend && !hasCourtesyAddresses) {
    return {
      destination: ChannelType.EMAIL,
      operation: ContactOperation.SCROLL,
      message: 'no-courtesy',
      canBeClosed: false,
      callToAction: source === ContactSource.RECAPITI ? undefined : 'complete-addresses',
    };
  }

  return null;
};

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
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state: RootState) => state.generalInfoState.domicileBannerOpened);
  const { IS_DOD_ENABLED } = getConfiguration();
  const { defaultPECAddress, defaultSERCQ_SENDAddress, courtesyAddresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const hasCourtesyAddresses = courtesyAddresses.length > 0;

  const domicileBannerData: DomicileBannerData | null = defaultPECAddress
    ? null
    : getDomicileData(source, !!defaultSERCQ_SENDAddress, hasCourtesyAddresses, IS_DOD_ENABLED);

  const handleClose = () => {
    dispatch(closeDomicileBanner());
    appStorage.domicileBanner.disable();
  };

  const handleClick = (destination?: ChannelType, operation?: ContactOperation) => {
    if (destination && operation) {
      if (destination === ChannelType.SERCQ_SEND && operation === ContactOperation.ADD) {
        navigate(routes.DIGITAL_DOMICILE_ACTIVATION);
      } else {
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
        icon={<SavingsOutlinedIcon fontSize="small" />}
        onClose={domicileBannerData.canBeClosed ? handleClose : undefined}
        closeAriaLabel={t('button.close', { ns: 'common' })}
        cta={resolveCta(domicileBannerData, t, handleClick)}
        data-testid="addDomicileBanner"
      />
    </Box>
  ) : (
    <></>
  );
};

export default DomicileBanner;
