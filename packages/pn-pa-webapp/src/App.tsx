import { useEffect, useMemo, ErrorInfo } from 'react';
import { LoadingOverlay, Layout, AppMessage, SideMenu } from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductSwitchItem } from '@pagopa/mui-italia';

import { useLocation } from 'react-router-dom';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';

import {
  PAGOPA_HELP_EMAIL,
  SELFCARE_BASE_URL,
  PARTY_MOCK,
} from './utils/constants';
import { mixpanelInit, trackEventByType } from './utils/mixpanel';
import { TrackEventType } from './utils/events';

const App = () => {
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const dispatch = useAppDispatch();

  // TODO check if it can exist more than one role on user
  const role = loggedUser.organization?.roles[0];
  const idOrganization = loggedUser.organization?.id;
  const menuItems = useMemo(
    () => getMenuItems(role.partyRole, idOrganization),
    [role, idOrganization]
  );
  const jwtUser = useMemo(
    () => ({
      id: loggedUser.fiscal_number,
      name: loggedUser.name,
      surname: loggedUser.family_name,
    }),
    [loggedUser]
  );

  // TODO: get products list from be (?)
  const productsList: Array<ProductSwitchItem> = useMemo(
    () => [
      {
        id: '1',
        title: `Area Riservata`,
        productUrl: `${SELFCARE_BASE_URL as string}/dashboard/${idOrganization}`,
        linkType: 'external',
      },
      {
        id: '0',
        title: `Piattaforma Notifiche`,
        productUrl: '',
        linkType: 'internal',
      },
    ],
    [idOrganization]
  );

  // TODO: get parties list from be (?)
  const partyList: Array<PartyEntity> = useMemo(() => [
    {
      id: '0',
      name: PARTY_MOCK,
      productRole: role.role,
      logoUrl: `https://assets.cdn.io.italia.it/logos/organizations/1199250158.png`,
    },
  ], [role]);

  useEffect(() => {
    // init mixpanel
    mixpanelInit();
  }, []);

  const { pathname } = useLocation();
  const path = pathname.split('/');
  const source = path[path.length - 1];

  const handleEventTrackingCallbackAppCrash = (e: Error, eInfo: ErrorInfo) => {
    trackEventByType(TrackEventType.APP_CRASH, {
      route: source,
      stacktrace: { error: e, errorInfo: eInfo },
    });
  };

  const handleLogout = () => {
    trackEventByType(TrackEventType.USER_LOGOUT);
    void dispatch(logout());
  };

  return (
    <Layout
      onExitAction={() => dispatch(logout())}
      eventTrackingCallbackAppCrash={handleEventTrackingCallbackAppCrash}
      sideMenu={
        role &&
        menuItems && (
          <SideMenu menuItems={menuItems.menuItems} selfCareItems={menuItems.selfCareItems} />
        )
      }
      assistanceEmail={PAGOPA_HELP_EMAIL}
      productsList={productsList}
      productId={"0"}
      partyList={partyList}
      loggedUser={jwtUser}
    >
      <AppMessage
        sessionRedirect={handleLogout}
      />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};
export default App;
