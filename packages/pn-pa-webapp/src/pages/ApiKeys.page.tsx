import { useState, useEffect, Fragment, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Link, Dialog, TextField, InputAdornment } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useIsMobile, CopyToClipboard, TitleBox, ApiErrorWrapper } from '@pagopa-pn/pn-commons';
import { useTranslation, Trans } from 'react-i18next';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getApiKeys,
  setApiKeyStatus,
  deleteApiKey,
  API_KEYS_ACTIONS,
} from '../redux/apiKeys/actions';
import { ApiKey, ApiKeySetStatus, ModalApiKeyView } from '../models/ApiKeys';
import DesktopApiKeys from './components/ApiKeys/DesktopApiKeys';
import ApiKeyModal from './components/ApiKeys/ApiKeyModal';

const SubTitle = () => {
  const { t } = useTranslation(['apikeys']);
  return (
    <Fragment>
      {t('subtitle.text1')}
      <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml#/NewNotification/sendNewNotification">
        {t('subtitle.text2')}
      </Link>
      {t('subtitle.text3')}
      <Link href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/pagopa/pn-delivery/develop/docs/openapi/api-external-b2b-pa-v1.yaml#/SenderReadB2B/getNotificationRequestStatus">
        {t('subtitle.text4')}
      </Link>
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

  const fetchApiKeys = useCallback(() => {
    void dispatch(getApiKeys());
  }, []);

  type modalType = {
    view: ModalApiKeyView;
    apiKey?: ApiKey;
  };

  const [modal, setModal] = useState<modalType>({ view: ModalApiKeyView.NONE });

  const handleCloseModal = () => {
    setModal({ view: ModalApiKeyView.NONE });
  };

  const handleModalClick = (view: ModalApiKeyView, apiKeyId: number) => {
    setModal({ view, apiKey: apiKeys[apiKeyId] });
  };

  const handleNewApiKeyClick = () => {
    navigate(routes.NUOVA_API_KEY);
  };

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const apiKeyBlocked = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(setApiKeyStatus({ apiKey: apiKeyId, status: ApiKeySetStatus.BLOCK })).then(
      () => void dispatch(getApiKeys())
    );
  };

  const apiKeyEnabled = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(setApiKeyStatus({ apiKey: apiKeyId, status: ApiKeySetStatus.ENABLE })).then(
      () => void dispatch(getApiKeys())
    );
  };

  const apiKeyRotated = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(setApiKeyStatus({ apiKey: apiKeyId, status: ApiKeySetStatus.ROTATE })).then(
      () => void dispatch(getApiKeys())
    );
  };

  const apiKeyDeleted = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(deleteApiKey(apiKeyId)).then(() => void dispatch(getApiKeys()));
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
          marginTop: isMobile ? 3 : 10,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: isMobile ? 3 : undefined }}>
          {t('generated-api-keys')}
        </Typography>
        <Button
          data-testid="generateApiKey"
          variant="outlined"
          sx={{ marginBottom: isMobile ? 3 : undefined }}
          onClick={handleNewApiKeyClick}
        >
          <Add />
          {t('new-api-key-button')}
        </Button>
      </Box>
      <ApiErrorWrapper
        apiId={API_KEYS_ACTIONS.GET_API_KEYS}
        reloadAction={() => fetchApiKeys()}
        mainText={t('error-fecth-api-keys')}
        mt={3}
      >
        <DesktopApiKeys apiKeys={apiKeys} handleModalClick={handleModalClick} />

        <Dialog open={modal.view !== ModalApiKeyView.NONE} onClose={handleCloseModal}>
          <Box
            sx={{
              padding: 3,
              minWidth: isMobile ? '0' : '600px',
            }}
          >
            {modal.view === ModalApiKeyView.VIEW && (
              <ApiKeyModal
                titleSx={{ marginBottom: isMobile ? 3 : undefined }}
                title={`API Key ${modal.apiKey?.name}`}
                subTitle={t('copy-api-key-info')}
                content={
                  <TextField
                    value={modal.apiKey?.value}
                    fullWidth={true}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <CopyToClipboard
                            tooltipMode={true}
                            tooltip={t('api-key-copied')}
                            getValue={() => modal.apiKey?.value || ''}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                }
                closeButtonLabel={t('close-button')}
                closeModalHandler={handleCloseModal}
              />
            )}
            {modal.view === ModalApiKeyView.BLOCK && (
              <ApiKeyModal
                titleSx={{ marginBottom: 2 }}
                title={t('block-api-key')}
                subTitle={
                  <Trans i18nKey="block-warning1" values={{ apiKeyName: modal.apiKey?.name }}>
                    {t('block-warning1', { apiKeyName: modal.apiKey?.name })}
                  </Trans>
                }
                content={<Typography>{t('block-warning2')}</Typography>}
                closeButtonLabel={t('cancel-button')}
                closeModalHandler={handleCloseModal}
                actionButtonLabel={t('block-button')}
                actionHandler={() => apiKeyBlocked(modal.apiKey?.id as string)}
              />
            )}
            {modal.view === ModalApiKeyView.ENABLE && (
              <ApiKeyModal
                titleSx={{ marginBottom: 2 }}
                title={t('enable-api-key')}
                subTitle={<Trans>{t('enable-warning', { apiKeyName: modal.apiKey?.name })}</Trans>}
                closeButtonLabel={t('cancel-button')}
                closeModalHandler={handleCloseModal}
                actionButtonLabel={t('enable-button')}
                actionHandler={() => apiKeyEnabled(modal.apiKey?.id as string)}
              />
            )}
            {modal.view === ModalApiKeyView.ROTATE && (
              <ApiKeyModal
                titleSx={{ marginBottom: 2 }}
                title={t('rotate-api-key')}
                subTitle={<Trans>{t('rotate-warning1', { apiKeyName: modal.apiKey?.name })}</Trans>}
                content={<Typography>{t('rotate-warning2')}</Typography>}
                closeButtonLabel={t('cancel-button')}
                closeModalHandler={handleCloseModal}
                actionButtonLabel={t('rotate-button')}
                actionHandler={() => apiKeyRotated(modal.apiKey?.id as string)}
              />
            )}
            {modal.view === ModalApiKeyView.DELETE && (
              <ApiKeyModal
                titleSx={{ marginBottom: 2 }}
                title={t('delete-api-key')}
                subTitle={<Trans>{t('delete-warning', { apiKeyName: modal.apiKey?.name })}</Trans>}
                closeButtonLabel={t('cancel-button')}
                closeModalHandler={handleCloseModal}
                actionButtonLabel={t('delete-button')}
                actionHandler={() => apiKeyDeleted(modal.apiKey?.id as string)}
              />
            )}
          </Box>
        </Dialog>
      </ApiErrorWrapper>
    </Box>
  );
};

export default ApiKeys;
