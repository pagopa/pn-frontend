import { ReactNode } from 'react';
import { Stack } from '@mui/material';
import { ProductEntity, JwtUser, PartyEntity, UserAction } from '@pagopa/mui-italia';
import { Box } from '@mui/system';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import ErrorBoundary from '../ErrorBoundary';
type Props = {
  children?: ReactNode;
  /** Assistance email for the user */
  assistanceEmail?: string;
  /** Logout/exit action to apply */
  onExitAction?: () => void;
  /** Side Menu */
  sideMenu?: React.ReactElement;
  /** Show Side Menu */
  showSideMenu?: boolean;
  /** List of available products */
  productsList: Array<ProductEntity>;
  /** List of available parties */
  partyList?: Array<PartyEntity>;
  /** current logged user */
  loggedUser: JwtUser;
  /** Enable user dropdown */
  enableUserDropdown?: boolean;
  /** Actions linked to user dropdown */
  userActions?: Array<UserAction>;
};

export default function Layout({
  children,
  assistanceEmail,
  onExitAction,
  sideMenu,
  showSideMenu = true,
  productsList,
  partyList,
  loggedUser,
  enableUserDropdown,
  userActions,
}: Props) {

  return (
    <ErrorBoundary sx={{ height: '100vh' }}>
      <Stack
        direction="column"
        sx={{ minHeight: '100vh'}} // 100vh per sticky footer
      >
        <Header
          onExitAction={onExitAction}
          assistanceEmail={assistanceEmail}
          productsList={productsList}
          partyList={partyList}
          loggedUser={loggedUser}
          enableDropdown={enableUserDropdown}
          userActions={userActions}
        />
        <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ flexGrow: 1 }}>
          {showSideMenu && (
          <Box sx={{ width: { lg: 300 }, flexShrink: '0'}} component="nav">
            {sideMenu}
          </Box>
          )}
          <Box sx={{ flexGrow: 1 }} component="main">
          <ErrorBoundary>{children}</ErrorBoundary>
          </Box>

        </Stack>
        <Footer />
      </Stack>
    </ErrorBoundary>
  );
}
