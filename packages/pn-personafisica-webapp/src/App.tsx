import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { LoadingOverlay, Layout, AppMessage, SideMenu, SideMenuItem } from '@pagopa-pn/pn-commons';
import { ProductSwitchItem } from '@pagopa/mui-italia';

import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { PAGOPA_HELP_EMAIL, URL_FE_LOGIN } from './utils/constants';
import { RootState } from './redux/store';
import { Delegation } from './redux/delegation/types';
import { getSidemenuInformation } from './redux/sidemenu/actions';
import { mixpanelInit } from './utils/mixpanel';

// TODO: get products list from be (?)
const productsList: Array<ProductSwitchItem> = [
  {
    id: '0',
    title: `Piattaforma Notifiche`,
    productUrl: '',
    linkType: 'internal',
  },
];

const App = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common');
  const [pendingDelegatorsState, setPendingDelegatorsState] = useState(0);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const { pendingDelegators, delegators } = useAppSelector(
    (state: RootState) => state.sidemenuState
  );
  const navigate = useNavigate();

  const sessionToken = loggedUser.sessionToken;
  const jwtUser = useMemo(
    () => ({
      id: loggedUser.fiscal_number,
      name: loggedUser.name,
      surname: loggedUser.family_name,
      mail: loggedUser.email,
    }),
    [loggedUser]
  );

  const userActions = useMemo(
    () => [
      {
        id: 'profile',
        label: t('menu.profilo'),
        onClick: () => {
          navigate(routes.PROFILO);
        },
        icon: <SettingsIcon fontSize="small" color="inherit" />,
      },
      {
        id: 'logout',
        label: t('header.logout'),
        onClick: () => dispatch(logout()),
        icon: <LogoutRoundedIcon fontSize="small" color="inherit" />,
      },
    ],
    []
  );

  useEffect(() => {
    // init mixpanel
    mixpanelInit();
  }, []);

  useEffect(() => {
    if (sessionToken !== '') {
      void dispatch(getSidemenuInformation());
    }
  }, [sessionToken]);

  useEffect(() => {
    setPendingDelegatorsState(pendingDelegators);
  }, [pendingDelegators]);

  const mapDelegatorSideMenuItem = delegators.map((delegator: Delegation) => ({
    icon: PersonIcon,
    label:
      'delegator' in delegator && delegator.delegator
        ? `${delegator.delegator.firstName} ${delegator.delegator.lastName}`
        : 'No Name Found',
    route:
      'delegator' in delegator && delegator.delegator
        ? routes.GET_NOTIFICHE_DELEGATO_PATH(delegator.mandateId)
        : '*',
  }));

  // TODO spostare questo in un file di utility
  const menuItems: Array<SideMenuItem> = [
    {
      label: t('menu.notifiche'),
      icon: MailOutlineIcon,
      route: routes.NOTIFICHE,
      children: mapDelegatorSideMenuItem.length ? mapDelegatorSideMenuItem : undefined,
    },
    { label: t('menu.contacts'), icon: MarkunreadMailboxIcon, route: routes.RECAPITI },
    {
      label: t('menu.deleghe'),
      icon: AltRouteIcon,
      route: routes.DELEGHE,
      rightBadgeNotification: pendingDelegatorsState ? pendingDelegatorsState : undefined,
    },
  ];

  return (
    <Layout
      assistanceEmail={PAGOPA_HELP_EMAIL}
      onExitAction={() => dispatch(logout())}
      sideMenu={<SideMenu menuItems={menuItems} />}
      productsList={productsList}
      loggedUser={jwtUser}
      enableUserDropdown
      userActions={userActions}
    >
      <AppMessage
        sessionRedirect={() => {
          /* eslint-disable-next-line functional/immutable-data */
          window.location.href = URL_FE_LOGIN as string;
        }}
      />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};

export default App;
