import { useTranslation } from 'react-i18next';

import { Box, Button, Stack, Typography } from '@mui/material';
import { IllusOnboardingAppIO, appStateActions } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

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
import { openAppIoDownloadPage } from '../../../utility/appio.utility';

type Props = {
  value?: IOAllowedValues;
  onChange: (value?: IOAllowedValues) => void;
  onContinue: () => void;
};

const IoStep: React.FC<Props> = ({ value, onChange, onContinue }) => {
  const { t } = useTranslation(['recapiti', 'common']);
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
    try {
      const addresses = await dispatch(getDigitalAddresses()).unwrap();
      onChange(getIoValue(addresses));
    } catch {
      // no-op
    }
  };

  const handleEnable = async () => {
    try {
      await dispatch(enableIOAddress()).unwrap();

      dispatch(
        appStateActions.addSuccess({
          title: '',
          message: t('courtesy-contacts.io-added-successfully', { ns: 'recapiti' }),
        })
      );

      onChange(IOAllowedValues.ENABLED);
    } catch {
      // no-op
    }
  };

  const handlePrimaryAction = () => {
    switch (status) {
      case IOContactStatus.ENABLED:
        onContinue();
        break;
      case IOContactStatus.DISABLED:
        void handleEnable();
        break;
      case IOContactStatus.UNAVAILABLE:
      default:
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

  return (
    <Stack data-testid="io-step">
      <Typography fontSize="22px" fontWeight={700} mb={1}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        {t('onboarding.digital-domicile.io.description')}
      </Typography>

      <Box sx={{ borderRadius: 3, bgcolor: 'background.paper' }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handlePrimaryAction}
          sx={{ mb: 2 }}
          data-testid="io-primary-button"
        >
          {t(`${labelPrefixByStatus}.primary-cta`)}
        </Button>

        {status === IOContactStatus.UNAVAILABLE && (
          <ButtonNaked
            color="primary"
            size="medium"
            onClick={() => void handleRefreshState()}
            data-testid="io-refresh-link"
            sx={{ mb: 2, fontWeight: 700 }}
          >
            {t(`${labelPrefixByStatus}.refresh-cta`)}
          </ButtonNaked>
        )}
        <IllusOnboardingAppIO aria-label={t('onboarding.digital-domicile.io.img-alt-text')} />
      </Box>
    </Stack>
  );
};

export default IoStep;
