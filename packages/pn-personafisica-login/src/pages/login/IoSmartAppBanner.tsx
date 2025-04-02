import { useTranslation } from 'react-i18next';

import { Avatar, Box, Button, Stack, StackProps, Typography } from '@mui/material';
import { IllusAppIoLogo, useMobileOS } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';

const IOSmartAppBanner: React.FC<StackProps> = (props) => {
  const { APP_IO_ANDROID, APP_IO_IOS, APP_IO_SITE } = getConfiguration();
  const os = useMobileOS();
  const { t } = useTranslation(['login']);

  const getActionUrl = () => {
    switch (os) {
      case 'iOS':
        return APP_IO_IOS;
      case 'Android':
        return APP_IO_ANDROID;
      default:
        return APP_IO_SITE;
    }
  };

  const redirectToIoWebsite = () => window.location.assign(APP_IO_SITE);

  const handleOpenClick = () => {
    window.location.assign(getActionUrl());

    // fallback, in case of url unregistered schema
    setTimeout(() => {
      redirectToIoWebsite();
    }, 2000);
  };

  return (
    <Stack id="ioSmartAppBanner" direction="row" alignItems="center" p={2} {...props}>
      <Avatar variant="rounded" sx={{ bgcolor: '#0B3EE3', width: '30px', height: '30px' }}>
        <IllusAppIoLogo />
      </Avatar>
      <Stack direction="column" mx={1}>
        <Typography variant="body1" fontSize="14px" fontWeight="600" lineHeight="1em">
          {t('ioSmartAppBanner.title')}
        </Typography>
        <Typography variant="caption" fontSize="12px" color="GrayText" lineHeight="1em">
          {t('ioSmartAppBanner.subtitle')}
        </Typography>
      </Stack>
      <Box sx={{ ml: 'auto' }}>
        <Button
          id="ioSmartAppBannerAction"
          variant="contained"
          color="primary"
          sx={{ height: '30px', width: '100px', borderRadius: '33px' }}
          onClick={handleOpenClick}
        >
          {t('ioSmartAppBanner.cta')}
        </Button>
      </Box>
    </Stack>
  );
};

export default IOSmartAppBanner;
