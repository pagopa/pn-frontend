import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Block, Delete, Sync } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import { ApiErrorWrapper, appStateActions } from '@pagopa-pn/pn-commons';

import {
  ChangeStatusPublicKeyV1StatusEnum,
  PublicKeyRow,
  PublicKeyStatus,
} from '../../generated-client/pg-apikeys';
import { ModalApiKeyView } from '../../models/ApiKeys';
import * as routes from '../../navigation/routes.const';
import {
  PUBLIC_APIKEYS_ACTIONS,
  changePublicKeyStatus,
  deletePublicKey,
  getPublicKeys,
} from '../../redux/apikeys/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import ApiKeyModal from './ApiKeyModal';
import PublicKeysTable from './PublicKeysTable';
import { ShowCodesInput } from './ShowCodesInput';

type ModalType = {
  view: ModalApiKeyView;
  publicKey?: PublicKeyRow;
};

const PublicKeys: React.FC = () => {
  const { t } = useTranslation(['integrazioneApi', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);

  const [modal, setModal] = useState<ModalType>({ view: ModalApiKeyView.NONE });

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

  const handleGeneratePublicKey = (publicKeyId?: string) => {
    handleCloseModal();
    const pathStr = publicKeyId ? `/${publicKeyId}` : '';
    navigate(`${routes.REGISTRA_CHIAVE_PUBBLICA}${pathStr}`);
  };

  const blockPublicKey = (publicKeyId?: string) => {
    if (!publicKeyId) {
      return;
    }
    handleCloseModal();
    dispatch(
      changePublicKeyStatus({ kid: publicKeyId, status: ChangeStatusPublicKeyV1StatusEnum.Block })
    )
      .unwrap()
      .then(() => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('messages.success.public-key-blocked'),
          })
        );
        fetchPublicKeys();
      })
      .catch(() => {});
  };

  const deleteApiKey = (publicKeyId?: string) => {
    if (!publicKeyId) {
      return;
    }
    handleCloseModal();
    dispatch(deletePublicKey(publicKeyId))
      .unwrap()
      .then(() => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('messages.success.public-key-deleted'),
          })
        );
        fetchPublicKeys();
      })
      .catch(() => {});
  };

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
        data-testid="publicKeys"
      >
        <Typography variant="h6" sx={{ mb: { xs: 3, lg: 0 } }}>
          {t('publicKeys.title')}
        </Typography>
        {!hasOneActiveKey && (
          <Button
            id="generate-public-key"
            data-testid="generatePublicKey"
            variant="contained"
            sx={{ mb: { xs: 3, lg: 0 } }}
            onClick={() => handleGeneratePublicKey()}
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
                  name="value"
                  value={modal.publicKey?.value ?? ''}
                  label="publicKeys.personal-key"
                />
                <ShowCodesInput
                  name="kid"
                  value={modal.publicKey?.kid ?? ''}
                  label="publicKeys.kid"
                />
                <ShowCodesInput
                  name="issuer"
                  value={modal.publicKey?.issuer ?? ''}
                  label="publicKeys.issuer"
                />
              </Stack>
            }
            closeButtonLabel={t('button.close', { ns: 'common' })}
            closeModalHandler={handleCloseModal}
            closeButtonVariant="contained"
          />
        )}
        {modal.view === ModalApiKeyView.BLOCK && (
          <ApiKeyModal
            title={t('dialogs.block-title')}
            subTitle={t('dialogs.block-subtitle')}
            closeButtonLabel={t('button.annulla', { ns: 'common' })}
            closeModalHandler={handleCloseModal}
            actionButtonLabel={t('block-button')}
            buttonIcon={<Block fontSize="small" sx={{ mr: 1 }} />}
            actionHandler={() => blockPublicKey(modal.publicKey?.kid)}
          />
        )}
        {modal.view === ModalApiKeyView.ROTATE && (
          <ApiKeyModal
            title={t('dialogs.rotate-title')}
            subTitle={t('dialogs.rotate-public-key-subtitle')}
            content={<Typography>{t('dialogs.rotate-warning')}</Typography>}
            closeButtonLabel={t('button.annulla', { ns: 'common' })}
            closeModalHandler={handleCloseModal}
            actionButtonLabel={t('rotate-public-key-button')}
            buttonIcon={<Sync fontSize="small" sx={{ mr: 1 }} />}
            actionHandler={() => handleGeneratePublicKey(modal.publicKey?.kid)}
          />
        )}
        {modal.view === ModalApiKeyView.DELETE && (
          <ApiKeyModal
            title={t('dialogs.delete-title')}
            subTitle={t('dialogs.delete-subtitle')}
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
