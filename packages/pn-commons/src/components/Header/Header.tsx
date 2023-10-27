import { AppBar } from '@mui/material';
import {
  HeaderAccount,
  HeaderProduct,
  JwtUser,
  PartyEntity,
  ProductEntity,
  RootLinkType,
  UserAction,
} from '@pagopa/mui-italia';

import { PartyEntityWithUrl } from '../../models/Institutions';
import { pagoPALink } from '../../utility/costants';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

type HeaderProps = {
  /** List of available products */
  productsList: Array<ProductEntity>;
  /** Show Header Product */
  showHeaderProduct?: boolean;
  /** Current product */
  productId?: string;
  /** Current institution */
  partyId?: string;
  /** List of available parties */
  partyList?: Array<PartyEntity>;
  /** Logout/exit action to apply */
  onExitAction?: () => void;
  /** current logged user */
  loggedUser: JwtUser;
  /** Enable user dropdown */
  enableDropdown?: boolean;
  /** Actions linked to user dropdown */
  userActions?: Array<UserAction>;
  /** Actions linked to user dropdown */
  onAssistanceClick?: () => void;
  /** Track product switch action */
  eventTrackingCallbackProductSwitch?: (target: string) => void;
  /** Whether there is a logged user */
  isLogged?: boolean;
  /** Base Url of Selfcare for token-exchange */
  selfcareBaseUrl?: string;
};

const Header = ({
  onExitAction = () => window.location.assign(''),
  productsList,
  showHeaderProduct = true,
  productId,
  partyId,
  partyList,
  loggedUser,
  enableDropdown,
  userActions,
  onAssistanceClick,
  eventTrackingCallbackProductSwitch,
  isLogged,
  selfcareBaseUrl,
}: HeaderProps) => {
  const pagoPAHeaderLink: RootLinkType = {
    ...pagoPALink(),
    label: 'PagoPA S.p.A.',
    title: getLocalizedOrDefaultLabel('common', 'header.pago-pa-link', 'Sito di PagoPA S.p.A.'),
  };

  const trackEvent = (url: string) => {
    if (eventTrackingCallbackProductSwitch) {
      eventTrackingCallbackProductSwitch(url);
    }
  };

  const handleProductSelection = (product: ProductEntity) => {
    if (!partyId) {
      return;
    }
    // eslint-disable-next-line functional/no-let
    let url: string;
    /** Here is necessary to clear sessionStorage otherwise when navigating throgh Area Riservata
     * We enter in a state when the user was previously logged in but Area Riservata and PN require
     * another token-exchange. Since the user "seems" to be logged in due to the presence of the old token
     * in session storage, the token-exchange doesn't happen and the application enters in a blank state
     * Further analysis is required when the navigation from PN will be allowed also to other products and
     * not only to Area Reservata
     *
     * Carlotta Dimatteo 07/11/2022
     */
    sessionStorage.clear();

    if (product.id === 'selfcare') {
      url = `${selfcareBaseUrl}/dashboard/${partyId}`;
      window.location.assign(url);
      trackEvent(url);
      return;
    }

    url = `${selfcareBaseUrl}/token-exchange?institutionId=${partyId}&productId=${product.id}`;
    window.location.assign(url);
    trackEvent(url);
  };

  const handlePartySelection = (party: PartyEntityWithUrl) => {
    window.location.assign(party.entityUrl);
  };

  const enableHeaderProduct =
    showHeaderProduct &&
    (isLogged || isLogged === undefined) &&
    productsList &&
    productsList.length > 0;

  return (
    <AppBar sx={{ boxShadow: 'none', color: 'inherit' }} position="relative">
      <HeaderAccount
        rootLink={pagoPAHeaderLink}
        loggedUser={loggedUser}
        enableLogin={loggedUser.id !== ''}
        onAssistanceClick={onAssistanceClick || (() => {})}
        onLogout={onExitAction}
        enableDropdown={enableDropdown}
        userActions={userActions}
      />
      {enableHeaderProduct && (
        <HeaderProduct
          key={partyId}
          productId={productId}
          partyId={partyId}
          productsList={productsList}
          partyList={partyList}
          onSelectedProduct={handleProductSelection}
          onSelectedParty={(party) => handlePartySelection(party as PartyEntityWithUrl)}
        />
      )}
    </AppBar>
  );
};

export default Header;
