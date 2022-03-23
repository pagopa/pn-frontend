import { useTranslation } from 'react-i18next';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { LoadingOverlay, Layout, AppMessage, SideMenu, SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch } from './redux/hooks';
import { PAGOPA_HELP_EMAIL } from './utils/constants';

const App = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common');

  const menuItems: Array<SideMenuItem> = [
    { label: t('menu.notifiche'), icon: MailOutlineIcon, route: routes.NOTIFICHE },
    { label: t('menu.deleghe'), icon: PeopleOutlineIcon, route: routes.DELEGHE },
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
