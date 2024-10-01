import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Block, Delete } from '@mui/icons-material';
import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  EmptyState,
  KnownSentiment,
  useHasPermissions,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

import { ApiKeyActions, ApiKeyStatus, ModalApiKeyView, PublicKey } from '../../models/ApiKeys';
import {
  PUBLIC_APIKEYS_ACTIONS,
  changePublicKeyStatus,
  deletePublicKey,
  getPublicKeys,
} from '../../redux/apikeys/actions';
import { PNRole } from '../../redux/auth/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import ApiKeyModal from './ApiKeyModal';
import PublicKeysTable from './PublicKeysTable';

type ModalType = {
  view: ModalApiKeyView;
  publicKey?: PublicKey;
};

const ShowCodesInput = ({ value, label }: { value: string; label: string }) => {
  const { t } = useTranslation(['integrazioneApi']);

  return (
    <TextField
      value={value}
      fullWidth={true}
      label={t(label)}
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <CopyToClipboardButton value={() => value} tooltipTitle={t('api-key-copied')} />
          </InputAdornment>
        ),
      }}
    />
  );
};

const PublicKeys: React.FC = () => {
  const { t } = useTranslation(['integrazioneApi']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);

  const [modal, setModal] = useState<ModalType>({ view: ModalApiKeyView.NONE });

  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);

  const isAdminWithoutGroups = userHasAdminPermissions && !currentUser.hasGroup;
  const hasOneActiveKey = publicKeys.items.some((key) => key.status === ApiKeyStatus.ACTIVE);

  const handleModalClick = (view: ModalApiKeyView, publicKeyId: number) => {
    setModal({ view, publicKey: publicKeys.items[publicKeyId] });
  };

  const handleCloseModal = () => {
    setModal({ view: ModalApiKeyView.NONE });
  };

  const fetchPublicKeys = useCallback(() => {
    void dispatch(getPublicKeys({ showPublicKey: true }));
  }, []);

  useEffect(() => {
    fetchPublicKeys();
  }, []);

  const blockPublicKey = (publicKeyId: string) => {
    handleCloseModal();
    void dispatch(changePublicKeyStatus({ kid: publicKeyId, status: ApiKeyActions.BLOCK })).then(
      fetchPublicKeys
    );
  };

  const deleteApiKey = (publicKeyId: string) => {
    handleCloseModal();
    void dispatch(deletePublicKey(publicKeyId)).then(fetchPublicKeys);
  };

  return (
    <Box mt={5}>
      <Box
        sx={{
          display: isMobile ? 'block' : 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: isMobile ? 3 : undefined }}>
          {t('publicKeys.title')}
        </Typography>
        {isAdminWithoutGroups && !hasOneActiveKey && (
          <Button
            id="generate-public-key"
            data-testid="generatePublicKey"
            variant="contained"
            sx={{ marginBottom: isMobile ? 3 : undefined }}
            //   onClick={handleGeneratePublicKey}
          >
            {t('publicKeys.new-key-button')}
          </Button>
        )}
      </Box>
      <ApiErrorWrapper
        apiId={PUBLIC_APIKEYS_ACTIONS.GET_PUBLIC_APIKEYS}
        reloadAction={() => fetchPublicKeys()}
        mainText={t('error-fecth-public-api-keys')}
        mt={3}
      >
        {publicKeys.items.length > 0 ? (
          <PublicKeysTable publicKeys={publicKeys} handleModalClick={handleModalClick} />
        ) : (
          <EmptyState sentimentIcon={KnownSentiment.NONE}>{t('publicKeys.empty-state')}</EmptyState>
        )}

        <Box sx={{ minWidth: isMobile ? '0' : '600px' }}>
          {modal.view === ModalApiKeyView.VIEW && (
            <ApiKeyModal
              aria-modal="true"
              title={t('publicKeys.view-title')}
              subTitle={t('publicKeys.view-subtitle')}
              content={
                <Stack spacing={2}>
                  <ShowCodesInput
                    value={modal.publicKey?.value || ''}
                    label="publicKeys.personal-key"
                  />
                  <ShowCodesInput value={modal.publicKey?.kid || ''} label="publicKeys.kid" />
                  <ShowCodesInput value={modal.publicKey?.issuer || ''} label="publicKeys.issuer" />
                </Stack>
              }
              closeButtonLabel={t('close-button')}
              closeModalHandler={handleCloseModal}
              closeButtonVariant="contained"
            />
          )}
          {modal.view === ModalApiKeyView.BLOCK && (
            <ApiKeyModal
              title={t('publicKeys.block-title')}
              subTitle={t('publicKeys.block-subtitle')}
              content={<Typography>{t('publicKeys.block-warning')}</Typography>}
              closeButtonLabel={t('cancel-button')}
              closeModalHandler={handleCloseModal}
              actionButtonLabel={t('block-button')}
              buttonIcon={<Block fontSize="small" sx={{ mr: 1 }} />}
              actionHandler={() => blockPublicKey(modal.publicKey?.kid as string)}
            />
          )}
          {modal.view === ModalApiKeyView.DELETE && (
            <ApiKeyModal
              title={t('publicKeys.delete-title')}
              subTitle={t('publicKeys.delete-subtitle')}
              closeButtonLabel={t('cancel-button')}
              closeModalHandler={handleCloseModal}
              actionButtonLabel={t('delete-button')}
              buttonIcon={<Delete fontSize="small" sx={{ mr: 1 }} />}
              actionHandler={() => deleteApiKey(modal.publicKey?.kid as string)}
            />
          )}
        </Box>
      </ApiErrorWrapper>
    </Box>
  );
};

export default PublicKeys;
