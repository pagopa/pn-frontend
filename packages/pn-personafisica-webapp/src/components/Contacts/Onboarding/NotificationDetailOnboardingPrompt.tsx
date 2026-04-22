import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Typography } from '@mui/material';
import { ConfirmationModal, getPaymentCache } from '@pagopa-pn/pn-commons';
import { IllusMIMessage } from '@pagopa/mui-italia';

import { useNotificationExitPrompt } from '../../../hooks/useNotificationExitPrompt';
import { OnboardingSource } from '../../../models/Onboarding';
import * as routes from '../../../navigation/routes.const';
import { contactsSelectors } from '../../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setOnboardingExitReminderShown } from '../../../redux/sidemenu/reducers';
import { RootState } from '../../../redux/store';
import { getConfiguration } from '../../../services/configuration.service';
import { hasRequiredContacts } from '../../../utility/contacts.utility';

type Props = {
  iun?: string;
  mandateId?: string;
  route: string;
  children: React.ReactNode;
};

const NotificationDetailOnboardingPrompt: React.FC<Props> = ({
  iun,
  mandateId,
  route,
  children,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('recapiti');
  const { IS_ONBOARDING_ENABLED } = getConfiguration();

  const addresses = useAppSelector(contactsSelectors.selectAddresses);

  const onboardingShown = useAppSelector(
    (state: RootState) => state.generalInfoState.onboardingData.hasBeenShown
  );
  const onboardingSkipped = useAppSelector(
    (state: RootState) => state.generalInfoState.onboardingData.hasSkippedOnboarding
  );
  const onboardingExitReminderShown = useAppSelector(
    (state: RootState) => state.generalInfoState.onboardingData.exitReminderShown
  );

  const userHasRequiredContacts = useMemo(() => hasRequiredContacts(addresses), [addresses]);

  const canShowOnboardingExitReminder =
    IS_ONBOARDING_ENABLED &&
    !mandateId &&
    !onboardingShown &&
    !onboardingSkipped &&
    !onboardingExitReminderShown &&
    !userHasRequiredContacts;

  const [isNotificationExitBlocked, confirmNotificationExit, cancelNotificationExit] =
    useNotificationExitPrompt({
      when: canShowOnboardingExitReminder,
      route,
    });

  const [showOnboardingExitReminder, setShowOnboardingExitReminder] = useState(false);

  const openOnboardingExitReminder = useCallback(() => {
    setShowOnboardingExitReminder(true);
    dispatch(setOnboardingExitReminderShown(true));
  }, [dispatch]);

  const closeOnboardingExitReminder = useCallback(
    (_event?: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
      if (reason === 'backdropClick') {
        return;
      }

      setShowOnboardingExitReminder(false);

      if (isNotificationExitBlocked) {
        confirmNotificationExit();
        return;
      }

      cancelNotificationExit();
    },
    [isNotificationExitBlocked, confirmNotificationExit, cancelNotificationExit]
  );

  const goToOnboarding = useCallback(() => {
    setShowOnboardingExitReminder(false);
    cancelNotificationExit();
    navigate(routes.ONBOARDING, { state: { source: OnboardingSource.NOTIFICATION_DETAIL } });
  }, [navigate, cancelNotificationExit]);

  const isReturningFromPayment = useMemo(
    () => Boolean(iun && getPaymentCache(iun)?.currentPayment),
    [iun]
  );

  useEffect(() => {
    if (isNotificationExitBlocked) {
      openOnboardingExitReminder();
    }
  }, [isNotificationExitBlocked, openOnboardingExitReminder]);

  useEffect(() => {
    if (isReturningFromPayment && canShowOnboardingExitReminder) {
      openOnboardingExitReminder();
    }
  }, [isReturningFromPayment, canShowOnboardingExitReminder, openOnboardingExitReminder]);

  return (
    <>
      {children}
      <ConfirmationModal
        open={showOnboardingExitReminder}
        title={t('onboarding.notification-exit-dialog.title', { ns: 'recapiti' })}
        contentAlign="center"
        slots={{
          illustration: <IllusMIMessage />,
          closeButton: Button,
        }}
        slotsProps={{
          confirmButton: {
            onClick: goToOnboarding,
            children: t('onboarding.notification-exit-dialog.buttons.configure', {
              ns: 'recapiti',
            }),
          },
          closeButton: {
            onClick: closeOnboardingExitReminder,
            children: t('onboarding.notification-exit-dialog.buttons.skip', { ns: 'recapiti' }),
          },
        }}
      >
        <Typography variant="body2">
          {t('onboarding.notification-exit-dialog.description', { ns: 'recapiti' })}
        </Typography>
      </ConfirmationModal>
    </>
  );
};

export default NotificationDetailOnboardingPrompt;
