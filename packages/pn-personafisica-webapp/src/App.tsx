import { useTranslation } from 'react-i18next';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { LoadingOverlay, Layout, AppMessage, SideMenu, SideMenuItem } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { PAGOPA_HELP_EMAIL, URL_FE_LOGIN } from './utils/constants';
import { RootState } from './redux/store';
import { Delegation } from './redux/delegation/types';
import { getSidemenuInformation } from './redux/sidemenu/actions';

const App = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common');
  const [pendingDelegatorsState, setPendingDelegatorsState] = useState(0);
  const sessionToken = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const { pendingDelegators, delegators } = useAppSelector(
    (state: RootState) => state.sidemenuState
  );

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
        ? routes.GET_NOTIFICHE_DELEGATO_PATH(delegator.delegator.fiscalCode)
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
    { label: t('menu.profilo'), icon: SettingsOutlinedIcon, route: routes.PROFILO },
  ];

  return (
    <Layout
      onExitAction={() => dispatch(logout())}
      assistanceEmail={PAGOPA_HELP_EMAIL}
      sideMenu={<SideMenu menuItems={menuItems} />}
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
