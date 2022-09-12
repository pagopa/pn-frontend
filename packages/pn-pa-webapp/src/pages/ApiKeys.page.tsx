import { Box, Typography, Button, Link } from '@mui/material';
import { useIsMobile, ApiKeyStatus } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';
import { Add } from '@mui/icons-material';
import DesktopApiKeys from './components/ApiKeys/DesktopApiKeys';

const ApiKeys = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['apikeys']);

  // In attesa del BE, è stato creato un mock di dati
  // Da rimuovere e introdurre i vari dispatch opportuni quando sarà pronto il BE
  const mockApiKeys = [
    {
      name: 'Rimborso e multe',
      apiKey: '34938493489313493849348932',
      lastModify: '21/09/2022',
      groups: 'bla bla',
      status: ApiKeyStatus.ENABLED,
    },
    {
      name: 'Cartelle esattoriali',
      apiKey: '34938493489323493849348932',
      lastModify: '22/09/2022',
      groups: 'bla bla bla',
      status: ApiKeyStatus.BLOCKED,
    },
    {
      name: 'Rimborsi',
      apiKey: '34938493489333493849348932',
      lastModify: '22/09/2022',
      groups: 'bla bla bla',
      status: ApiKeyStatus.ROTATED,
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" mb={isMobile ? 3 : 2}>
        {t('title')}
      </Typography>
      <Box display={isMobile ? 'block' : 'flex'} justifyContent="space-between" alignItems="center">
        <Typography variant="body1" sx={{ marginBottom: isMobile ? 3 : 10 }}>
          {t('subtitle.text1')}
          <Link>{t('subtitle.text2')}</Link>
          {t('subtitle.text3')}
          <Link>{t('subtitle.text4')}</Link>
          {t('subtitle.text5')}
        </Typography>
      </Box>
      <Box display={isMobile ? 'block' : 'flex'} justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ marginBottom: isMobile ? 3 : undefined }}>
          {t('generated-api-keys')}
        </Typography>
        <Button variant="outlined" sx={{ marginBottom: isMobile ? 3 : undefined }}>
          <Add />
          {t('new-api-key-button')}
        </Button>
      </Box>
      <DesktopApiKeys apiKeys={mockApiKeys} />
    </Box>
  );
};

export default ApiKeys;
