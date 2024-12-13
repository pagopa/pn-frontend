import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { IntegrationApiBanner, TitleBox, useHasPermissions } from '@pagopa-pn/pn-commons';

import PublicKeys from '../components/IntegrazioneApi/PublicKeys';
import VirtualKeys from '../components/IntegrazioneApi/VirtualKeys';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PNRole } from '../redux/auth/types';
import { checkPublicKeyIssuer } from '../redux/apikeys/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { PublicKeyStatus } from '../generated-client/pg-apikeys';

const ApiIntegration: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['integrazioneApi']);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);
  const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);
  const hasPublicActive = !!publicKeys.items.find(el=>el.status === PublicKeyStatus.Active);


  const fetchCheckIssuer = useCallback(() => {
    void dispatch(checkPublicKeyIssuer())
      .unwrap();
  }, []); 

  useEffect(()=>{
    fetchCheckIssuer();
  },[]);
  
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
        {!hasPublicActive && <IntegrationApiBanner/>}
        {isAdminWithoutGroups && <PublicKeys />}
         <VirtualKeys hasPublicActive={hasPublicActive} />
      </Box>
    </LoadingPageWrapper>
  );

};
export default ApiIntegration;

