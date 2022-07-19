import { ErrorInfo, useEffect, useMemo } from 'react';
import { AppMessage, Layout, LoadingOverlay, SideMenu } from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductSwitchItem } from '@pagopa/mui-italia';

import { useLocation } from 'react-router-dom';
import { useUnload } from '@pagopa-pn/pn-commons';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';

import { PAGOPA_HELP_EMAIL, PARTY_MOCK, SELFCARE_BASE_URL } from './utils/constants';
import { mixpanelInit, trackEventByType } from './utils/mixpanel';
import { TrackEventType } from './utils/events';

const App = () => {
  useUnload((e: Event) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    e.defaultPrevented;
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const dispatch = useAppDispatch();

  // TODO check if it can exist more than one role on user
  const role = loggedUser.organization?.roles[0];
  const idOrganization = loggedUser.organization?.id;
  const menuItems = useMemo(
    () => getMenuItems(idOrganization, role?.role),
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
      productRole: role?.role,
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

  const handleEventTrackingCallbackFooterChangeLanguage = () => {
    trackEventByType(TrackEventType.FOOTER_LANG_SWITCH);
  };

  const handleEventTrackingCallbackProductSwitch = (target: string) => {
    trackEventByType(TrackEventType.USER_PRODUCT_SWITCH, { target });
  };

  const handleLogout = () => {
    void dispatch(logout());
  };

  const handleAssistanceClick = () => {
    trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  return (
    <Layout
      onExitAction={handleLogout}
      eventTrackingCallbackAppCrash={handleEventTrackingCallbackAppCrash}
      eventTrackingCallbackFooterChangeLanguage={handleEventTrackingCallbackFooterChangeLanguage}
      eventTrackingCallbackProductSwitch={(target) =>
        handleEventTrackingCallbackProductSwitch(target)
      }
      sideMenu={
        role &&
        menuItems && (
          <SideMenu
            menuItems={menuItems.menuItems}
            selfCareItems={menuItems.selfCareItems}
            eventTrackingCallback={(target) =>
              trackEventByType(TrackEventType.USER_NAV_ITEM, { target })
            }
          />
        )
      }
      productsList={productsList}
      productId={'0'}
      partyList={partyList}
      loggedUser={jwtUser}
      onAssistanceClick={handleAssistanceClick}
    >
      <AppMessage sessionRedirect={handleLogout} />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};
export default App;
