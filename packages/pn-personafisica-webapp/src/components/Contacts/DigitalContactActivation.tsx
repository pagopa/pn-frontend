import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, DialogContentText, Typography } from '@mui/material';
import { ConfirmationModal, EventAction, PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import IOContactWizard from '../../components/Contacts/IOContactWizard';
import PecContactWizard from '../../components/Contacts/PecContactWizard';
import { PFEventsType } from '../../models/PFEventsType';
import { IOAllowedValues } from '../../models/contacts';
import { NOTIFICHE } from '../../navigation/routes.const';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import EmailSmsContactWizard from './EmailSmsContactWizard';
import HowItWorksContactWizard from './HowItWorksContactWizard';
import SercqSendContactWizard from './SercqSendContactWizard';

type Props = {
  isTransferring?: boolean;
  onGoBack?: () => void;
};

const MAX_STEPS_NUMBER = 4;

const DigitalContactActivation: React.FC<Props> = ({ isTransferring = false, onGoBack }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const { IS_DOD_ENABLED } = getConfiguration();
  const {
    addresses,
    defaultEMAILAddress,
    defaultAPPIOAddress,
    defaultSERCQ_SENDAddress,
    courtesyAddresses,
  } = useAppSelector(contactsSelectors.selectAddresses);

  const [activeStep, setActiveStep] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress || !IS_DOD_ENABLED);

  const showIOStep = useMemo(
    () => defaultAPPIOAddress && defaultAPPIOAddress.value === IOAllowedValues.DISABLED,
    []
  );

  const isEmailSmsStep = !showIOStep ? activeStep === 1 : activeStep === 2;
  const isRecapStep = activeStep === (showIOStep ? MAX_STEPS_NUMBER - 1 : MAX_STEPS_NUMBER - 2);

  const feedbackTitleLabel = `legal-contacts.sercq-send-wizard.feedback.title-sercq_send-${
    isTransferring ? 'transfer' : 'activation'
  }`;
  const feedbackContentLabel = 'legal-contacts.sercq-send-wizard.feedback.content-sercq_send';

  const handleConfirmEmailSmsStep = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_SMS_CONTINUE, {
      event_type: EventAction.ACTION,
      contacts: addresses,
    });
    if (defaultEMAILAddress) {
      goToNextStep();
    } else {
      setShowConfirmationModal(true);
    }
  };

  const handleCloseConfirmEmailSmsModal = () => {
    setShowConfirmationModal(false);
  };

  const goToNextStep = () => {
    setActiveStep((step) => step + 1);
  };

  const goToPreviousStep = () => {
    if (showIOStep && activeStep === 1) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_APP_IO_BACK);
    }
    if (isEmailSmsStep) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_SMS_BACK);
    }
    if (isRecapStep) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY_BACK);
    }
    setActiveStep((step) => step - 1);
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step <= MAX_STEPS_NUMBER) {
      return setActiveStep(step);
    }
    return goToNextStep();
  };

  const handleExit = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_CANCEL);

    return onGoBack ? onGoBack() : navigate(-1);
  };

  const handleCloseFeedbackStep = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_THANK_YOU_PAGE_CLOSE);
    navigate(NOTIFICHE);
  };

  const getPreviousButton = () => {
    if (activeStep === 0) {
      return (
        <ButtonNaked onClick={handleExit} color="primary" size="medium" sx={{ mx: 'auto' }}>
          {t('button.annulla', { ns: 'common' })}
        </ButtonNaked>
      );
    } else {
      return (
        <ButtonNaked
          onClick={goToPreviousStep}
          color="primary"
          size="medium"
          data-testid="prev-button"
          sx={isEmailSmsStep ? { mt: { xs: 2, md: 0 } } : { mt: 0 }}
        >
          {t('button.indietro', { ns: 'common' })}
        </ButtonNaked>
      );
    }
  };

  const getNextButton = () => {
    if (isEmailSmsStep) {
      return (
        <Button
          variant="contained"
          onClick={handleConfirmEmailSmsStep}
          color="primary"
          size="medium"
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          {t('button.continue', { ns: 'common' })}
        </Button>
      );
    }

    return <></>;
  };

  if (showPecWizard) {
    return (
      <PecContactWizard
        setShowPecWizard={setShowPecWizard}
        isTransferring={isTransferring}
        onGoBack={onGoBack}
      />
    );
  }
  return (
    <PnWizard
      title={
        <Typography fontSize="28px" fontWeight={700}>
          {t(`legal-contacts.sercq-send-wizard.title${isTransferring ? '-transfer' : ''}`)}
        </Typography>
      }
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      slots={{
        exitButton: () => <></>,
        prevButton: getPreviousButton,
        nextButton: getNextButton,
      }}
      slotsProps={{
        feedback: {
          title: t(feedbackTitleLabel),
          content: t(feedbackContentLabel),
          buttonText: t('button.understand', { ns: 'common' }),
          onClick: handleCloseFeedbackStep,
          onFeedbackShow: () =>
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_THANK_YOU_PAGE, {
              event_type: EventAction.SCREEN_VIEW,
              contacts: courtesyAddresses,
            }),
        },
        actions: !isEmailSmsStep ? { justifyContent: 'center' } : {},
      }}
    >
      <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_1.title')}>
        <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
      </PnWizardStep>
      {showIOStep && (
        <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_2.title')}>
          <IOContactWizard goToNextStep={goToNextStep} />
        </PnWizardStep>
      )}
      <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_3.step-title')}>
        <EmailSmsContactWizard />

        <ConfirmationModal
          open={showConfirmationModal}
          title={t('courtesy-contacts.confirmation-modal-title')}
          slotsProps={{
            confirmButton: {
              onClick: handleCloseConfirmEmailSmsModal,
              children: t('button.understand', { ns: 'common' }),
            },
          }}
        >
          <Trans
            ns="recapiti"
            i18nKey={`courtesy-contacts.confirmation-modal-email-content`}
            components={[
              <DialogContentText key="paragraph1" color="text.primary" />,
              <DialogContentText key="paragraph2" color="text.primary" mt={2} />,
            ]}
          />
        </ConfirmationModal>
      </PnWizardStep>
      <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_4.step-title')}>
        <SercqSendContactWizard showIOStep={showIOStep} goToStep={goToStep} />
      </PnWizardStep>
    </PnWizard>
  );
};

export default DigitalContactActivation;
