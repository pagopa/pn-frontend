import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Stack, Typography } from '@mui/material';
import { EmptyState, KnownSentiment } from '@pagopa-pn/pn-commons';

import {
  BffPublicKeysCheckIssuerResponse,
  PublicKeysIssuerResponseIssuerStatusEnum,
  VirtualKeyStatus,
} from '../../generated-client/pg-apikeys';
import { checkPublicKeyIssuer, getVirtualApiKeys } from '../../redux/apikeys/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import VirtualKeysTable from './VirtualKeysTable';

const VirtualKeys: React.FC = () => {
  const { t } = useTranslation('integrazioneApi');
  const dispatch = useAppDispatch();
  const virtualKeys = useAppSelector((state: RootState) => state.apiKeysState.virtualKeys);

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

  const handleGenerateVirtualKey = () => {};

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
            {t('publicKeys.new-key-button')}
          </Button>
        )}
      </Stack>

      {!issuerState.current.tosAccepted ? (
        <EmptyState sentimentIcon={KnownSentiment.NONE}>
          {t('virtualKeys.tos-empty-state')}
        </EmptyState>
      ) : (
        <VirtualKeysTable virtualKeys={virtualKeys} handleModalClick={() => void 0} />
      )}
    </>
  );
};

export default VirtualKeys;
