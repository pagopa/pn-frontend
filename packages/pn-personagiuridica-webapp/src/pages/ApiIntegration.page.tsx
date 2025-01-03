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
import { checkPublicKeyIssuer } from '../redux/apikeys/actions';
import { PNRole } from '../redux/auth/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const ApiIntegration: React.FC = () => {
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
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    // Issuer object has two keys: isPresent and issuerStatus.
    // isPresent is a boolean that is true when there is a public key (with any state)
    // isStatus is an enumeration and can has value is ACTIVE if there is an active or rotated public key,
    // or INACTIVE otherwise.
    // This check is to prevent a dobule call to the issuer api when the user is an admin. Without this check, the api stack would be:
    // - useEffect runs at first rendering -> the issuer api is called
    // - public key api is called -> the useEffect runs again -> the issuer api is called again
    // When the user is not an admin, the public key api is never called and so we have only one useEffect run.
    if (
      isAdminWithoutGroups &&
      ((!issuer.isPresent && publicKeys.items.length === 0) ||
        (issuer.isPresent && issuerIsActive && hasPublicActive) ||
        (issuer.isPresent && !issuerIsActive && !hasPublicActive))
    ) {
      return;
    }
    void dispatch(checkPublicKeyIssuer());
  }, [publicKeys]);

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
        {shouldRenderVirtualKeys && <VirtualKeys issuerIsActive={issuerIsActive} />}
      </Box>
    </LoadingPageWrapper>
  );
};
export default ApiIntegration;
