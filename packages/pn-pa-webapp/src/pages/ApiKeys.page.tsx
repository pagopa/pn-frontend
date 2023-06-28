import { useState, useEffect, Fragment, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Link,
  Dialog,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useIsMobile, TitleBox, ApiErrorWrapper } from '@pagopa-pn/pn-commons';
import { useTranslation, Trans } from 'react-i18next';
import { CopyToClipboardButton } from '@pagopa/mui-italia';
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
import { UserGroup } from '../models/user';
import DesktopApiKeys from './components/ApiKeys/DesktopApiKeys';
import ApiKeyModal from './components/ApiKeys/ApiKeyModal';

const SubTitle = () => {
  const { t } = useTranslation(['apikeys']);
  return (
    <Fragment>
      {t('subtitle.text1')}
      <Link target="_blank" href={process.env.REACT_APP_OPEN_API_SEND_NEW_NOTIFICATION_URL}>
        {t('subtitle.text2')}
      </Link>
      {t('subtitle.text3')}
      <Link target="_blank" href={process.env.REACT_APP_OPEN_API_GET_NOTIFICATION_INFO_URL}>
        {t('subtitle.text4')}
      </Link>
      {t('subtitle.text5')}
    </Fragment>
  );
};

const TableGroupsId = ({ groups }: { groups?: Array<UserGroup> }) => {
  const { t } = useTranslation(['apikeys']);
  return (
    <Box sx={{ my: 3 }}>
      {groups &&
        groups.map((group, i) => (
          <Fragment key={group.name}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ width: '90%' }}>
                <Typography variant="body2">
                  <strong>{group.name}</strong>
                </Typography>
                <Typography variant="body2">Group ID: {group.id}</Typography>
              </Box>
              <Box sx={{ width: '10%' }}>
                <CopyToClipboardButton value={() => group.id} tooltipTitle={t('group-id-copied')} />
              </Box>
            </Box>
            {i < groups.length - 1 && <Divider />}
          </Fragment>
        ))}
    </Box>
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
        <Typography
          tabIndex={0}
          aria-label={t('generated-api-keys')}
          variant="h5"
          sx={{ marginBottom: isMobile ? 3 : undefined }}
        >
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

        <Dialog
          open={modal.view !== ModalApiKeyView.NONE}
          onClose={handleCloseModal}
          aria-modal="true"
        >
          <Box
            sx={{
              padding: 4,
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
                          <CopyToClipboardButton
                            value={() => modal.apiKey?.value || ''}
                            tooltipTitle={t('api-key-copied')}
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
            {modal.view === ModalApiKeyView.VIEW_GROUPS_ID && (
              <ApiKeyModal
                titleSx={{ marginBottom: isMobile ? 3 : undefined }}
                title={t('view-groups-id', { apikey: modal.apiKey?.name })}
                subTitle={t('view-groups-id-message')}
                subTitleAtBottom
                content={<TableGroupsId groups={modal.apiKey?.groups} />}
                closeButtonLabel={t('close-button')}
                closeModalHandler={handleCloseModal}
              />
            )}
          </Box>
        </Dialog>
      </ApiErrorWrapper>
    </Box>
  );
};

export default ApiKeys;
