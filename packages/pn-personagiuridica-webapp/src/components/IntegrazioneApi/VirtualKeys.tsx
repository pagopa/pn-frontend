import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Block, Delete, Sync } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import { EmptyState, KnownSentiment } from '@pagopa-pn/pn-commons';

import {
  BffPublicKeysCheckIssuerResponse,
  PublicKeysIssuerResponseIssuerStatusEnum,
  VirtualKey,
  VirtualKeyStatus,
} from '../../generated-client/pg-apikeys';
import { ModalApiKeyView } from '../../models/ApiKeys';
import { checkPublicKeyIssuer, createVirtualApiKey, getVirtualApiKeys } from '../../redux/apikeys/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import ApiKeyModal from './ApiKeyModal';
import { ShowCodesInput } from './ApiKeysElements';
import VirtualKeysTable from './VirtualKeysTable';

type ModalType = {
  view: ModalApiKeyView;
  virtualKey?: VirtualKey;
};

const VirtualKeys: React.FC = () => {
  const { t } = useTranslation('integrazioneApi');
  const dispatch = useAppDispatch();
  const virtualKeys = useAppSelector((state: RootState) => state.apiKeysState.virtualKeys);
  const [modal, setModal] = useState<ModalType>({ view: ModalApiKeyView.NONE });

  const issuerState = useRef<BffPublicKeysCheckIssuerResponse>({
    tosAccepted: false,
    issuer: {
      isPresent: false,
      issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Inactive,
    },
  });

  const hasOneEnabledKey = virtualKeys.items.some((key) => key.status === VirtualKeyStatus.Enabled);
  const isCreationEnabled =
    !hasOneEnabledKey &&
    issuerState.current.tosAccepted &&
    issuerState.current.issuer.isPresent &&
    issuerState.current.issuer.issuerStatus === PublicKeysIssuerResponseIssuerStatusEnum.Active;

  const fetchVirtualKeys = useCallback(() => {
    void dispatch(getVirtualApiKeys({ showPublicKey: true }));
  }, []);

  const fetchCheckIssuer = useCallback(() => {
    void dispatch(checkPublicKeyIssuer())
      .unwrap()
      .then((response) => {
        // eslint-disable-next-line functional/immutable-data
        issuerState.current = response;
      });
  }, []);

  const handleGenerateVirtualKey = async () => {
    void dispatch(createVirtualApiKey({ name: "chiave-nuova"}))
    .unwrap()
    .then(response => {
      const newVirtualKey: VirtualKey = { value: response.virtualKey };
      setModal({ view: ModalApiKeyView.CREATE, virtualKey: newVirtualKey });
      void dispatch(getVirtualApiKeys());
    });
  };

  const handleModalClick = (view: ModalApiKeyView, publicKeyId: string) => {
    setModal({ view, virtualKey: virtualKeys.items.find((key) => key.id === publicKeyId) });
  };

  const handleCloseModal = () => {
    setModal({ view: ModalApiKeyView.NONE });
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
            id="generate-public-key"
            data-testid="generatePublicKey"
            variant="contained"
            sx={{ mb: { xs: 3, lg: 0 } }}
            onClick={handleGenerateVirtualKey}
          >
            {t('virtualKeys.new-key-button')}
          </Button>
        )}
      </Stack>

      {!issuerState.current.tosAccepted ? (
        <EmptyState sentimentIcon={KnownSentiment.NONE}>
          {t('virtualKeys.tos-empty-state')}
        </EmptyState>
      ) : (
        <VirtualKeysTable virtualKeys={virtualKeys} handleModalClick={handleModalClick} />
      )}

      {modal.view === ModalApiKeyView.CREATE && (
        <ApiKeyModal
          title={t('virtualKeys.create-title')}
          subTitle={t('virtualKeys.create-subtitle')}
          content={
            <Stack spacing={2} width="536px">
              <ShowCodesInput
                value={modal.virtualKey?.value ?? ''}
                label="virtualKeys.personal-key"
              />
            </Stack>
          }
          closeButtonLabel={t('virtualKeys.understood-button')}
          closeModalHandler={handleCloseModal}
          closeButtonVariant="contained"
        />
      )}
      {modal.view === ModalApiKeyView.VIEW && (
        <ApiKeyModal
          title={t('virtualKeys.view-title')}
          subTitle={t('virtualKeys.view-subtitle')}
          content={
            <Stack spacing={2} width="536px">
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
          title={t('publicKeys.block-title')}
          subTitle={t('publicKeys.block-subtitle')}
          content={<Typography>{t('publicKeys.block-warning')}</Typography>}
          closeButtonLabel={t('button.annulla', { ns: 'common' })}
          closeModalHandler={handleCloseModal}
          actionButtonLabel={t('block-button')}
          buttonIcon={<Block fontSize="small" sx={{ mr: 1 }} />}
          // actionHandler={() => blockPublicKey(modal.publicKey?.kid)}
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
          // actionHandler={() => deleteApiKey(modal.publicKey?.kid)}
          hasDeleteButton
        />
      )}
    </>
  );
};

export default VirtualKeys;
