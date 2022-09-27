import { ErrorInfo, ReactNode } from 'react';
import { Stack } from '@mui/material';
import { JwtUser, PartyEntity, ProductEntity, UserAction } from '@pagopa/mui-italia';
import { Box } from '@mui/system';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ErrorBoundary from '../ErrorBoundary';
import { AppType } from "../../types/AppType";

type Props = {
  children?: ReactNode;
  /** Logout/exit action to apply */
  onExitAction?: () => void;
  /** Side Menu */
  sideMenu?: React.ReactElement;
  /** Show Side Menu */
  showSideMenu?: boolean;
  /** List of available products */
  productsList: Array<ProductEntity>;
  /** Current product */
  productId?: string;
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
  /** event callback on change language */
  eventTrackingCallbackFooterChangeLanguage?: () => void;
  /** Track product switch action */
  eventTrackingCallbackProductSwitch?: (target: string) => void;
  /** event on assistance click button */
  onAssistanceClick?: () => void;
  /** Type of the current application */
  appType?: AppType;
};

export default function Layout({
  children,
  onExitAction,
  sideMenu,
  showSideMenu = true,
  productsList,
  productId,
  partyList,
  loggedUser,
  enableUserDropdown,
  userActions,
  onLanguageChanged = () => {},
  eventTrackingCallbackAppCrash,
  eventTrackingCallbackFooterChangeLanguage,
  eventTrackingCallbackProductSwitch,
  onAssistanceClick,
  appType = AppType.PF
}: Props) {
  return (
    <ErrorBoundary sx={{ height: '100vh' }} eventTrackingCallback={eventTrackingCallbackAppCrash}>
      <Stack
        direction="column"
        sx={{ minHeight: '100vh' }} // 100vh per sticky footer
      >
        <Header
          onExitAction={onExitAction}
          productsList={productsList}
          productId={productId}
          partyList={partyList}
          loggedUser={loggedUser}
          enableDropdown={enableUserDropdown}
          userActions={userActions}
          onAssistanceClick={onAssistanceClick}
          eventTrackingCallbackProductSwitch={eventTrackingCallbackProductSwitch}
        />
        <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ flexGrow: 1 }}>
          {showSideMenu && (
            <Box sx={{ width: { lg: 300 }, flexShrink: '0' }} component="nav">
              {sideMenu}
            </Box>
          )}
          <Box sx={{ flexGrow: 1 }} component="main">
            <ErrorBoundary eventTrackingCallback={eventTrackingCallbackAppCrash}>
              {children}
            </ErrorBoundary>
          </Box>
        </Stack>
        <Footer
          loggedUser={loggedUser.id !== ''}
          onLanguageChanged={onLanguageChanged}
          eventTrackingCallbackChangeLanguage={eventTrackingCallbackFooterChangeLanguage}
          appType={appType}
        />
      </Stack>
    </ErrorBoundary>
  );
}
