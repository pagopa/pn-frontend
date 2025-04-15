import { ErrorInfo, ReactNode } from 'react';

import { Stack } from '@mui/material';
import { Box, BoxOwnProps, StackProps } from '@mui/system';
import { JwtUser, PartyEntity, ProductEntity, UserAction } from '@pagopa/mui-italia';

import ErrorBoundary from '../ErrorBoundary';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

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
  /** Current language */
  currentLanguage: string;
  /** Function called when user chenge language */
  onLanguageChanged?: (langCode: string) => void;
  /** event callback on app crash  */
  eventTrackingCallbackAppCrash?: (_error: Error, _errorInfo: ErrorInfo) => void;
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
  /** Url to privacy policy page */
  privacyPolicyHref?: string;
  /** Url to terms of service page */
  termsOfServiceHref?: string;
  /** Enable assistance button */
  enableAssistanceButton?: boolean;
  slotsProps?: {
    content?: Partial<StackProps>;
    main?: Partial<BoxOwnProps>;
  };
};

const Layout: React.FC<Props> = ({
  children,
  onExitAction,
  sideMenu,
  showSideMenu = true,
  productsList,
  showHeaderProduct,
  productId,
  partyId,
  partyList,
  loggedUser,
  enableUserDropdown,
  userActions,
  currentLanguage,
  onLanguageChanged = () => {},
  eventTrackingCallbackAppCrash,
  eventTrackingCallbackRefreshPage,
  onAssistanceClick,
  isLogged,
  showHeader = true,
  showFooter = true,
  hasTermsOfService,
  privacyPolicyHref,
  termsOfServiceHref,
  enableAssistanceButton = true,
  slotsProps,
}) => (
  <ErrorBoundary
    sx={{ height: 'calc(100vh - 5px)' }}
    eventTrackingCallback={eventTrackingCallbackAppCrash}
    eventTrackingCallbackRefreshPage={eventTrackingCallbackRefreshPage}
  >
    {/* calc fixes the layout discrepancy given by the version box */}
    <Stack
      direction="column"
      sx={{ minHeight: 'calc(100vh - 5px)' }} // 100vh per sticky footer
    >
      <>
        {showHeader && (
          <Header
            onExitAction={onExitAction}
            productsList={productsList}
            showHeaderProduct={showHeaderProduct}
            productId={productId}
            partyId={partyId}
            partyList={partyList}
            loggedUser={loggedUser}
            enableDropdown={enableUserDropdown}
            userActions={userActions}
            onAssistanceClick={onAssistanceClick}
            isLogged={isLogged}
            enableAssistanceButton={enableAssistanceButton}
          />
        )}
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          sx={{ flexGrow: 1 }}
          {...slotsProps?.content}
        >
          {showSideMenu && (
            <Box
              sx={{ width: { lg: 300 }, flexShrink: '0' }}
              component="nav"
              data-testid="side-menu"
            >
              {sideMenu}
            </Box>
          )}
          <Box
            sx={{ flexGrow: 1, flexBasis: { xs: 1, lg: 'auto' }, position: 'relative' }}
            component="main"
            {...slotsProps?.main}
          >
            <ErrorBoundary eventTrackingCallback={eventTrackingCallbackAppCrash}>
              {children}
            </ErrorBoundary>
          </Box>
        </Stack>
        {showFooter && (
          <Footer
            currentLanguage={currentLanguage}
            onLanguageChanged={onLanguageChanged}
            loggedUser={loggedUser.id !== ''}
            hasTermsOfService={hasTermsOfService}
            privacyPolicyHref={privacyPolicyHref}
            termsOfServiceHref={termsOfServiceHref}
          />
        )}
      </>
    </Stack>
  </ErrorBoundary>
);

export default Layout;
