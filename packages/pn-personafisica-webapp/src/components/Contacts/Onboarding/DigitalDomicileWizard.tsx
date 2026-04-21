import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Link, Typography } from '@mui/material';
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
} from '../../../models/Onboarding';
import {
  AddressType,
  ChannelType,
  IOAllowedValues,
  SaveDigitalAddressParams,
} from '../../../models/contacts';
import {
  NOTIFICHE,
  ONBOARDING,
  PRIVACY_POLICY,
  TERMS_OF_SERVICE_SERCQ_SEND,
} from '../../../navigation/routes.const';
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
};

type InitialContactsSnapshot = {
  email: string | undefined;
  pec: string | undefined;
  pecIsValid?: boolean;
  io: IOAllowedValues | undefined;
};

const STEPS_COUNT = 4;

const buildContactState = <T extends ContactValue>(value: T): ContactState<T> => ({
  value,
  alreadySet: value !== undefined,
});

const buildPecState = (value: string | undefined, isValid?: boolean): PecContactState => ({
  value,
  alreadySet: value !== undefined,
  isValid,
});

const buildInitialWizardState = (
  snapshot: InitialContactsSnapshot,
  mode: WizardMode | null
): WizardState => ({
  mode,
  email: buildContactState(snapshot.email),
  pec: buildPecState(snapshot.pec, snapshot.pecIsValid),
  io: buildContactState(snapshot.io),
  showOptionalEmail: mode === 'send' || Boolean(snapshot.email),
});

const hasPecActivationState = (pec?: string, pecIsValid?: boolean) =>
  Boolean(pec) || pecIsValid !== undefined;

const getInitialWizardSetup = (
  snapshot: InitialContactsSnapshot
): { initialMode: WizardMode | null; initialActiveStep: number } => {
  const shouldResumePecFlow = hasPecActivationState(snapshot.pec, snapshot.pecIsValid);

  return {
    initialMode: shouldResumePecFlow ? 'pec' : null,
    initialActiveStep: shouldResumePecFlow ? 1 : 0,
  };
};

const shouldShowNextButton = ({
  isChoiceStep,
  isPecActivating,
  isIoStep,
  isIoEnabled,
  isContactStep,
  isSendMode,
  hasSendEmailValue,
}: {
  isChoiceStep: boolean;
  isPecActivating: boolean;
  isIoStep: boolean;
  isIoEnabled: boolean;
  isContactStep: boolean;
  isSendMode: boolean;
  hasSendEmailValue: boolean;
}) =>
  (!isChoiceStep || isPecActivating) &&
  !(isIoStep && isIoEnabled) &&
  !(isContactStep && isSendMode && !hasSendEmailValue);

const getWizardActionsSlotProps = ({
  isChoiceStep,
  isPecActivating,
  showNextButton,
}: {
  isChoiceStep: boolean;
  isPecActivating: boolean;
  showNextButton: boolean;
}) =>
  isChoiceStep && !isPecActivating
    ? { sx: { display: 'none' } }
    : { justifyContent: showNextButton ? 'space-between' : 'center' };

