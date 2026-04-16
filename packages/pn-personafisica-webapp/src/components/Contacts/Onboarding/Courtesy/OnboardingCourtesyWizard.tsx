import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';

import {
  ContactState,
  ContactValue,
  EmailContactState,
  IoContactState,
  WizardMode,
} from '../../../../models/DigitalDomicileOnboarding';
import { IOAllowedValues } from '../../../../models/contacts';
import { NOTIFICHE } from '../../../../navigation/routes.const';
import { contactsSelectors } from '../../../../redux/contact/reducers';
import { useAppSelector } from '../../../../redux/hooks';
import { normalizeContactValue } from '../../../../utility/contacts.utility';
import IoStep from '../IoStep';
import EmailSmsStep from './EmailSmsStep';

type WizardState = {
  mode: WizardMode | null;
  email: EmailContactState;
  io: IoContactState;
  sms: ContactState<string | undefined>;
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

const buildInitialWizardState = (
  snapshot: InitialContactsSnapshot,
  mode: WizardMode | null
): WizardState => ({
  mode,
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

  const [activeStep, setActiveStep] = useState(0);
  const [wizardState, setWizardState] = useState<WizardState>(() =>
    buildInitialWizardState(initialContactsRef.current, null)
  );

  const isIoEnabled = wizardState.io.value === IOAllowedValues.ENABLED;

  const goToNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const goToNotifications = () => {
    navigate(NOTIFICHE);
  };

  const updateContactValue = <K extends keyof Pick<WizardState, 'email' | 'sms' | 'io'>>(
    key: K,
    value: WizardState[K]['value']
  ) => {
    setWizardState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  return (
    <PnWizard
      title={
        <Typography fontSize="28px" fontWeight={700}>
          {t('onboarding.courtesy.title')}
        </Typography>
      }
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      slotsProps={{
        exitButton: {
          onClick: goToNotifications,
        },
        nextButton: {
          variant: activeStep === 0 && !isIoEnabled ? 'outlined' : 'contained',
          label:
            activeStep === 0 && !isIoEnabled
              ? t('onboarding.courtesy.proceed-without-io')
              : undefined,
          sx: activeStep === 0 && isIoEnabled ? { display: 'none' } : { ml: { md: 'auto' } },
        },
      }}
    >
      <PnWizardStep label={t('onboarding.courtesy.step-1-label')}>
        <IoStep
          value={defaultAPPIOAddress?.value as IOAllowedValues | undefined}
          onChange={(value) => updateContactValue('io', value)}
          onContinue={goToNextStep}
        />
      </PnWizardStep>
      <PnWizardStep label={t('onboarding.courtesy.step-2-label')}>
        <EmailSmsStep
          ioEnabled={isIoEnabled}
          email={wizardState.email}
          sms={wizardState.sms}
          onContactAdded={(key, value) => updateContactValue(key, value)}
        />
      </PnWizardStep>
    </PnWizard>
  );
};

export default OnboardingCourtesyWizard;
