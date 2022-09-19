import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Link,
  Dialog,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useIsMobile, ApiKey, CopyToClipboard } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getApiKeys } from '../redux/apiKeys/actions';
import DesktopApiKeys from './components/ApiKeys/DesktopApiKeys';

const ApiKeys = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { t } = useTranslation(['apikeys']);

  const mockApiKeys = useAppSelector((state: RootState) => state.apiKeysState.apiKeys);

  const [openModal, setModal] = useState(false);
  const [viewApiKey, setViewApiKey] = useState<null | ApiKey>();
  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);

  const handleViewApiKeyClick = (apiKeyId: string) => {
    setViewApiKey(mockApiKeys[parseInt(apiKeyId, 10)]);
    handleOpenModal();
  };

  const handleRotateApiKeyClick = () => undefined;
  const handleToggleBlockApiKeyClick = () => undefined;
  const handleDeleteApiKeyClick = () => undefined;

  useEffect(() => {
    void dispatch(getApiKeys());
  }, []);
  

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
      <DesktopApiKeys
        apiKeys={mockApiKeys}
        handleViewApiKeyClick={handleViewApiKeyClick}
        handleRotateApiKeyClick={handleRotateApiKeyClick}
        handleToggleBlockApiKeyClick={handleToggleBlockApiKeyClick}
        handleDeleteApiKeyClick={handleDeleteApiKeyClick}
      />
      {viewApiKey && (
        <Dialog open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              padding: 3,
              minWidth: isMobile ? '0' : '600px',
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: isMobile ? 3 : undefined }}>
              API Key {viewApiKey.name}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 3 }}>
              {t('copy-api-key-info')}
            </Typography>
            {
              <TextField
                value={viewApiKey.apiKey}
                fullWidth={true}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <CopyToClipboard
                        tooltipMode={true}
                        tooltip={t('api-key-copied')}
                        getValue={() => viewApiKey.apiKey || ''}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            }
            <Grid container justifyContent="flex-end">
              <Button variant="outlined" sx={{ marginTop: 3 }} onClick={handleCloseModal}>
                {t('close-button')}
              </Button>
            </Grid>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

export default ApiKeys;
