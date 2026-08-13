/* eslint-disable functional/immutable-data */
import { useTranslation } from 'react-i18next';

import { People, SupervisedUserCircle } from '@mui/icons-material';
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import MarkunreadMailboxRoundedIcon from '@mui/icons-material/MarkunreadMailboxRounded';
import SettingsEthernetRounded from '@mui/icons-material/SettingsEthernetRounded';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../models/PGEventsType';
import * as routes from '../navigation/routes.const';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PGEventStrategyFactory from '../utility/MixpanelUtils/PGEventStrategyFactory';

export const useMenuItems = (userHasAdminPermissions: boolean) => {
  const { IS_B2B_ENABLED } = getConfiguration();
  const { t, i18n } = useTranslation('common');
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const pendingDelegators = useAppSelector(
    (state: RootState) => state.generalInfoState.pendingDelegators
  );
  const hasNewNotifications = useAppSelector(
    (state: RootState) => state.generalInfoState.hasNewNotifications
  );
  const organization = loggedUser.organization;

  const notificationMenuItems: Array<SideMenuItem> | undefined = !loggedUser.hasGroup
    ? [
        {
          label: t('menu.notifiche-impresa', { organization: organization?.name }),
          route: routes.NOTIFICHE,
          dotNotification: hasNewNotifications,
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
      icon: MailOutlineRoundedIcon,
      route: !loggedUser.hasGroup ? routes.NOTIFICHE : routes.NOTIFICHE_DELEGATO,
      children: notificationMenuItems,
      notSelectable: notificationMenuItems && notificationMenuItems.length > 0,
    },
    {
      label: t('menu.app-status'),
      icon: () =>
        currentStatus ? (
          currentStatus.appIsFullyOperative ? (
            <CheckCircleRoundedIcon sx={{ color: 'success.main' }} />
          ) : (
            <ErrorRoundedIcon sx={{ color: 'error.main' }} />
          )
        ) : (
          <HelpRoundedIcon />
        ),
      route: routes.APP_STATUS,
    },
  ];

  if (userHasAdminPermissions) {
    menuItems.splice(1, 0, {
      label: t('menu.deleghe'),
      icon: () => <AltRouteRoundedIcon />,
      route: routes.DELEGHE,
      rightBadgeNotification: pendingDelegators ? pendingDelegators : undefined,
    });
  }

  if (userHasAdminPermissions && !loggedUser.hasGroup) {
    menuItems.splice(2, 0, {
      label: t('menu.contacts'),
      icon: MarkunreadMailboxRoundedIcon,
      route: routes.RECAPITI,
    });
  }

  if (IS_B2B_ENABLED) {
    menuItems.splice(3, 0, {
      label: t('menu.integrazione-api'),
      icon: SettingsEthernetRounded,
      route: routes.INTEGRAZIONE_API,
    });
  }

  const selfCareMenuItems: Array<SideMenuItem> = [
    {
      label: t('menu.users'),
      icon: People,
      route: routes.USERS(organization?.id, i18n.language),
      action: () => PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_OPEN_USERS),
    },
    {
      label: t('menu.groups'),
      icon: SupervisedUserCircle,
      route: routes.GROUPS(organization?.id, i18n.language),
      action: () => PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_OPEN_GROUPS),
    },
  ];
  return { menuItems, selfCareMenuItems };
};
