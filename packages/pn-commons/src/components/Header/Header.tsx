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
  /** Whether there is a logged user */
  isLogged?: boolean;
  /** Enable assistance button */
  enableAssistanceButton?: boolean;
};

const Header: React.FC<HeaderProps> = ({
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
  isLogged,
  enableAssistanceButton,
}) => {
  const pagoPAHeaderLink: RootLinkType = {
    ...pagoPALink(),
    label: 'PagoPA S.p.A.',
    title: getLocalizedOrDefaultLabel('common', 'header.pago-pa-link', 'Sito di PagoPA S.p.A.'),
  };

  const handleProductSelection = (product: ProductEntity) => {
    if (product.productUrl) {
      /* eslint-disable-next-line functional/immutable-data */
      window.location.assign(product.productUrl);
      /**
       * Here is necessary to clear sessionStorage otherwise when navigating through Area Riservata
       * we enter in a state where the user was previously logged in but Area Riservata and PN require
       * another token-exchange. Since the user "seems" to be logged in due to the presence of the old token
       * in session storage, the token-exchange doesn't happen and the application enters in a blank state.
       *
       * Carlotta Dimatteo 07/11/2022
       */
      sessionStorage.clear();
    }
  };

  const handlePartySelection = (party: PartyEntityWithUrl) => {
    if (party.entityUrl) {
      window.location.assign(party.entityUrl);
      /** Here is necessary to clear sessionStorage otherwise when navigating through Parties
       * we enter in a state where the user was logged with previous party. Due to this, when we login with another party,
       * we see for a moment the informations about the previous party.
       *
       * Andrea Cimini 31/10/2023
       */
      sessionStorage.clear();
    }
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
        enableAssistanceButton={enableAssistanceButton}
        translationsMap={{
          logIn: getLocalizedOrDefaultLabel('common', 'header.login', 'Accedi'),
          logOut: getLocalizedOrDefaultLabel('common', 'header.logout', 'Esci'),
          assistance: getLocalizedOrDefaultLabel('common', 'header.assistance', 'Assistenza'),
        }}
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