import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { TitleBox, useHasPermissions } from '@pagopa-pn/pn-commons';

import IntegrationApiBanner from '../components/IntegrazioneApi/IntegrationApiBanner';
import PublicKeys from '../components/IntegrazioneApi/PublicKeys';
import VirtualKeys from '../components/IntegrazioneApi/VirtualKeys';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import {
  PublicKeyStatus,
  PublicKeysIssuerResponseIssuerStatusEnum,
} from '../generated-client/pg-apikeys';
import { PNRole } from '../models/User';
import {
  checkPublicKeyIssuer,
  getPublicKeys,
  getTosPrivacy,
  getVirtualApiKeys,
} from '../redux/apikeys/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const ApiIntegration: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['integrazioneApi']);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);
  const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);
  const virtualKeys = useAppSelector((state: RootState) => state.apiKeysState.virtualKeys);
  const hasPublicActive = !!publicKeys.items.find(
    (el) => el.status === PublicKeyStatus.Active || el.status === PublicKeyStatus.Rotated
  );
  const issuer = useAppSelector((state: RootState) => state.apiKeysState.issuerState.issuer);

  const isAdminWithoutGroups = userHasAdminPermissions && !currentUser.hasGroup;
  const issuerIsActive = issuer.issuerStatus === PublicKeysIssuerResponseIssuerStatusEnum.Active;
  // virtual key section must be show in those cases:
  // 1 - if the user is an admin and there is a public key active
  // 2 - if the user isn't an admin user
  // 3 - if there are virtual keys added
  const shouldRenderVirtualKeys =
    (hasPublicActive && isAdminWithoutGroups) ||
    !isAdminWithoutGroups ||
    virtualKeys.items.length > 0;

  console.log('TMP - Forcing build');

  useEffect(() => {
    // Issuer object has two keys: isPresent and issuerStatus.
    // isPresent is a boolean that is true when there is a public key (with any state)
    // isStatus is an enumeration and can has value is ACTIVE if there is an active or rotated public key,
    // or INACTIVE otherwise.
    // For admin user we don't need to call the issuer status because we have all the information that we need in the public keys array:
    // isPresent is true if publicKeys.length > 0
    // issuerStatus is active if we have at least one Active or Rotated key
    // tosAccepted can be checked calling the getTosPrivacy action
    if (isAdminWithoutGroups) {
      void dispatch(getPublicKeys({ showPublicKey: true }));
      void dispatch(getTosPrivacy());
    } else {
      void dispatch(checkPublicKeyIssuer());
    }
    void dispatch(getVirtualApiKeys({ showVirtualKey: true }));
  }, []);

  return (
    <LoadingPageWrapper isInitialized={true}>
      <Box p={3}>
        <TitleBox
          variantTitle="h4"
          title={t('title')}
          subTitle={t('subTitle')}
          variantSubTitle="body1"
        />
        {!issuerIsActive && virtualKeys.items.length > 0 && (
          <IntegrationApiBanner isAdminWithoutGroups={isAdminWithoutGroups} />
        )}
        {isAdminWithoutGroups && <PublicKeys />}
        {shouldRenderVirtualKeys && <VirtualKeys />}
      </Box>
    </LoadingPageWrapper>
  );
};
export default ApiIntegration;
