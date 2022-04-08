import { useTranslation } from 'react-i18next';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { LoadingOverlay, Layout, AppMessage, SideMenu, SideMenuItem } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import { getNumberDelegator, logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { PAGOPA_HELP_EMAIL } from './utils/constants';
import { RootState } from './redux/store';

const App = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common');
  const [pendingDelegatorsState, setPendingDelegatorsState] = useState(0);

  const { pendingDelegators, delegators } = useAppSelector((state: RootState) => state.userState);

  useEffect(() => {
    void dispatch(getNumberDelegator());
  }, []);

  useEffect(() => {
    setPendingDelegatorsState(pendingDelegators);
  }, [pendingDelegators]);

  const mapDelegatorSideMenuItem = delegators.map((delegator) => ({
    label: `${delegator.delegator.firstName} ${delegator.delegator.lastName}`,
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
      <AppMessage />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};

export default App;
