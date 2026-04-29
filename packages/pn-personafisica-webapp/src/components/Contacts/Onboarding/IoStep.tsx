import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { EventAction, appStateActions, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { OnboardingAvailableFlows } from '../../../models/Onboarding';
import { PFEventsType } from '../../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  DigitalAddress,
  IOAllowedValues,
  IOContactStatus,
} from '../../../models/contacts';
import { enableIOAddress, getDigitalAddresses } from '../../../redux/contact/actions';
import { useAppDispatch } from '../../../redux/hooks';
import { getConfiguration } from '../../../services/configuration.service';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { openAppIoDownloadPage } from '../../../utility/appio.utility';
import OnboardingImage from './OnboardingImage';

type Props = {
  value?: IOAllowedValues;
  selectedOnboardingFlow: OnboardingAvailableFlows;
  onChange: (value?: IOAllowedValues) => void;
  onContinue: () => void;
};

const getIoStatusEvent = (status: IOContactStatus) => {
  switch (status) {
    case IOContactStatus.ENABLED:
      return PFEventsType.SEND_ONBOARDING_IO_VERIFICATION;
    case IOContactStatus.DISABLED:
      return PFEventsType.SEND_ONBOARDING_IO_ACTIVATION;
    default:
      return PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD;
  }
};

const IoStep: React.FC<Props> = ({ value, selectedOnboardingFlow, onChange, onContinue }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const { APP_IO_SITE, APP_IO_ANDROID, APP_IO_IOS } = getConfiguration();

  const getStatus = (): IOContactStatus => {
    if (value === IOAllowedValues.ENABLED) {
      return IOContactStatus.ENABLED;
    }
    if (value === IOAllowedValues.DISABLED) {
      return IOContactStatus.DISABLED;
    }

    return IOContactStatus.UNAVAILABLE;
  };

  const status = getStatus();

  const getLabelPrefixByStatus = () => {
    switch (status) {
      case IOContactStatus.ENABLED:
        return 'onboarding.digital-domicile.io.enabled';
      case IOContactStatus.DISABLED:
        return 'onboarding.digital-domicile.io.disabled';
      case IOContactStatus.UNAVAILABLE:
      default:
        return 'onboarding.digital-domicile.io.not-installed';
    }
  };

  const labelPrefixByStatus = getLabelPrefixByStatus();

  const getIoValue = (addresses: Array<DigitalAddress>): IOAllowedValues | undefined => {
    const ioAddress = addresses.find(
      (address) =>
        address.senderId === 'default' &&
        address.addressType === AddressType.COURTESY &&
        address.channelType === ChannelType.IOMSG
    );
    return ioAddress?.value as IOAllowedValues | undefined;
  };

  const handleRefreshState = async () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD_VERIFICATION, {
      onboarding_selected_flow: selectedOnboardingFlow,
    });

    try {
      const addresses = await dispatch(getDigitalAddresses()).unwrap();
      onChange(getIoValue(addresses));
    } catch {
      // no-op
    }
  };

  const handleEnable = async () => {
    try {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ONBOARDING_IO_ACTIVATION_SELECTED, {
        onboarding_selected_flow: selectedOnboardingFlow,
      });

      await dispatch(enableIOAddress()).unwrap();

      dispatch(
        appStateActions.addSuccess({
          title: '',
          message: t('courtesy-contacts.io-added-successfully', { ns: 'recapiti' }),
        })
      );

      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ONBOARDING_IO_ACTIVATED, {
        onboarding_selected_flow: selectedOnboardingFlow,
      });

      onChange(IOAllowedValues.ENABLED);
      onContinue();
    } catch {
      // no-op
    }
  };

  const handlePrimaryAction = () => {
    switch (status) {
      case IOContactStatus.DISABLED:
        void handleEnable();
        break;
      case IOContactStatus.UNAVAILABLE:
      default:
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD_SELECTED, {
          onboarding_selected_flow: selectedOnboardingFlow,
        });
        openAppIoDownloadPage({
          appIoSite: APP_IO_SITE,
          appIoAndroid: APP_IO_ANDROID,
          appIoIos: APP_IO_IOS,
        });
        break;
    }
  };

  const title =
    status === IOContactStatus.ENABLED
      ? t('onboarding.digital-domicile.io.enabled.title')
      : t('onboarding.digital-domicile.io.title');

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(getIoStatusEvent(status), {
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: selectedOnboardingFlow,
    });
  }, [status]);

  return (
    <Stack data-testid="io-step">
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography fontSize="18px" fontWeight={700} mb={1}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {t('onboarding.digital-domicile.io.description')}
        </Typography>
        {status !== IOContactStatus.ENABLED && (
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={2}
            justifyContent={isMobile ? undefined : 'space-between'}
          >
            <Button
              fullWidth={isMobile}
              variant="contained"
              onClick={handlePrimaryAction}
              data-testid="io-primary-button"
              startIcon={
                status === IOContactStatus.UNAVAILABLE ? <FileDownloadOutlinedIcon /> : undefined
              }
            >
              {t(`${labelPrefixByStatus}.primary-cta`)}
            </Button>

            {status === IOContactStatus.UNAVAILABLE && (
              <ButtonNaked
                color="primary"
                size="medium"
                onClick={() => void handleRefreshState()}
                data-testid="io-refresh-link"
                sx={{
                  fontWeight: 700,
                  alignSelf: isMobile ? 'flex-start' : undefined,
                }}
              >
                {t(`${labelPrefixByStatus}.refresh-cta`)}
              </ButtonNaked>
            )}
          </Stack>
        )}
      </Box>
      <OnboardingImage
        src="/imgs/onboarding-appio.webp"
        decorative
        height={isMobile ? '160px' : '276px'}
      />
    </Stack>
  );
};

export default IoStep;
