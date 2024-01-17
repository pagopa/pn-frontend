import { ErrorInfo, ReactNode } from 'react';
import { JwtUser, PartyEntity, ProductEntity, UserAction } from '@pagopa/mui-italia';
type Props = {
    children?: ReactNode;
    /** Logout/exit action to apply */
    onExitAction?: () => void;
    /** Side Menu  */
    sideMenu?: React.ReactElement;
    /** Show Side Menu */
    showSideMenu?: boolean;
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
    /** current logged user */
    loggedUser: JwtUser;
    /** Enable user dropdown */
    enableUserDropdown?: boolean;
    /** Actions linked to user dropdown */
    userActions?: Array<UserAction>;
    /** Function called when user chenge language */
    onLanguageChanged?: (langCode: string) => void;
    /** event callback on app crash  */
    eventTrackingCallbackAppCrash?: (_error: Error, _errorInfo: ErrorInfo) => void;
    /** Track product switch action */
    eventTrackingCallbackProductSwitch?: (target: string) => void;
    /** event on assistance click button */
    eventTrackingCallbackRefreshPage?: () => void;
    /** event on refresh page click button */
    onAssistanceClick?: () => void;
    /** Whether there is a logged user */
    isLogged?: boolean;
    /** Layout visibility conditions */
    showHeader?: boolean;
    showFooter?: boolean;
    /** Shows or hides terms of service */
    hasTermsOfService?: boolean;
};
export default function Layout({ children, onExitAction, sideMenu, showSideMenu, productsList, showHeaderProduct, productId, partyId, partyList, loggedUser, enableUserDropdown, userActions, onLanguageChanged, eventTrackingCallbackAppCrash, eventTrackingCallbackProductSwitch, eventTrackingCallbackRefreshPage, onAssistanceClick, isLogged, showHeader, showFooter, hasTermsOfService, }: Readonly<Props>): JSX.Element;
export {};
