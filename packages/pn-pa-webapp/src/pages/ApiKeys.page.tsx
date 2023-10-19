import { Fragment, useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Add } from '@mui/icons-material';
import { Box, Button, Dialog, InputAdornment, Link, TextField, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  CustomPagination,
  PaginationData,
  TitleBox,
  calculatePages,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

import ApiKeyModal from '../components/ApiKeys/ApiKeyModal';
import DesktopApiKeys from '../components/ApiKeys/DesktopApiKeys';
import { ApiKey, ApiKeySetStatus, ModalApiKeyView } from '../models/ApiKeys';
import { UserGroup } from '../models/user';
import * as routes from '../navigation/routes.const';
import {
  API_KEYS_ACTIONS,
  deleteApiKey,
  getApiKeys,
  setApiKeyStatus,
} from '../redux/apiKeys/actions';
import { setPagination } from '../redux/apiKeys/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { TrackEventType } from '../utility/events';
import { trackEventByType } from '../utility/mixpanel';

import { getConfiguration } from '../services/configuration.service';

const SubTitle = () => {
  const { t } = useTranslation(['apikeys']);
  const { API_B2B_LINK } = getConfiguration();
  return (
    <Fragment>
      {t('subtitle.text1')}
      <Link target="_blank" href={`https://petstore.swagger.io/?url=${API_B2B_LINK}#/NewNotification/sendNewNotification`}>
        {t('subtitle.text2')}
      </Link>
      {t('subtitle.text3')}
      <Link target="_blank" href={`https://petstore.swagger.io/?url=${API_B2B_LINK}#/SenderReadB2B/retrieveNotificationRequestStatus`}>
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
        groups.map((group) => (
          <Fragment key={group.name}>
            <Box
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
                  mb: 3,
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <CopyToClipboardButton
                      value={() => group.id}
                      tooltipTitle={t('group-id-copied')}
                    />
                  ),
                }}
              ></TextField>
            </Box>
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
    apiKey?: ApiKey<UserGroup>;
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
    void dispatch(setApiKeyStatus({ apiKey: apiKeyId, status: ApiKeySetStatus.BLOCK })).then(
      fetchApiKeys
    );
  };

  const apiKeyEnabled = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(setApiKeyStatus({ apiKey: apiKeyId, status: ApiKeySetStatus.ENABLE })).then(
      fetchApiKeys
    );
  };

  const apiKeyRotated = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(setApiKeyStatus({ apiKey: apiKeyId, status: ApiKeySetStatus.ROTATE })).then(
      fetchApiKeys
    );
  };

  const apiKeyDeleted = (apiKeyId: string) => {
    handleCloseModal();
    void dispatch(deleteApiKey(apiKeyId)).then(fetchApiKeys);
  };

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    trackEventByType(TrackEventType.APIKEYS_TABLE_PAGINATION);
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  const handleEventTrackingCallbackPageSize = (pageSize: number) => {
    trackEventByType(TrackEventType.APIKEYS_TABLE_SIZE, { pageSize });
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
            eventTrackingCallbackPageSize={handleEventTrackingCallbackPageSize}
            pagesToShow={pagesToShow}
          />
        )}

        <Dialog
          open={modal.view !== ModalApiKeyView.NONE}
          onClose={handleCloseModal}
          aria-modal="true"
        >
          <Box sx={{ minWidth: isMobile ? '0' : '600px' }}>
            {modal.view === ModalApiKeyView.VIEW && (
              <ApiKeyModal
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
        </Dialog>
      </ApiErrorWrapper>
    </Box>
  );
};

export default ApiKeys;
