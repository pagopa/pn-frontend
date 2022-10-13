import { useState, useEffect, Fragment } from 'react';
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
import { useIsMobile, CopyToClipboard, TitleBox } from '@pagopa-pn/pn-commons';
import { useTranslation, Trans } from 'react-i18next';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getApiKeys,
  setApiKeyStatus,
  setApiKeyDeleted,
} from '../redux/apiKeys/actions';
import { ApiKey, ApiKeyStatus, modalApiKeyView } from '../models/ApiKeys';
import DesktopApiKeys from './components/ApiKeys/DesktopApiKeys';

const SubTitle = () => {
  const { t } = useTranslation(['apiKeys']);
  return (
    <Fragment>
      {t('subtitle.text1')}
      <Link
        href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml#/NewNotification/sendNewNotification"
      >{t('subtitle.text2')}</Link>
      {t('subtitle.text3')}
      <Link
        href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml#/SenderReadB2B/getNotificationRequestStatus"
      >{t('subtitle.text4')}</Link>
      {t('subtitle.text5')}
    </Fragment>
  );
};

const ApiKeys = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation(['apikeys']);

  const apiKeys = useAppSelector((state: RootState) => state.apiKeysState.apiKeys);

  type modalType = {
    view: modalApiKeyView;
    apiKey?: ApiKey;
  };

  const [modal, setModal] = useState<modalType>({ view: modalApiKeyView.NONE });



  const handleCloseModal = () => {
    setModal({ view: modalApiKeyView.NONE });
  };

  const handleModalClick = (view: modalApiKeyView, apiKeyId: number) => {
    setModal({ view, apiKey: apiKeys[apiKeyId]} );
  };

  const handleNewApiKeyClick = () => {
    navigate(routes.NUOVA_API_KEY);
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
      <TitleBox
        variantTitle="h4"
        title={t('title')}
        sx={{ pt: '20px' }}
        subTitle={<SubTitle />}
        variantSubTitle="body1"
      ></TitleBox>
      <Box
       sx={{
        display: isMobile ? 'block' : 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: isMobile ? 3 : 10
       }}
      >
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
        handleModalClick={handleModalClick}
      />

      <Dialog open={modal.view !== modalApiKeyView.NONE} onClose={handleCloseModal}>
        <Box
          sx={{
            padding: 3,
            minWidth: isMobile ? '0' : '600px',
          }}
        >
          {modal.view === modalApiKeyView.VIEW && (
            <>
              <Typography variant="h5" sx={{ marginBottom: isMobile ? 3 : undefined }}>
                API Key {modal.apiKey?.name}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                {t('copy-api-key-info')}
              </Typography>
              {
                <TextField
                  value={modal.apiKey?.apiKey}
                  fullWidth={true}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <CopyToClipboard
                          tooltipMode={true}
                          tooltip={t('api-key-copied')}
                          getValue={() => modal.apiKey?.apiKey || ''}
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

          {modal.view === modalApiKeyView.BLOCK && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {t('block-api-key')}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                <Trans i18nKey="block-warning1" values={{ apiKeyName: modal.apiKey?.name }}>
                  {t('block-warning1', { apiKeyName: modal.apiKey?.name })}
                </Trans>
              </Typography>
              <Typography>{t('block-warning2')}</Typography>
              <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
                  {t('cancel-button')}
                </Button>
                <Button variant="contained" onClick={() => apiKeyBlocked(modal.apiKey?.apiKey as string)}>
                  {t('block-button')}
                </Button>
              </Grid>
            </>
          )}

          {modal.view === modalApiKeyView.ENABLE && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {t('enable-api-key')}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                <Trans>{t('enable-warning', { apiKeyName: modal.apiKey?.name })}</Trans>
              </Typography>
              <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
                  {t('cancel-button')}
                </Button>
                <Button variant="contained" onClick={() => apiKeyEnabled(modal.apiKey?.apiKey as string)}>
                  {t('enable-button')}
                </Button>
              </Grid>
            </>
          )}

          {modal.view === modalApiKeyView.ROTATE && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {t('rotate-api-key')}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                <Trans>{t('rotate-warning1', { apiKeyName: modal.apiKey?.name })}</Trans>
              </Typography>
              <Typography>{t('rotate-warning2')}</Typography>
              <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
                  {t('cancel-button')}
                </Button>
                <Button variant="contained" onClick={() => apiKeyRotated(modal.apiKey?.apiKey as string)}>
                  {t('rotate-button')}
                </Button>
              </Grid>
            </>
          )}

          {modal.view === modalApiKeyView.DELETE && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {t('delete-api-key')}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 3 }}>
                <Trans>{t('delete-warning', { apiKeyName: modal.apiKey?.name })}</Trans>
              </Typography>
              <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
                  {t('cancel-button')}
                </Button>
                <Button variant="contained" onClick={() => apiKeyDeleted(modal.apiKey?.apiKey as string)}>
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
