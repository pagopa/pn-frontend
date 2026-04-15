import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Typography } from '@mui/material';
import {
  ConsentActionType,
  ConsentType,
  IllusHourglass,
  PnWizard,
  PnWizardStep,
  SERCQ_SEND_VALUE,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import {
  ContactState,
  ContactValue,
  EmailContactState,
  IoContactState,
  PecContactState,
  WizardMode,
} from '../../../models/DigitalDomicileOnboarding';
import {
  AddressType,
  ChannelType,
  IOAllowedValues,
  SaveDigitalAddressParams,
} from '../../../models/contacts';
import { NOTIFICHE } from '../../../navigation/routes.const';
import {
  acceptSercqSendTos,
  createOrUpdateAddress,
  getSercqSendTosApproval,
} from '../../../redux/contact/actions';
import { contactsSelectors } from '../../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { normalizeContactValue } from '../../../utility/contacts.utility';
import ChooseDigitalDomicileStep from './ChooseDigitalDomicileStep';
import EmailStep from './EmailStep';
import IoStep from './IoStep';
import PecStep from './PecStep';
import SummaryStep from './SummaryStep';

type WizardState = {
  mode: WizardMode | null;
  email: EmailContactState;
  pec: PecContactState;
  io: IoContactState;
  showOptionalEmail: boolean;
  sendDisclaimerAccepted: boolean;
};

type InitialContactsSnapshot = {
  email: string | undefined;
  pec: string | undefined;
  io: IOAllowedValues | undefined;
};

const STEPS_COUNT = 4;

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
  pec: buildContactState(snapshot.pec),
  io: buildContactState(snapshot.io),
  showOptionalEmail: mode === 'send' || Boolean(snapshot.email),
  sendDisclaimerAccepted: false,
});

