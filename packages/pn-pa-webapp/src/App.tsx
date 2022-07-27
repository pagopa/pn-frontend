import { ErrorInfo, useEffect, useMemo } from 'react';
import { AppMessage, Layout, LoadingOverlay, SideMenu, useUnload } from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductSwitchItem } from '@pagopa/mui-italia';

import { useLocation } from 'react-router-dom';
import Router from './navigation/routes';
import { getOrganizationParty, logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { getMenuItems } from './utils/role.utility';

import { PAGOPA_HELP_EMAIL, SELFCARE_BASE_URL } from './utils/constants';
import { mixpanelInit, trackEventByType } from './utils/mixpanel';
import { TrackEventType } from './utils/events';
import './utils/onetrust';

declare const OneTrust: any;
declare const OnetrustActiveGroups: string;
const global = window as any;
// target cookies (Mixpanel)
const targCookiesGroup = 'C0004';

const App = () => {
  useUnload((e: Event) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    e.defaultPrevented;
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const loggedUserOrganizationParty = useAppSelector((state: RootState) => state.userState.organizationParty);

  const dispatch = useAppDispatch();

  // TODO check if it can exist more than one role on user
  const role = loggedUser.organization?.roles[0];
  const idOrganization = loggedUser.organization?.id;
  const menuItems = useMemo(() => getMenuItems(idOrganization, role?.role), [role, idOrganization]);
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

  const partyList: Array<PartyEntity> = useMemo(
    () => [
      {
        id: '0',
        name: loggedUserOrganizationParty ? loggedUserOrganizationParty.name : "Ente sconosciuto",
        productRole: role?.role,
        logoUrl: `https://cdn.icon-icons.com/icons2/1863/PNG/512/account-balance_119479.png`,
        // logoUrl: <AccountBalanceIcon />
      },
    ],
    [role, loggedUserOrganizationParty]
  );

  useEffect(() => {
    // OneTrust callback at first time
    // eslint-disable-next-line functional/immutable-data
    global.OptanonWrapper = function () {
      OneTrust.OnConsentChanged(function () {
        const activeGroups = OnetrustActiveGroups;
        if (activeGroups.indexOf(targCookiesGroup) > -1) {
          mixpanelInit();
        }
      });
    };
    // check mixpanel cookie consent in cookie
    const OTCookieValue: string =
      document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || '';
    const checkValue = `${targCookiesGroup}%3A1`;
    if (OTCookieValue.indexOf(checkValue) > -1) {
      mixpanelInit();
    }
  }, []);

  useEffect(() => {
    if (idOrganization) {
      void dispatch(
        getOrganizationParty(idOrganization)
      );
    }
  }, [idOrganization]);

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
