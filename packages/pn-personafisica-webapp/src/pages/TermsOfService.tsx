import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../redux/hooks';
import { acceptToS } from '../redux/auth/actions';

const TermsOfService = () => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();

  const handleAccept = () => {
    void dispatch(acceptToS());
  };

  return (
    <Stack display="flex" alignItems="center">
      <Typography variant="h4" color="textPrimary">
        {t('tos.title')}
      </Typography>
      <Box
        sx={{
          width: '90%',
          height: '600px',
          overflowY: 'scroll',
          border: '2px solid grey',
          padding: '16px',
        }}
      >
        <Typography variant={'body2'}>{t('tos.body')}</Typography>
      </Box>
      <Button variant="contained" sx={{ margin: '24px 0' }} onClick={handleAccept}>
        {t('tos.button')}
      </Button>
    </Stack>
  );
};

export default TermsOfService;
