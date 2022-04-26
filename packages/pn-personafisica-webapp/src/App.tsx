import { useTranslation } from 'react-i18next';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { LoadingOverlay, Layout, AppMessage, SideMenu, SideMenuItem } from '@pagopa-pn/pn-commons';
import { useEffect, useMemo, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { URL_FE_LOGIN } from './utils/constants';
import { RootState } from './redux/store';
import { Delegation} from './redux/delegation/types';
import { getSidemenuInformation } from './redux/sidemenu/actions';

// TODO: get products list from be (?)
const productsList = [
  {
    id: "0",
    title: `Piattaforma Notifiche`,
    productUrl: "",
  }
];

const App = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common');
  const [pendingDelegatorsState, setPendingDelegatorsState] = useState(0);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const { pendingDelegators, delegators } = useAppSelector((state: RootState) => state.sidemenuState);

  const sessionToken = useMemo(() => loggedUser.sessionToken, [loggedUser]);
  const jwtUser = useMemo(() => ({
    id: loggedUser.fiscal_number,
    name: loggedUser.name,
    surname: loggedUser.family_name,
    mail: loggedUser.email
  }), [loggedUser]);


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
    { label: t('menu.profilo'), icon: SettingsOutlinedIcon, route: routes.PROFILO },
  ];

  return (
    <Layout
      onExitAction={() => dispatch(logout())}
      sideMenu={<SideMenu menuItems={menuItems} />}
      productsList={productsList}
      loggedUser={jwtUser}
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