const DigitalDomicileWizard: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { defaultEMAILAddress, defaultPECAddress, defaultAPPIOAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const initialContactsRef = useRef<InitialContactsSnapshot>({
    email: normalizeContactValue(defaultEMAILAddress?.value),
    pec: normalizeContactValue(defaultPECAddress?.value),
    io: defaultAPPIOAddress?.value as IOAllowedValues | undefined,
  });

  const pecContinueHandlerRef = useRef<(() => Promise<boolean>) | null>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [wizardState, setWizardState] = useState<WizardState>(() =>
    buildInitialWizardState(initialContactsRef.current, null)
  );

  const isChoiceStep = activeStep === 0;
  const isContactStep = activeStep === 1;
  const isIoStep = activeStep === 2;
  const isSummaryStep = activeStep === 3;

  const isSendMode = wizardState.mode === 'send';
  const isPecMode = wizardState.mode === 'pec';
  const isIoEnabled = wizardState.io.value === IOAllowedValues.ENABLED;
  const isSendEmailAlreadyPresent =
    isSendMode && wizardState.email.alreadySet && Boolean(wizardState.email.value);

  const showNextButton =
    !isChoiceStep &&
    !(isIoStep && isIoEnabled) &&
    !(isContactStep && isSendMode && !isSendEmailAlreadyPresent);

  const goToNextStep = () => {
    setActiveStep((step) => Math.min(step + 1, STEPS_COUNT));
  };

  const goToPreviousStep = () => {
    setActiveStep((step) => Math.max(step - 1, 0));
  };
  const goToNotifications = () => {
    navigate(NOTIFICHE);
  };

  const selectMode = (mode: WizardMode) => {
    setWizardState((prev) => ({
      ...prev,
      mode,
      showOptionalEmail: mode === 'send' || Boolean(prev.email.value),
    }));
    setActiveStep(1);
  };

  const setEmailValue = (value?: string) => {
    setWizardState((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        value: normalizeContactValue(value),
      },
    }));
  };

  const setPecValue = (value?: string) => {
    setWizardState((prev) => ({
      ...prev,
      pec: {
        ...prev.pec,
        value: normalizeContactValue(value),
      },
    }));
  };

  const setIoValue = (value: IOAllowedValues | undefined) => {
    setWizardState((prev) => ({
      ...prev,
      io: {
        ...prev.io,
        value,
      },
    }));
  };

  const setShowOptionalEmail = (show: boolean) => {
    setWizardState((prev) => ({
      ...prev,
      showOptionalEmail: show,
    }));
  };

  const setSendDisclaimerAccepted = (accepted: boolean) => {
    setWizardState((prev) => ({
      ...prev,
      sendDisclaimerAccepted: accepted,
    }));
  };

  const canContinueFromSummaryStep = () => {
    if (!isSummaryStep || !wizardState.mode) {
      return false;
    }
    if (isSendMode) {
      return wizardState.sendDisclaimerAccepted;
    }

    return true;
  };

  const disableNextButton = isSummaryStep && !canContinueFromSummaryStep();

  const getNextButtonLabel = () => {
    if (isContactStep) {
      return t('button.continue', { ns: 'common' });
    }
    if (isIoStep) {
      return t('onboarding.digital-domicile.buttons.continue-without-io');
    }
    if (isSummaryStep) {
      return t('onboarding.digital-domicile.buttons.confirm-activation');
    }

    return t('button.continue', { ns: 'common' });
  };

  const handlePrevious = () => {
    if (isChoiceStep) {
      return;
    }

    goToPreviousStep();
  };

  const ensureSercqSendTosAccepted = async () => {
    const consents = await dispatch(getSercqSendTosApproval()).unwrap();

    const sercqTos = consents.find((consent) => consent.consentType === ConsentType.TOS_SERCQ);

    if (!sercqTos || sercqTos.accepted) {
      return;
    }

    await dispatch(
      acceptSercqSendTos([
        {
          action: ConsentActionType.ACCEPT,
          version: sercqTos.consentVersion,
          type: ConsentType.TOS_SERCQ,
        },
      ])
    ).unwrap();
  };

  const activateSendDigitalDomicile = async () => {
    await ensureSercqSendTosAccepted();

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId: 'default',
      channelType: ChannelType.SERCQ_SEND,
      value: SERCQ_SEND_VALUE,
    };

    await dispatch(createOrUpdateAddress(digitalAddressParams)).unwrap();

    // TODO: update this call to newer method once available (NotificationCostBanner)
    sessionStorage.removeItem('digitalBannerClosed');
  };

  const handleSummarySubmit = async () => {
    if (isSendMode) {
      await activateSendDigitalDomicile();
    }

    goToNextStep();
  };

  const handleNext = async () => {
    if (isContactStep) {
      if (isPecMode) {
        const canProceed = await pecContinueHandlerRef.current?.();

        if (canProceed !== true) {
          return;
        }
      }

      if (isSendMode && !isSendEmailAlreadyPresent) {
        return;
      }

      goToNextStep();
      return;
    }

    if (isIoStep) {
      goToNextStep();
      return;
    }

    if (isSummaryStep) {
      if (!canContinueFromSummaryStep()) {
        return;
      }

      await handleSummarySubmit();
    }
  };

  const getPreviousButton = () => {
    if (isChoiceStep) {
      return <></>;
    }

    return (
      <ButtonNaked
        onClick={handlePrevious}
        color="primary"
        size="medium"
        data-testid="prev-button"
        sx={{ mt: { xs: 2, md: 0 } }}
      >
        {t('button.indietro', { ns: 'common' })}
      </ButtonNaked>
    );
  };

  const getNextButton = () => {
    if (!showNextButton) {
      return <></>;
    }

    return (
      <Button
        variant={isIoStep && !isIoEnabled ? 'outlined' : 'contained'}
        onClick={() => void handleNext()}
        color="primary"
        size="medium"
        disabled={disableNextButton}
        sx={{ width: { xs: '100%', md: 'auto' }, ml: { md: 'auto' } }}
        data-testid="next-button"
      >
        {getNextButtonLabel()}
      </Button>
    );
  };

  const feedbackTitle = isPecMode
    ? t('onboarding.digital-domicile.feedback.pec.title')
    : t('onboarding.digital-domicile.feedback.send.title');

  const feedbackContent = isPecMode
    ? t('onboarding.digital-domicile.feedback.pec.content')
    : t('onboarding.digital-domicile.feedback.send.content');

  const contactStepLabel = isPecMode
    ? t('onboarding.digital-domicile.steps.pec')
    : t('onboarding.digital-domicile.steps.email');

  return (
    <PnWizard
      title={
        <Typography fontSize="28px" fontWeight={700}>
          {t('onboarding.digital-domicile.title')}
        </Typography>
      }
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      slots={{
        prevButton: getPreviousButton,
        nextButton: getNextButton,
        feedbackIcon: isPecMode ? IllusHourglass : undefined, // TODO: change the icons
      }}
      slotsProps={{
        exitButton: {
          onClick: goToNotifications,
        },
        actions: isChoiceStep
          ? { sx: { display: 'none' } }
          : { justifyContent: showNextButton ? 'space-between' : 'center' },
        feedback: {
          title: feedbackTitle,
          content: feedbackContent,
          buttonText: t('button.understand', { ns: 'common' }),
          onClick: goToNotifications,
        },
      }}
    >
      <PnWizardStep label={t('onboarding.digital-domicile.steps.choice')}>
        <ChooseDigitalDomicileStep
          onSelectSend={() => selectMode('send')}
          onSelectPec={() => selectMode('pec')}
        />
      </PnWizardStep>
      <PnWizardStep label={contactStepLabel}>
        {isSendMode ? (
          <EmailStep
            value={wizardState.email.value}
            alreadySet={wizardState.email.alreadySet}
            onChange={setEmailValue}
          />
        ) : (
          <PecStep
            pec={wizardState.pec}
            email={wizardState.email}
            showOptionalEmail={wizardState.showOptionalEmail}
            onPecChange={setPecValue}
            onEmailChange={setEmailValue}
            onShowOptionalEmail={setShowOptionalEmail}
            registerContinueHandler={(handler) => {
              // eslint-disable-next-line functional/immutable-data
              pecContinueHandlerRef.current = handler;
            }}
          />
        )}
      </PnWizardStep>
      <PnWizardStep label={t('onboarding.digital-domicile.steps.io')}>
        <IoStep value={wizardState.io.value} onChange={setIoValue} onContinue={goToNextStep} />
      </PnWizardStep>
      <PnWizardStep label={t('onboarding.digital-domicile.steps.summary')}>
        {wizardState.mode ? (
          <SummaryStep
            mode={wizardState.mode}
            email={wizardState.email.value}
            pec={wizardState.pec.value}
            io={wizardState.io.value}
            disclaimerAccepted={wizardState.sendDisclaimerAccepted}
            onDisclaimerChange={setSendDisclaimerAccepted}
          />
        ) : null}
      </PnWizardStep>
    </PnWizard>
  );
};

export default DigitalDomicileWizard;
