/// <reference types="react" />
import { JwtUser, PartyEntity, ProductEntity, UserAction } from '@pagopa/mui-italia';
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
};
declare const Header: ({ onExitAction, productsList, showHeaderProduct, productId, partyId, partyList, loggedUser, enableDropdown, userActions, onAssistanceClick, eventTrackingCallbackProductSwitch, isLogged, }: HeaderProps) => JSX.Element;
export default Header;