const DigitalDomicileWizard: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { defaultEMAILAddress, defaultPECAddress, defaultAPPIOAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  useEffect(() => {
    const normalizedStorePecValue = normalizeContactValue(defaultPECAddress?.value);
    const storePecIsValid = defaultPECAddress?.pecValid;

    setWizardState((prev) => {
      const nextValue = normalizedStorePecValue ?? prev.pec.value;
      const nextIsValid = storePecIsValid;

      if (prev.pec.value === nextValue && prev.pec.isValid === nextIsValid) {
        return prev;
      }

      return {
        ...prev,
        pec: {
          ...prev.pec,
          value: nextValue,
          isValid: nextIsValid,
        },
      };
    });
  }, [defaultPECAddress?.value, defaultPECAddress?.pecValid]);

  const initialContactsRef = useRef<InitialContactsSnapshot>({
    email: normalizeContactValue(defaultEMAILAddress?.value),
    pec: normalizeContactValue(defaultPECAddress?.value),
    pecIsValid: defaultPECAddress?.pecValid,
    io: defaultAPPIOAddress?.value as IOAllowedValues | undefined,
  });

  const pecContinueHandlerRef = useRef<(() => Promise<boolean>) | null>(null);

  const { initialMode, initialActiveStep } = getInitialWizardSetup(initialContactsRef.current);

  const [activeStep, setActiveStep] = useState(initialActiveStep);
  const [wizardState, setWizardState] = useState<WizardState>(() =>
    buildInitialWizardState(initialContactsRef.current, initialMode)
  );

  const isChoiceStep = activeStep === 0;
  const isContactStep = activeStep === 1;
  const isIoStep = activeStep === 2;
  const isSummaryStep = activeStep === 3;

  const isPecActivating = Boolean(wizardState.pec.value) || wizardState.pec.isValid !== undefined;

  const isSendMode = wizardState.mode === 'send';
  const isPecMode = wizardState.mode === 'pec';
  const isIoEnabled = wizardState.io.value === IOAllowedValues.ENABLED;

  const hasSendEmailValue = isSendMode && Boolean(wizardState.email.value);

  const showNextButton = shouldShowNextButton({
    isChoiceStep,
    isPecActivating,
    isIoStep,
    isIoEnabled,
    isContactStep,
    isSendMode,
    hasSendEmailValue,
  });

  const showSummaryDisclaimer = isSummaryStep && isSendMode;

  const goToNextStep = () => {
    setActiveStep((step) => Math.min(step + 1, STEPS_COUNT));
  };

  const goToPreviousStep = () => {
    setActiveStep((step) => Math.max(step - 1, 0));
  };
  const goToNotifications = () => {
    navigate(NOTIFICHE);
  };
  const exit = () => {
    navigate(ONBOARDING);
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

  const setPecValue = (value?: string, isValid?: boolean) => {
    setWizardState((prev) => ({
      ...prev,
      pec: {
        ...prev.pec,
        value: normalizeContactValue(value),
        isValid,
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

  const canProceedFromContactStep = async () => {
    if (isPecMode) {
      const canProceed = await pecContinueHandlerRef.current?.();

      if (canProceed !== true) {
        return false;
      }
    }

    if (isSendMode && !hasSendEmailValue) {
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (isChoiceStep && isPecActivating) {
      goToNextStep();
      return;
    }

    if (isContactStep) {
      if (!(await canProceedFromContactStep())) {
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
        startIcon={<ArrowBackIcon />}
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
        sx={{ width: { xs: '100%', md: 'auto' }, ml: { md: 'auto' } }}
        data-testid="next-button"
      >
        {getNextButtonLabel()}
      </Button>
    );
  };

  const getSendDisclaimer = () => (
    <Typography mb={3} variant="body2" fontSize="14px" color="text.secondary">
      <Trans
        i18nKey="onboarding.digital-domicile.summary.disclaimer"
        ns="recapiti"
        components={[
          <Link
            key="privacy-policy"
            sx={{
              cursor: 'pointer',
              textDecoration: 'none !important',
              fontWeight: 'bold',
            }}
            data-testid="privacy-link"
            href={PRIVACY_POLICY}
            target="_blank"
            rel="noopener"
          />,

          <Link
            key="tos"
            sx={{
              cursor: 'pointer',
              textDecoration: 'none !important',
              fontWeight: 'bold',
            }}
            data-testid="tos-link"
            href={TERMS_OF_SERVICE_SERCQ_SEND}
            target="_blank"
            rel="noopener"
          />,
        ]}
      />
    </Typography>
  );

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
        <Typography fontSize="24px" fontWeight={700}>
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
          onClick: exit,
          sx: {
            color: '#0E0F13',
            '&:hover': {
              color: '#0E0F13',
            },
          },
        },
        actions: getWizardActionsSlotProps({
          isChoiceStep,
          isPecActivating,
          showNextButton,
        }),
        feedback: {
          title: feedbackTitle,
          content: feedbackContent,
          buttonText: t('button.understand', { ns: 'common' }),
          onClick: goToNotifications,
        },
        belowStepContent: showSummaryDisclaimer ? getSendDisclaimer() : undefined,
        ...(isChoiceStep || isIoStep
          ? {
              stepContainer: {
                sx: {
                  p: 0,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 24,
                  borderBottomLeftRadius: 24,
                  overflow: 'hidden',
                },
              },
            }
          : { stepContainer: { sx: { p: 2, borderRadius: 2 } } }),
      }}
    >
      <PnWizardStep label={t('onboarding.digital-domicile.steps.choice')}>
        <ChooseDigitalDomicileStep
          onSelectSend={() => selectMode('send')}
          onSelectPec={() => selectMode('pec')}
          isPecActivating={isPecActivating}
        />
      </PnWizardStep>
      <PnWizardStep label={contactStepLabel}>
        {isSendMode ? (
          <EmailStep
            value={wizardState.email.value}
            alreadySet={wizardState.email.alreadySet}
            onChange={setEmailValue}
            onVerified={() => {
              if (!wizardState.email.alreadySet) {
                goToNextStep();
              }
            }}
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
          />
        ) : null}
      </PnWizardStep>
    </PnWizard>
  );
};

export default DigitalDomicileWizard;
