import { useTranslation } from 'react-i18next';

import { Avatar, Link, Stack, StackProps, Typography } from '@mui/material';
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
      {/* <Box sx={{ ml: 'auto' }}> */}
      <Link
        ml="auto"
        href={getActionUrl()}
        fontWeight={600}
        fontSize="16px"
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          width: '100px',
          height: '30px',
          textAlign: 'center',
          alignContent: 'center',
          color: 'white',
          backgroundColor: '#0073E6',
          padding: '24px 8px',
          borderRadius: '33px',
          textDecoration: 'none',
        }}
      >
        {t('ioSmartAppBanner.cta')}
      </Link>
    </Stack>
  );
};

export default IOSmartAppBanner;
