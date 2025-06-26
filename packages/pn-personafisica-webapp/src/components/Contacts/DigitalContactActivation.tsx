import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, DialogContentText, Typography } from '@mui/material';
import { ConfirmationModal, PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import IOContactWizard from '../../components/Contacts/IOContactWizard';
import PecContactWizard from '../../components/Contacts/PecContactWizard';
import { IOAllowedValues } from '../../models/contacts';
import { RECAPITI } from '../../navigation/routes.const';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import EmailSmsContactWizard from './EmailSmsContactWizard';
import HowItWorksContactWizard from './HowItWorksContactWizard';

type Props = {
  isTransferring?: boolean;
  onGoBack?: () => void;
};

enum ActiveStep {
  IO = 'IO',
  EMAIL = 'EMAIL',
}

type ModalType = {
  open: boolean;
  step?: ActiveStep;
  exit?: boolean;
};

const DigitalContactActivation: React.FC<Props> = ({ isTransferring = false, onGoBack }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const { IS_DOD_ENABLED } = getConfiguration();
  const { defaultAPPIOAddress, defaultSMSAddress, defaultEMAILAddress, defaultSERCQ_SENDAddress } =
    useAppSelector(contactsSelectors.selectAddresses);

  const [modal, setModal] = useState<ModalType>({ open: false });
  const [activeStep, setActiveStep] = useState(0);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress || !IS_DOD_ENABLED);

  const showIOStep = useMemo(
    () => defaultAPPIOAddress && defaultAPPIOAddress.value === IOAllowedValues.DISABLED,
    []
  );
  const showEmailStep = useMemo(() => !(defaultSMSAddress || defaultEMAILAddress), []);

  const hasEmailOrSms = defaultEMAILAddress || defaultSMSAddress;

  const isEmailSmsStep = (activeStep === 1 && !showIOStep) || activeStep === 2;

  const hasCourtesyContact =
    defaultAPPIOAddress?.value === IOAllowedValues.ENABLED || hasEmailOrSms;

  const goToNextStep = () => {
    setActiveStep((step) => step + 1);
  };

  const goToEnd = () => {
    setActiveStep(3); // set the current step greater than the number of steps to go to the thankyou page
  };

  const handleConfirmationModalAccept = () => {
    setModal({ open: false });
  };

  const handleConfirmationModalDecline = () => {
    if (modal.exit) {
      goToEnd();
    } else {
      goToNextStep();
    }
    setModal({ open: false });
  };

  const handleSkipOrExitClick = (exit?: boolean) => {
    if (activeStep === 0) {
      navigate(-1);
    } else if (hasCourtesyContact) {
      goToEnd();
    } else {
      showConfirmationModal(exit);
    }
  };

  const showConfirmationModal = (exit?: boolean) => {
    const step = activeStep === 1 && showIOStep ? ActiveStep.IO : ActiveStep.EMAIL;
    setModal({ open: true, step, exit });
  };

  const getNextButton = () => {
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
    }
    if (isEmailSmsStep && hasEmailOrSms) {
      return (
        <Button variant="contained" onClick={goToNextStep} color="primary" size="medium">
          {t('button.conferma', { ns: 'common' })}
        </Button>
      );
    }

    if (activeStep > 0 && (showIOStep || showEmailStep)) {
      return (
        <ButtonNaked
          onClick={() => handleSkipOrExitClick()}
          color="primary"
          size="medium"
          sx={{ mx: 'auto' }}
        >
          {t('button.not-now', { ns: 'common' })}
        </ButtonNaked>
      );
    }

    return null;
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
    <>
      <PnWizard
        title={
          <Typography fontSize="28px" fontWeight={700}>
            {t(`legal-contacts.sercq-send-wizard.title${isTransferring ? '-transfer' : ''}`)}
          </Typography>
        }
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        onExit={() => handleSkipOrExitClick(true)}
        slots={{
          nextButton: getNextButton,
          prevButton: () => <></>,
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
          actions: isEmailSmsStep && hasEmailOrSms ? { justifyContent: 'flex-end' } : {},
        }}
      >
        <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_1.title')}>
          <HowItWorksContactWizard
            goToNextStep={goToNextStep}
            setShowPecWizard={setShowPecWizard}
          />
        </PnWizardStep>
        {showIOStep && (
          <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_2.title')}>
            <IOContactWizard goToNextStep={goToNextStep} />
          </PnWizardStep>
        )}
        {showEmailStep && (
          <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_3.step-title')}>
            <EmailSmsContactWizard />
          </PnWizardStep>
        )}
      </PnWizard>
      {modal.step && (
        <ConfirmationModal
          open={modal.open}
          title={t('courtesy-contacts.confirmation-modal-title')}
          slots={{
            confirmButton: Button,
            closeButton: Button,
          }}
          slotsProps={{
            closeButton: {
              onClick: handleConfirmationModalAccept,
              children: t(
                `courtesy-contacts.confirmation-modal-${modal.step.toLowerCase()}-accept`
              ),
            },
            confirmButton: {
              onClick: handleConfirmationModalDecline,
              children: t('button.do-later', { ns: 'common' }),
            },
          }}
        >
          <Trans
            ns="recapiti"
            i18nKey={`courtesy-contacts.confirmation-modal-${modal.step.toLowerCase()}-content`}
            components={[
              <DialogContentText key="paragraph1" id="dialog-description" color="text.primary" />,
              <DialogContentText
                key="paragraph2"
                id="dialog-description"
                color="text.primary"
                mt={2}
              />,
            ]}
          />
        </ConfirmationModal>
      )}
    </>
  );
};

export default DigitalContactActivation;
