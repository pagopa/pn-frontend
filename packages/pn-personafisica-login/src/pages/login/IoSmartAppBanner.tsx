import { useTranslation } from 'react-i18next';

import { Avatar, Box, BoxProps, Button, Stack, Typography } from '@mui/material';
import { IllusAppIoLogo } from '@pagopa-pn/pn-commons';

const IOSmartAppBanner: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation(['login']);

  return (
    <Box {...props} p={2}>
      <Stack direction="row" alignItems="center">
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
            variant="contained"
            color="primary"
            sx={{ height: '30px', width: '100px', borderRadius: '33px' }}
          >
            {t('ioSmartAppBanner.cta')}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default IOSmartAppBanner;
