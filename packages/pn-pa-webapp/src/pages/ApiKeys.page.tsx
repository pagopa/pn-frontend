import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useIsMobile, ApiKey, CopyToClipboard, ApiKeyStatus } from '@pagopa-pn/pn-commons';
import { useTranslation, Trans } from 'react-i18next';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getApiKeys,
  setApiKeyStatus,
  setApiKeyDeleted,
} from '../redux/apiKeys/actions';
import DesktopApiKeys from './components/ApiKeys/DesktopApiKeys';

const ApiKeys = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation(['apikeys']);

  const apiKeys = useAppSelector((state: RootState) => state.apiKeysState.apiKeys);

  const [openModal, setModal] = useState(false);
  const [viewApiKey, setViewApiKey] = useState<null | ApiKey>();
  const [blockApiKey, setBlockApiKey] = useState<null | ApiKey>();
  const [enableApiKey, setEnableApiKey] = useState<null | ApiKey>();
  const [rotateApiKey, setRotateApiKey] = useState<null | ApiKey>();
  const [deleteApiKey, setDeleteApiKey] = useState<null | ApiKey>();

  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => {
    setModal(false);
    setViewApiKey(null);
    setBlockApiKey(null);
    setEnableApiKey(null);
    setRotateApiKey(null);
    setDeleteApiKey(null);
  };

  const handleNewApiKeyClick = () => {
    navigate(routes.NUOVA_API_KEY);
  };

  const handleViewApiKeyClick = (apiKeyId: number) => {
    setViewApiKey(apiKeys[apiKeyId]);
    handleOpenModal();
  };

  const handleRotateApiKeyClick = (apiKeyId: number) => {
    setRotateApiKey(apiKeys[apiKeyId]);
    handleOpenModal();
  };

  const handleBlockApiKeyClick = (apiKeyId: number) => {
    setBlockApiKey(apiKeys[apiKeyId]);
    handleOpenModal();
  };
  const handleEnableApiKeyClick = (apiKeyId: number) => {
    setEnableApiKey(apiKeys[apiKeyId]);
    handleOpenModal();
  };

  const handleDeleteApiKeyClick = (apiKeyId: number) => {
    setDeleteApiKey(apiKeys[apiKeyId]);
    handleOpenModal();
  };

  useEffect(() => {
    void dispatch(getApiKeys());
  }, []);

  const apiKeyBlocked = (apiKeyId: string) => {
    handleCloseModal();
    // Integrare logica di success / failure e eventuale callback relativa (aggiornamento tabella per esempio)
    void dispatch(setApiKeyStatus({ apiKey: apiKeyId, status: ApiKeyStatus.BLOCKED }));
  };

  const apiKeyEnabled = (apiKeyId: string) => {
    handleCloseModal();
    // Integrare logica di success / failure e eventuale callback relativa (aggiornamento tabella per esempio)
    void dispatch(setApiKeyStatus({ apiKey: apiKeyId, status: ApiKeyStatus.ENABLED }));
  };

  const apiKeyRotated = (apiKeyId: string) => {
    handleCloseModal();
    // Integrare logica di success / failure e eventuale callback relativa (aggiornamento tabella per esempio)
    void dispatch(setApiKeyStatus({ apiKey: apiKeyId, status: ApiKeyStatus.ROTATED }));
  };

  const apiKeyDeleted = (apiKeyId: string) => {
    handleCloseModal();
    // Integrare logica di success / failure e eventuale callback relativa (aggiornamento tabella per esempio)
    void dispatch(setApiKeyDeleted(apiKeyId));
  };

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
        <Button
          variant="outlined"
          sx={{ marginBottom: isMobile ? 3 : undefined }}
          onClick={handleNewApiKeyClick}
        >
          <Add />
          {t('new-api-key-button')}
        </Button>
      </Box>
      <DesktopApiKeys
        apiKeys={apiKeys}
        handleEnableApiKeyClick={handleEnableApiKeyClick}
        handleViewApiKeyClick={handleViewApiKeyClick}
        handleRotateApiKeyClick={handleRotateApiKeyClick}
        handleBlockApiKeyClick={handleBlockApiKeyClick}
        handleDeleteApiKeyClick={handleDeleteApiKeyClick}
      />

      <Dialog open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            padding: 3,
            minWidth: isMobile ? '0' : '600px',
          }}
        >
          {viewApiKey && (
            <>
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
            </>
          )}

          {blockApiKey && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {t('block-api-key')}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                <Trans i18nKey="block-warning1" values={{ apiKeyName: blockApiKey.name }}>
                  {t('block-warning1', { apiKeyName: blockApiKey.name })}
                </Trans>
              </Typography>
              <Typography>{t('block-warning2')}</Typography>
              <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
                  {t('cancel-button')}
                </Button>
                <Button variant="contained" onClick={() => apiKeyBlocked(blockApiKey.apiKey)}>
                  {t('block-button')}
                </Button>
              </Grid>
            </>
          )}

          {enableApiKey && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {t('enable-api-key')}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                <Trans>{t('enable-warning', { apiKeyName: enableApiKey.name })}</Trans>
              </Typography>
              <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
                  {t('cancel-button')}
                </Button>
                <Button variant="contained" onClick={() => apiKeyEnabled(enableApiKey.apiKey)}>
                  {t('enable-button')}
                </Button>
              </Grid>
            </>
          )}

          {rotateApiKey && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {t('rotate-api-key')}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                <Trans>{t('rotate-warning1', { apiKeyName: rotateApiKey.name })}</Trans>
              </Typography>
              <Typography>{t('rotate-warning2')}</Typography>
              <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
                  {t('cancel-button')}
                </Button>
                <Button variant="contained" onClick={() => apiKeyRotated(rotateApiKey.apiKey)}>
                  {t('rotate-button')}
                </Button>
              </Grid>
            </>
          )}

          {deleteApiKey && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {t('delete-api-key')}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                <Trans>{t('delete-warning', { apiKeyName: deleteApiKey.name })}</Trans>
              </Typography>
              <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
                  {t('cancel-button')}
                </Button>
                <Button variant="contained" onClick={() => apiKeyDeleted(deleteApiKey.apiKey)}>
                  {t('delete-button')}
                </Button>
              </Grid>
            </>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default ApiKeys;
