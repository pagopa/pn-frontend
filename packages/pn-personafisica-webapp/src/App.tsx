import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { LoadingOverlay, Layout, AppMessage, SideMenu, SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { PAGOPA_HELP_EMAIL } from './utils/constants';

const App = () => {
  const token = useAppSelector((state: RootState) => state.userState.user.sessionToken);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const menuItems: Array<SideMenuItem> = [
    { label: 'Notifiche', icon: MailOutlineIcon, route: routes.NOTIFICHE },
    { label: 'Deleghe', icon: PeopleOutlineIcon, route: routes.DELEGHE },
    { label: 'Profilo', icon: SettingsOutlinedIcon, route: routes.PROFILO },
  ];
  
  useEffect(() => {
    if (token !== '') {
      navigate('/notifiche');
    }
  }, [token]);

  return (
    <Layout
      onExitAction={() => dispatch(logout())}
      assistanceEmail={PAGOPA_HELP_EMAIL}
      sideMenu={<SideMenu menuItems={menuItems}/>}
    >
      <AppMessage />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};

export default App;
