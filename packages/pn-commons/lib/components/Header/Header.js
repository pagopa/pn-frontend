import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBar } from '@mui/material';
import { HeaderAccount, HeaderProduct, } from '@pagopa/mui-italia';
import { pagoPALink } from '../../utility/costants';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
const Header = ({ onExitAction = () => window.location.assign(''), productsList, showHeaderProduct = true, productId, partyId, partyList, loggedUser, enableDropdown, userActions, onAssistanceClick, eventTrackingCallbackProductSwitch, isLogged, }) => {
    const pagoPAHeaderLink = {
        ...pagoPALink(),
        label: 'PagoPA S.p.A.',
        title: getLocalizedOrDefaultLabel('common', 'header.pago-pa-link', 'Sito di PagoPA S.p.A.'),
    };
    const handleProductSelection = (product) => {
        if (eventTrackingCallbackProductSwitch) {
            eventTrackingCallbackProductSwitch(product.productUrl);
        }
        if (product.productUrl) {
            /* eslint-disable-next-line functional/immutable-data */
            window.location.assign(product.productUrl);
            /** Here is necessary to clear sessionStorage otherwise when navigating through Area Riservata
             * we enter in a state where the user was previously logged in but Area Riservata and PN require
             * another token-exchange. Since the user "seems" to be logged in due to the presence of the old token
             * in session storage, the token-exchange doesn't happen and the application enters in a blank state.
             *
             * Carlotta Dimatteo 07/11/2022
             */
            sessionStorage.clear();
        }
    };
    const handlePartySelection = (party) => {
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
    const enableHeaderProduct = showHeaderProduct &&
        (isLogged || isLogged === undefined) &&
        productsList &&
        productsList.length > 0;
    return (_jsxs(AppBar, { sx: { boxShadow: 'none', color: 'inherit' }, position: "relative", children: [_jsx(HeaderAccount, { rootLink: pagoPAHeaderLink, loggedUser: loggedUser, enableLogin: loggedUser.id !== '', onAssistanceClick: onAssistanceClick || (() => { }), onLogout: onExitAction, enableDropdown: enableDropdown, userActions: userActions }), enableHeaderProduct && (_jsx(HeaderProduct, { productId: productId, partyId: partyId, productsList: productsList, partyList: partyList, onSelectedProduct: handleProductSelection, onSelectedParty: (party) => handlePartySelection(party) }, partyId))] }));
};
export default Header;
