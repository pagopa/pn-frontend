import { ReactNode } from 'react';
import { Grid, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ProductEntity, JwtUser, PartyEntity, UserAction } from '@pagopa/mui-italia';

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
  /** List of available products */
  productsList: Array<ProductEntity>;
  /** List of available parties */
  partyList?: Array<PartyEntity>;
  /** current logged user */
  loggedUser: JwtUser;
  /** Enable user dropdown */
  enableUserDropdown?: boolean;
  /** Actions linked to user dropdown*/
  userActions?: Array<UserAction>;
};

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    background: '#F2F2F2',

    // '& > .MuiGrid-item:last-child': {
    //   minHeight: 'calc(100vh - 253px)',
    // },
  },
}));

export default function Layout({
  children,
  assistanceEmail,
  onExitAction,
  sideMenu,
  productsList,
  partyList,
  loggedUser,
  enableUserDropdown,
  userActions
}: Props) {
  const classes = useStyles();

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
        <Grid role={'navigation'} container direction="row" className={classes.root}>
          <Grid item lg={2} xs={12} container direction="column">
            {sideMenu}
          </Grid>
          <Grid item lg={10} xs={12} container direction="column">
            <ErrorBoundary>{children}</ErrorBoundary>
          </Grid>
        </Grid>
        <Footer />
      </Stack>
    </ErrorBoundary>
  );
}
