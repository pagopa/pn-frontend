import {useEffect, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {AppMessage, Layout, LoadingOverlay, SideMenu, SideMenuItem} from '@pagopa-pn/pn-commons';
import {ProductSwitchItem} from '@pagopa/mui-italia';

import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import {getToSApproval, logout} from './redux/auth/actions';
import {useAppDispatch, useAppSelector} from './redux/hooks';
import {PAGOPA_HELP_EMAIL} from './utils/constants';
import {RootState} from './redux/store';
import {Delegation} from './redux/delegation/types';
import {getDomicileInfo, getSidemenuInformation} from './redux/sidemenu/actions';
import {mixpanelInit, trackEventByType} from './utils/mixpanel';
import {TrackEventType} from "./utils/events";

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
  const { t } = useTranslation(['common', 'notifiche']);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const { fetchedTos, tos } = useAppSelector((state: RootState) => state.userState);
  const { pendingDelegators, delegators } = useAppSelector(
    (state: RootState) => state.generalInfoState
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
          trackEventByType(TrackEventType.USER_VIEW_PROFILE);
          navigate(routes.PROFILO);
        },
        icon: <SettingsIcon fontSize="small" color="inherit" />,
      },
      {
        id: 'logout',
        label: t('header.logout'),
        onClick: () => {
          trackEventByType(TrackEventType.USER_LOGOUT);
            void dispatch(logout());
        },
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
      void dispatch(getDomicileInfo());
      void dispatch(getToSApproval());
    }
  }, [sessionToken]);

  useEffect(() => {
    if (sessionToken !== '') {
      void dispatch(getSidemenuInformation());
    }
  }, [pendingDelegators]);

  const mapDelegatorSideMenuItem = (): Array<SideMenuItem> | undefined => {
    if(delegators.length > 0) {
      const myNotifications = {
        label: t('title', {ns: 'notifiche'}),
        route: routes.NOTIFICHE
      };
      const mappedDelegators = delegators.map((delegator: Delegation) => ({
        label:
          'delegator' in delegator && delegator.delegator
            ? `${delegator.delegator.displayName}`
            : 'No Name Found',
        route:
          'delegator' in delegator && delegator.delegator
            ? routes.GET_NOTIFICHE_DELEGATO_PATH(delegator.mandateId)
            : '*',
      }));
      return [ myNotifications, ...mappedDelegators];
    } else {
      return undefined;
    }
  };

  const sideMenuDelegators = mapDelegatorSideMenuItem();

  // TODO spostare questo in un file di utility
  const menuItems: Array<SideMenuItem> = [
    {
      label: t('menu.notifiche'),
      icon: MailOutlineIcon,
      route: routes.NOTIFICHE,
      children: sideMenuDelegators,
      notSelectable: sideMenuDelegators && sideMenuDelegators.length > 0
    },
    { label: t('menu.contacts'), icon: MarkunreadMailboxIcon, route: routes.RECAPITI },
    {
      label: t('menu.deleghe'),
      icon: AltRouteIcon,
      route: routes.DELEGHE,
      rightBadgeNotification: pendingDelegators ? pendingDelegators : undefined,
    },
  ];

  const handleAssistanceClick = () => {
    trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO);
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  return (
    <Layout

      onExitAction={() => dispatch(logout())}
      sideMenu={<SideMenu menuItems={menuItems} />}
      showSideMenu={!fetchedTos || tos}
      productsList={productsList}
      loggedUser={jwtUser}
      enableUserDropdown
      userActions={userActions}
      onAssistanceClick={handleAssistanceClick}
    >
      <AppMessage
        sessionRedirect={() => dispatch(logout())}
      />
      <LoadingOverlay />
      <Router />
    </Layout>
  );
};

export default App;
