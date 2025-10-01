/* eslint-disable functional/immutable-data */
import { useTranslation } from 'react-i18next';

import { People, SupervisedUserCircle } from '@mui/icons-material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import SettingsEthernet from '@mui/icons-material/SettingsEthernet';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';

export const useMenuItems = (userHasAdminPermissions: boolean) => {
  const { IS_B2B_ENABLED } = getConfiguration();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const loggedUser = useAppSelector((state: RootState) => {
    console.log(state);
    return state.userState.user;
  });
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const pendingDelegators = useAppSelector(
    (state: RootState) => state.generalInfoState.pendingDelegators
  );
  const organization = loggedUser.organization;

  const notificationMenuItems: Array<SideMenuItem> | undefined = !loggedUser.hasGroup
    ? [
        {
          label: t('menu.notifiche-impresa'),
          route: routes.NOTIFICHE,
        },
        {
          label: t('menu.notifiche-delegato'),
          route: routes.NOTIFICHE_DELEGATO,
        },
      ]
    : undefined;

  const menuItems: Array<SideMenuItem> = [
    {
      label: !loggedUser.hasGroup ? t('menu.notifiche') : t('menu.notifiche-delegato'),
      icon: MailOutlineIcon,
      route: !loggedUser.hasGroup ? routes.NOTIFICHE : routes.NOTIFICHE_DELEGATO,
      children: notificationMenuItems,
      notSelectable: notificationMenuItems && notificationMenuItems.length > 0,
    },
    {
      label: t('menu.app-status'),
      icon: () =>
        currentStatus ? (
          currentStatus.appIsFullyOperative ? (
            <CheckCircleIcon sx={{ color: 'success.main' }} />
          ) : (
            <ErrorIcon sx={{ color: 'error.main' }} />
          )
        ) : (
          <HelpIcon />
        ),
      route: routes.APP_STATUS,
    },
  ];

  if (userHasAdminPermissions) {
    menuItems.splice(1, 0, {
      label: t('menu.deleghe'),
      icon: () => <AltRouteIcon />,
      route: routes.DELEGHE,
      rightBadgeNotification: pendingDelegators ? pendingDelegators : undefined,
    });
  }

  if (userHasAdminPermissions && !loggedUser.hasGroup) {
    menuItems.splice(2, 0, {
      label: t('menu.contacts'),
      icon: MarkunreadMailboxIcon,
      route: routes.RECAPITI,
    });
  }

  if (IS_B2B_ENABLED) {
    menuItems.splice(3, 0, {
      label: t('menu.integrazione-api'),
      icon: SettingsEthernet,
      route: routes.INTEGRAZIONE_API,
    });
  }

  const selfCareMenuItems: Array<SideMenuItem> = [
    {
      label: t('menu.users'),
      icon: People,
      route: routes.USERS(organization?.id, i18n.language),
    },
    {
      label: t('menu.groups'),
      icon: SupervisedUserCircle,
      route: routes.GROUPS(organization?.id, i18n.language),
    },
  ];
  return { menuItems, selfCareMenuItems };
};
