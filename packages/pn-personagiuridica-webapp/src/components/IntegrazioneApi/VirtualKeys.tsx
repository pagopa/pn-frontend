import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Block, Delete, Sync } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import { EmptyState, KnownSentiment } from '@pagopa-pn/pn-commons';

import {
  BffPublicKeysCheckIssuerResponse,
  BffVirtualKeyStatusRequestStatusEnum,
  PublicKeysIssuerResponseIssuerStatusEnum,
  VirtualKey,
  VirtualKeyStatus,
} from '../../generated-client/pg-apikeys';
import { ModalApiKeyView } from '../../models/ApiKeys';
import {
  changeVirtualApiKeyStatus,
  checkPublicKeyIssuer,
  deleteVirtualApiKey,
  getVirtualApiKeys,
} from '../../redux/apikeys/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import ApiKeyModal from './ApiKeyModal';
import { ShowCodesInput } from './ShowCodesInput';
import VirtualKeysTable from './VirtualKeysTable';

type ModalType = {
  view: ModalApiKeyView;
  virtualKey?: VirtualKey;
};

const VirtualKeys: React.FC = () => {
  const { t } = useTranslation('integrazioneApi');
  const dispatch = useAppDispatch();
  const virtualKeys = useAppSelector((state: RootState) => state.apiKeysState.virtualKeys);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const [modal, setModal] = useState<ModalType>({ view: ModalApiKeyView.NONE });

  const [issuerState, setIssuerState] = useState<BffPublicKeysCheckIssuerResponse>({
    tosAccepted: false,
    issuer: {
      isPresent: false,
      issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Inactive,
    },
  });

  const hasOneEnabledKey = virtualKeys.items.find(
    (key) =>
      key.status === VirtualKeyStatus.Enabled &&
      (!key.user || key.user?.fiscalCode === currentUser.fiscal_number)
  );
  const isCreationEnabled =
    !hasOneEnabledKey &&
    issuerState.tosAccepted &&
    issuerState.issuer.isPresent &&
    issuerState.issuer.issuerStatus === PublicKeysIssuerResponseIssuerStatusEnum.Active;

  const fetchVirtualKeys = useCallback(() => {
    void dispatch(getVirtualApiKeys({ showPublicKey: true }));
  }, []);

  const fetchCheckIssuer = useCallback(() => {
    dispatch(checkPublicKeyIssuer())
      .unwrap()
      .then((response) => {
        setIssuerState(response);
      })
      .catch(() => {});
  }, []);

  const handleGenerateVirtualKey = () => {};

  const handleModalClick = (view: ModalApiKeyView, publicKeyId: string) => {
    setModal({ view, virtualKey: virtualKeys.items.find((key) => key.id === publicKeyId) });
  };

  const handleCloseModal = () => {
    setModal({ view: ModalApiKeyView.NONE });
  };

  const handleChangeVirtualKeyStatus = (
    status: BffVirtualKeyStatusRequestStatusEnum,
    virtualKeyId?: string
  ) => {
    if (!virtualKeyId) {
      return;
    }
    handleCloseModal();
    dispatch(
      changeVirtualApiKeyStatus({
        kid: virtualKeyId,
        body: {
          status,
        },
      })
    )
      .unwrap()
      .then(fetchVirtualKeys)
      .catch(() => {});
  };

  const handleDeleteVirtualKey = (virtualKeyId?: string) => {
    if (!virtualKeyId) {
      return;
    }
    handleCloseModal();
    dispatch(deleteVirtualApiKey(virtualKeyId))
      .unwrap()
      .then(fetchVirtualKeys)
      .catch(() => {});
  };

  useEffect(() => {
    fetchVirtualKeys();
    fetchCheckIssuer();
  }, []);

  return (
    <>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'start', lg: 'center' },
          mb: 3,
          mt: 8,
        }}
      >
        <Typography variant="h6" sx={{ mb: { xs: 3, lg: 0 } }}>
          {t('virtualKeys.title')}
        </Typography>
        {isCreationEnabled && (
          <Button
            id="generate-virtual-key"
            data-testid="generateVirtualKey"
            variant="contained"
            sx={{ mb: { xs: 3, lg: 0 } }}
            onClick={handleGenerateVirtualKey}
          >
            {t('virtualKeys.new-key-button')}
          </Button>
        )}
      </Stack>

      {!issuerState.tosAccepted ? (
        <EmptyState sentimentIcon={KnownSentiment.NONE}>
          {t('virtualKeys.tos-empty-state')}
        </EmptyState>
      ) : (
        <VirtualKeysTable virtualKeys={virtualKeys} handleModalClick={handleModalClick} />
      )}

      {modal.view === ModalApiKeyView.VIEW && (
        <ApiKeyModal
          title={t('virtualKeys.view-title')}
          subTitle={t('virtualKeys.view-subtitle')}
          content={
            <Stack spacing={2}>
              <ShowCodesInput
                value={modal.virtualKey?.value || ''}
                label="virtualKeys.personal-key"
              />
            </Stack>
          }
          closeButtonLabel={t('virtualKeys.understood-button')}
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
          actionHandler={() =>
            handleChangeVirtualKeyStatus(
              BffVirtualKeyStatusRequestStatusEnum.Block,
              modal.virtualKey?.id
            )
          }
        />
      )}
      {modal.view === ModalApiKeyView.ROTATE && (
        <ApiKeyModal
          title={t('dialogs.rotate-title')}
          subTitle={t('dialogs.rotate-virtual-key-subtitle')}
          content={<Typography>{t('dialogs.rotate-warning')}</Typography>}
          closeButtonLabel={t('button.annulla', { ns: 'common' })}
          closeModalHandler={handleCloseModal}
          actionButtonLabel={t('rotate-virtual-key-button')}
          buttonIcon={<Sync fontSize="small" sx={{ mr: 1 }} />}
          actionHandler={() =>
            handleChangeVirtualKeyStatus(
              BffVirtualKeyStatusRequestStatusEnum.Rotate,
              modal.virtualKey?.id
            )
          }
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
          actionHandler={() => handleDeleteVirtualKey(modal.virtualKey?.id)}
          hasDeleteButton
        />
      )}
    </>
  );
};

export default VirtualKeys;
