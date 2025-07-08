import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import PecContactWizard from '../../components/Contacts/PecContactWizard';
import { RECAPITI } from '../../navigation/routes.const';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import EmailSmsContactWizard from './EmailSmsContactWizard';
import HowItWorksContactWizard from './HowItWorksContactWizard';
import SercqSendContactWizard from './SercqSendContactWizard';

type Props = {
  isTransferring?: boolean;
  onGoBack?: () => void;
};

const MAX_STEPS_NUMBER = 3;

const DigitalContactActivation: React.FC<Props> = ({ isTransferring = false, onGoBack }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const { IS_DOD_ENABLED } = getConfiguration();
  const { defaultSERCQ_SENDAddress } = useAppSelector(contactsSelectors.selectAddresses);

  const [activeStep, setActiveStep] = useState(0);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress || !IS_DOD_ENABLED);

  // const hasEmailOrSms = !!(defaultEMAILAddress || defaultSMSAddress);

  const isEmailSmsStep = activeStep === 1;

  const goToNextStep = () => {
    setActiveStep((step) => step + 1);
  };

  const goToPreviousStep = () => {
    setActiveStep((step) => step - 1);
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step <= MAX_STEPS_NUMBER) {
      return setActiveStep(step);
    }
    return goToNextStep();
  };

  const getPreviousButton = () => {
    if (activeStep === 0) {
      return (
        <ButtonNaked
          onClick={onGoBack ? () => onGoBack() : () => navigate(-1)}
          color="primary"
          size="medium"
          sx={{ mx: 'auto' }}
        >
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
          onClick={goToNextStep}
          color="primary"
          size="medium"
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          {t('button.conferma', { ns: 'common' })}
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
          title: t(
            `legal-contacts.sercq-send-wizard.feedback.title-${
              isTransferring ? 'transfer' : 'activation'
            }`
          ),
          buttonText: t('legal-contacts.sercq-send-wizard.feedback.go-to-contacts'),
          onClick: () => navigate(RECAPITI),
        },
        actions: !isEmailSmsStep ? { justifyContent: 'center' } : {},
      }}
    >
      <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_1.title')}>
        <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
      </PnWizardStep>
      <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_2.step-title')}>
        <EmailSmsContactWizard />
      </PnWizardStep>
      <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_3.step-title')}>
        <SercqSendContactWizard goToStep={goToStep} />
      </PnWizardStep>
    </PnWizard>
  );
};

export default DigitalContactActivation;
