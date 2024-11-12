import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { TitleBox, useHasPermissions } from '@pagopa-pn/pn-commons';

import PublicKeys from '../components/IntegrazioneApi/PublicKeys';
import VirtualKeys from '../components/IntegrazioneApi/VirtualKeys';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PNRole } from '../redux/auth/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {  PublicKeysIssuerResponseIssuerStatusEnum, PublicKeyStatus } from '../generated-client/pg-apikeys';
import { checkPublicKeyIssuer } from '../redux/apikeys/actions';

const ApiIntegration: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['integrazioneApi']);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);
  const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);
  const issuerState = useAppSelector((state: RootState) => state.apiKeysState.issuerState);
  const hasValidKey = useMemo(()=>publicKeys.items.some((key) => key.status === PublicKeyStatus.Active ||  key.status === PublicKeyStatus.Rotated),[publicKeys]);
  const issuerActive = issuerState.issuer.isPresent && issuerState.issuer.issuerStatus === PublicKeysIssuerResponseIssuerStatusEnum.Active;
  
  const fetchCheckIssuer = useCallback(() => {
    void dispatch(checkPublicKeyIssuer())
      .unwrap();
  }, []);  

  useEffect(()=>{
    fetchCheckIssuer();
  },[publicKeys]);

  const isAdminWithoutGroups = userHasAdminPermissions && !currentUser.hasGroup;

  return (
    <LoadingPageWrapper isInitialized={true}>
      <Box p={3}>
        <TitleBox
          variantTitle="h4"
          title={t('title')}
          subTitle={t('subTitle')}
          variantSubTitle="body1"
        />
        {isAdminWithoutGroups && <PublicKeys />}
        {((isAdminWithoutGroups && hasValidKey) || issuerActive) && <VirtualKeys />}
      </Box>
    </LoadingPageWrapper>
  );

};
export default ApiIntegration;
