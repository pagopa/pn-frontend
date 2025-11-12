import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Add } from '@mui/icons-material';
import { Box, Button, InputAdornment, Link, TextField, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  CustomPagination,
  PaginationData,
  TitleBox,
  appStateActions,
  calculatePages,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

import ApiKeyModal from '../components/ApiKeys/ApiKeyModal';
import DesktopApiKeys from '../components/ApiKeys/DesktopApiKeys';
import { ApiKey, ApiKeySetStatus, ModalApiKeyView } from '../models/ApiKeys';
import * as routes from '../navigation/routes.const';
import {
  API_KEYS_ACTIONS,
  changeApiKeyStatus,
  deleteApiKey,
  getApiKeys,
} from '../redux/apiKeys/actions';
import { setPagination } from '../redux/apiKeys/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';

const LinkApiB2b: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { API_B2B_LINK } = getConfiguration();
  return (
    <Link href={API_B2B_LINK} target="_blank">
      {children}
    </Link>
  );
};

const TableGroupsId = ({ groups }: { groups?: Array<{ id: string; name: string }> }) => {
  const { t } = useTranslation(['apikeys']);
  return (
    <Box>
      {groups?.map((group, index) => (
        <Box
          key={group.name}
          sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>{group.name}</strong>
          </Typography>
          <TextField
            label={t('group-id')}
            defaultValue={group.id}
            fullWidth
            sx={{
              mb: index < groups.length - 1 ? 2 : 0,
            }}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <CopyToClipboardButton value={() => group.id} tooltipTitle={t('group-id-copied')} />
              ),
            }}
          />
        </Box>
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
  const pagination = useAppSelector((state: RootState) => state.apiKeysState.pagination);

  const totalElements = apiKeys.total;
  const pagesToShow: Array<number> = calculatePages(
    pagination.size,
    totalElements,
    Math.min(pagination.nextPagesKey.length + 1, 3),
    pagination.page + 1
  );

  const fetchApiKeys = useCallback(() => {
    const params = {
      limit: pagination.size,
      ...pagination.nextPagesKey[pagination.page - 1],
    };
    void dispatch(getApiKeys(params));
  }, [pagination.size, pagination.page]);

  type modalType = {
    view: ModalApiKeyView;
    apiKey?: ApiKey;
  };

  const [modal, setModal] = useState<modalType>({ view: ModalApiKeyView.NONE });

  const handleCloseModal = () => {
    setModal({ view: ModalApiKeyView.NONE });
  };

  const handleModalClick = (view: ModalApiKeyView, apiKeyId: number) => {
    setModal({ view, apiKey: apiKeys.items[apiKeyId] });
  };

  const handleNewApiKeyClick = () => {
    navigate(routes.NUOVA_API_KEY);
  };

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const apiKeyBlocked = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(changeApiKeyStatus({ apiKey: apiKeyId, status: ApiKeySetStatus.BLOCK })).then(
      fetchApiKeys
    );
  };

  const apiKeyEnabled = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(changeApiKeyStatus({ apiKey: apiKeyId, status: ApiKeySetStatus.ENABLE })).then(
      fetchApiKeys
    );
  };

  const apiKeyRotated = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(changeApiKeyStatus({ apiKey: apiKeyId, status: ApiKeySetStatus.ROTATE })).then(
      fetchApiKeys
    );
  };

  const apiKeyDeleted = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(deleteApiKey(apiKeyId))
      .then(() =>
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('api-key-succesfully-deleted'),
          })
        )
      )
      .then(fetchApiKeys);
  };

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  console.log('TMP - Force build');

  return (
    <Box p={3}>
      <TitleBox
        variantTitle="h4"
        title={t('title')}
        subTitle={
          <Trans
            ns={'apikeys'}
            i18nKey={'subtitle'}
            components={[<LinkApiB2b key={'LinkApiB2b'} />]}
          />
        }
        variantSubTitle="body1"
      />
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
          id="generate-api-key"
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
        <DesktopApiKeys apiKeys={apiKeys.items} handleModalClick={handleModalClick} />
        {apiKeys.items.length > 0 && (
          <CustomPagination
            paginationData={{
              size: pagination.size,
              page: pagination.page,
              totalElements,
            }}
            onPageRequest={handleChangePage}
            pagesToShow={pagesToShow}
          />
        )}

        <Box sx={{ minWidth: isMobile ? '0' : '600px' }}>
          {modal.view === ModalApiKeyView.VIEW && (
            <ApiKeyModal
              aria-modal="true"
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
              title={t('block-api-key')}
              subTitle={
                <Trans
                  i18nKey="block-warning1"
                  ns="apikeys"
                  values={{ apiKeyName: modal.apiKey?.name }}
                />
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
              title={t('enable-api-key')}
              subTitle={
                <Trans
                  i18nKey="enable-warning"
                  ns="apikeys"
                  values={{ apiKeyName: modal.apiKey?.name }}
                />
              }
              closeButtonLabel={t('cancel-button')}
              closeModalHandler={handleCloseModal}
              actionButtonLabel={t('enable-button')}
              actionHandler={() => apiKeyEnabled(modal.apiKey?.id as string)}
            />
          )}
          {modal.view === ModalApiKeyView.ROTATE && (
            <ApiKeyModal
              title={t('rotate-api-key')}
              subTitle={
                <Trans
                  i18nKey="rotate-warning1"
                  ns="apikeys"
                  values={{ apiKeyName: modal.apiKey?.name }}
                />
              }
              content={<Typography>{t('rotate-warning2')}</Typography>}
              closeButtonLabel={t('cancel-button')}
              closeModalHandler={handleCloseModal}
              actionButtonLabel={t('rotate-button')}
              actionHandler={() => apiKeyRotated(modal.apiKey?.id as string)}
            />
          )}
          {modal.view === ModalApiKeyView.DELETE && (
            <ApiKeyModal
              title={t('delete-api-key')}
              subTitle={
                <Trans
                  i18nKey="delete-warning"
                  ns="apikeys"
                  values={{ apiKeyName: modal.apiKey?.name }}
                />
              }
              closeButtonLabel={t('cancel-button')}
              closeModalHandler={handleCloseModal}
              actionButtonLabel={t('delete-button')}
              actionHandler={() => apiKeyDeleted(modal.apiKey?.id as string)}
            />
          )}
          {modal.view === ModalApiKeyView.VIEW_GROUPS_ID && (
            <ApiKeyModal
              title={t('view-groups-id', { apikey: modal.apiKey?.name })}
              subTitle={t('view-groups-id-message')}
              subTitleAtBottom
              content={<TableGroupsId groups={modal.apiKey?.groups} />}
              closeButtonLabel={t('close-button')}
              closeModalHandler={handleCloseModal}
            />
          )}
        </Box>
      </ApiErrorWrapper>
    </Box>
  );
};

export default ApiKeys;
