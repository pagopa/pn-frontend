import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Block, Delete, Sync } from '@mui/icons-material';
import { Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { ApiErrorWrapper, useHasPermissions } from '@pagopa-pn/pn-commons';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

import {
  ChangeStatusPublicKeyV1StatusEnum,
  PublicKeyRow,
  PublicKeyStatus,
} from '../../generated-client/pg-apikeys';
import { ModalApiKeyView } from '../../models/ApiKeys';
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
  publicKey?: PublicKeyRow;
};

const ShowCodesInput = ({ value, label }: { value: string; label: string }) => {
  const { t } = useTranslation(['integrazioneApi']);

  return (
    <TextField
      value={value}
      fullWidth
      label={t(label)}
      InputProps={{
        readOnly: true,
        sx: { p: 0 },
        endAdornment: (
          <InputAdornment position="end">
            <CopyToClipboardButton
              value={() => value}
              tooltipTitle={t('api-key-copied')}
              color="primary"
            />
          </InputAdornment>
        ),
      }}
    />
  );
};

const PublicKeys: React.FC = () => {
  const { t } = useTranslation(['integrazioneApi', 'common']);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);

  const [modal, setModal] = useState<ModalType>({ view: ModalApiKeyView.NONE });

  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);

  const isAdminWithoutGroups = userHasAdminPermissions && !currentUser.hasGroup;
  const hasOneActiveKey = publicKeys.items.some((key) => key.status === PublicKeyStatus.Active);

  const handleModalClick = (view: ModalApiKeyView, publicKeyId: string) => {
    setModal({ view, publicKey: publicKeys.items.find((key) => key.kid === publicKeyId) });
  };

  const handleCloseModal = () => {
    setModal({ view: ModalApiKeyView.NONE });
  };

  const fetchPublicKeys = useCallback(() => {
    void dispatch(getPublicKeys({ showPublicKey: true }));
  }, []);

  const blockPublicKey = (publicKeyId?: string) => {
    if (!publicKeyId) {
      return;
    }
    handleCloseModal();
    void dispatch(
      changePublicKeyStatus({ kid: publicKeyId, status: ChangeStatusPublicKeyV1StatusEnum.Block })
    ).then(fetchPublicKeys);
  };

  const deleteApiKey = (publicKeyId?: string) => {
    if (!publicKeyId) {
      return;
    }
    handleCloseModal();
    void dispatch(deletePublicKey(publicKeyId)).then(fetchPublicKeys);
  };

  useEffect(() => {
    fetchPublicKeys();
  }, []);

  return (
    <>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'start', lg: 'center' },
          mb: 3,
          mt: 5,
        }}
      >
        <Typography variant="h6" sx={{ mb: { xs: 3, lg: 0 } }}>
          {t('publicKeys.title')}
        </Typography>
        {isAdminWithoutGroups && !hasOneActiveKey && (
          <Button
            id="generate-public-key"
            data-testid="generatePublicKey"
            variant="contained"
            sx={{ mb: { xs: 3, lg: 0 } }}
            //   onClick={handleGeneratePublicKey}
          >
            {t('publicKeys.new-key-button')}
          </Button>
        )}
      </Stack>
      <ApiErrorWrapper
        apiId={PUBLIC_APIKEYS_ACTIONS.GET_PUBLIC_APIKEYS}
        reloadAction={() => fetchPublicKeys()}
        mainText={t('error-fecth-public-api-keys')}
        mt={3}
      >
        <PublicKeysTable publicKeys={publicKeys} handleModalClick={handleModalClick} />

        {modal.view === ModalApiKeyView.VIEW && (
          <ApiKeyModal
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
            closeButtonLabel={t('button.close', { ns: 'common' })}
            closeModalHandler={handleCloseModal}
            closeButtonVariant="contained"
          />
        )}
        {modal.view === ModalApiKeyView.BLOCK && (
          <ApiKeyModal
            title={t('publicKeys.block-title')}
            subTitle={t('publicKeys.block-subtitle')}
            content={<Typography>{t('publicKeys.block-warning')}</Typography>}
            closeButtonLabel={t('button.annulla', { ns: 'common' })}
            closeModalHandler={handleCloseModal}
            actionButtonLabel={t('block-button')}
            buttonIcon={<Block fontSize="small" sx={{ mr: 1 }} />}
            actionHandler={() => blockPublicKey(modal.publicKey?.kid)}
          />
        )}
        {modal.view === ModalApiKeyView.ROTATE && (
          <ApiKeyModal
            title={t('publicKeys.rotate-title')}
            subTitle={t('publicKeys.rotate-subtitle')}
            content={<Typography>{t('publicKeys.rotate-warning')}</Typography>}
            closeButtonLabel={t('button.annulla', { ns: 'common' })}
            closeModalHandler={handleCloseModal}
            actionButtonLabel={t('rotate-button')}
            buttonIcon={<Sync fontSize="small" sx={{ mr: 1 }} />}
            // actionHandler={() => apiKeyRotated(modal.apiKey?.id)}
          />
        )}
        {modal.view === ModalApiKeyView.DELETE && (
          <ApiKeyModal
            title={t('publicKeys.delete-title')}
            subTitle={t('publicKeys.delete-subtitle')}
            closeButtonLabel={t('button.annulla', { ns: 'common' })}
            closeModalHandler={handleCloseModal}
            actionButtonLabel={t('button.elimina', { ns: 'common' })}
            buttonIcon={<Delete fontSize="small" sx={{ mr: 1 }} />}
            actionHandler={() => deleteApiKey(modal.publicKey?.kid)}
            hasDeleteButton
          />
        )}
      </ApiErrorWrapper>
    </>
  );
};

export default PublicKeys;
