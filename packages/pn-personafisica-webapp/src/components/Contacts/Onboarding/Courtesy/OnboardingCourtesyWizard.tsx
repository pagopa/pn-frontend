import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';
import { EventAction, PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { IllusMICompleted } from '@pagopa/mui-italia';

import {
  ContactState,
  ContactValue,
  EmailContactState,
  IoContactState,
  OnboardingAvailableFlows,
  OnboardingScreen,
  SmsContactState,
} from '../../../../models/Onboarding';
import { PFEventsType } from '../../../../models/PFEventsType';
import { IOAllowedValues } from '../../../../models/contacts';
import { NOTIFICHE, ONBOARDING } from '../../../../navigation/routes.const';
import { contactsSelectors } from '../../../../redux/contact/reducers';
import { useAppSelector } from '../../../../redux/hooks';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { normalizeContactValue } from '../../../../utility/contacts.utility';
import IoStep from '../IoStep';
import EmailSmsStep from './EmailSmsStep';

type CourtesyWizardState = {
  email: EmailContactState;
  io: IoContactState;
  sms: SmsContactState;
};

type InitialContactsSnapshot = {
  email: string | undefined;
  io: IOAllowedValues | undefined;
  sms: string | undefined;
};

const buildContactState = <T extends ContactValue>(value: T): ContactState<T> => ({
  value,
  alreadySet: value !== undefined,
});

const buildInitialWizardState = (snapshot: InitialContactsSnapshot): CourtesyWizardState => ({
  email: buildContactState(snapshot.email),
  io: buildContactState(snapshot.io),
  sms: buildContactState(snapshot.sms),
});

const OnboardingCourtesyWizard: React.FC = () => {
  const { t } = useTranslation('recapiti');
  const navigate = useNavigate();
  const { defaultEMAILAddress, defaultSMSAddress, defaultAPPIOAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const initialContactsRef = useRef<InitialContactsSnapshot>({
    email: normalizeContactValue(defaultEMAILAddress?.value),
    sms: normalizeContactValue(defaultSMSAddress?.value),
    io: defaultAPPIOAddress?.value as IOAllowedValues | undefined,
  });

  const emailSmsContinueHandlerRef = useRef<(() => Promise<boolean>) | null>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [wizardState, setWizardState] = useState<CourtesyWizardState>(() =>
    buildInitialWizardState(initialContactsRef.current)
  );

  const isIoEnabled = wizardState.io.value === IOAllowedValues.ENABLED;
  const isIoStep = activeStep === 0;

  const goToNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const goToNotifications = () => {
    navigate(NOTIFICHE);
  };

  const goToOnboarding = () => {
    trackCourtesy(PFEventsType.SEND_ONBOARDING_EXIT_SELECTED, {
      screen: getCurrentScreen(),
    });

    navigate(ONBOARDING);
  };

  const handleClickNextButton = async (step: number) => {
    trackContinueSelected();

    if (isIoStep && !isIoEnabled) {
      trackCourtesy(PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD_DECLINED);
    }
    if (step === 1) {
      const canProceed = await emailSmsContinueHandlerRef.current?.();
      if (canProceed !== true) {
        return;
      }
    }

    goToNextStep();
  };

  const updateContactValue = <K extends keyof Pick<CourtesyWizardState, 'email' | 'sms' | 'io'>>(
    key: K,
    value: CourtesyWizardState[K]['value']
  ) => {
    setWizardState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  // START Mixpanel
  const trackCourtesy = useCallback(
    (event: PFEventsType, extra?: Record<string, unknown>) =>
      PFEventStrategyFactory.triggerEvent(event, {
        onboarding_selected_flow: OnboardingAvailableFlows.COURTESY,
        ...extra,
      }),
    []
  );

  const getCurrentScreen = (): OnboardingScreen =>
    isIoStep ? OnboardingScreen.IO : OnboardingScreen.EMAIL_SMS;

  const trackBackSelected = () => {
    trackCourtesy(PFEventsType.SEND_ONBOARDING_BACK_SELECTED, {
      screen: getCurrentScreen(),
    });
  };

  const trackContinueSelected = () => {
    trackCourtesy(PFEventsType.SEND_ONBOARDING_CONTINUE_SELECTED, {
      screen: getCurrentScreen(),
    });
  };

  const handlePrevious = () => {
    trackBackSelected();
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (activeStep !== 2) {
      return;
    }

    trackCourtesy(PFEventsType.SEND_ONBOARDING_UX_SUCCESS, {
      event_type: EventAction.SCREEN_VIEW,
    });
  }, [activeStep, trackCourtesy]);
  // END Mixpanel

  return (
    <PnWizard
      title={
        <Typography fontSize="28px" fontWeight={700}>
          {t('onboarding.courtesy.title')}
        </Typography>
      }
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      slots={{
        feedbackIcon: IllusMICompleted,
      }}
      slotsProps={{
        exitButton: {
          onClick: goToOnboarding,
        },
        feedback: {
          title: t('onboarding.courtesy.success-title'),
          content: t('onboarding.courtesy.success-description'),
          buttonText: t('button.understand', { ns: 'common' }),
          onClick: goToNotifications,
        },
        nextButton: {
          variant: isIoStep && !isIoEnabled ? 'outlined' : 'contained',
          label: isIoStep && !isIoEnabled ? t('onboarding.courtesy.proceed-without-io') : undefined,
          sx: isIoStep && isIoEnabled ? { display: 'none' } : { ml: { md: 'auto' } },
          onClick: async (_, step) => await handleClickNextButton(step),
        },
        prevButton: {
          sx: isIoStep ? { display: 'none' } : undefined,
          onClick: handlePrevious,
        },
        stepContainer: {
          sx: {
            width: { xs: '100%', md: '760px' },
            borderRadius: 2,
            overflow: isIoStep ? 'hidden' : 'visible',
            p: isIoStep ? 0 : { xs: 2, md: 3 },
          },
        },
      }}
    >
      <PnWizardStep label={t('onboarding.courtesy.step-1-label')}>
        <IoStep
          value={defaultAPPIOAddress?.value as IOAllowedValues | undefined}
          onChange={(value) => updateContactValue('io', value)}
          onContinue={goToNextStep}
          selectedOnboardingFlow={OnboardingAvailableFlows.COURTESY}
        />
      </PnWizardStep>
      <PnWizardStep label={t('onboarding.courtesy.step-2-label')}>
        <EmailSmsStep
          ioEnabled={isIoEnabled}
          email={wizardState.email}
          sms={wizardState.sms}
          onContactAdded={(key, value) => updateContactValue(key, value)}
          registerContinueHandler={(handler) => {
            // eslint-disable-next-line functional/immutable-data
            emailSmsContinueHandlerRef.current = handler;
          }}
        />
      </PnWizardStep>
    </PnWizard>
  );
};

export default OnboardingCourtesyWizard;
