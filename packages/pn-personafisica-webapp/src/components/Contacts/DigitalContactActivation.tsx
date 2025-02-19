import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, DialogContentText, Typography } from '@mui/material';
import { ConfirmationModal, PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import IOContactWizard from '../../components/Contacts/IOContactWizard';
import PecContactWizard from '../../components/Contacts/PecContactWizard';
import SercqSendContactWizard from '../../components/Contacts/SercqSendContactWizard';
import { IOAllowedValues } from '../../models/contacts';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import EmailSmsContactWizard from './EmailSmsContactWizard';

type Props = {
  isTransferring?: boolean;
};

enum ActiveStep {
  IO = 'IO',
  EMAIL = 'EMAIL',
}

type ModalType = {
  open: boolean;
  step?: ActiveStep;
};

const DigitalContactActivation: React.FC<Props> = ({ isTransferring = false }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const { defaultAPPIOAddress, defaultSMSAddress, defaultEMAILAddress, defaultSERCQ_SENDAddress } =
    useAppSelector(contactsSelectors.selectAddresses);

  const [modal, setModal] = useState<ModalType>({ open: false });
  const [activeStep, setActiveStep] = useState(0);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress);

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

  const handleConfirmationModalAccept = () => {
    setModal({ open: false });
  };

  const handleConfirmationModalDecline = () => {
    setModal({ open: false });
    goToNextStep();
  };

  const handleSkipOrExitClick = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else if (hasCourtesyContact) {
      setActiveStep(3); // set the current step greater than the number of steps to go to the thankyou page
    } else {
      showConfirmationModal();
    }
  };

  const showConfirmationModal = () => {
    if (activeStep === 1 && showIOStep) {
      setModal({ open: true, step: ActiveStep.IO });
    } else {
      setModal({ open: true, step: ActiveStep.EMAIL });
    }
  };

  const getNextButton = () => {
    if (activeStep === 0) {
      return (
        <ButtonNaked onClick={() => navigate(-1)} color="primary" size="medium" sx={{ mx: 'auto' }}>
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
    return <PecContactWizard setShowPecWizard={setShowPecWizard} isTransferring={isTransferring} />;
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
        onExit={() => handleSkipOrExitClick()}
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
            buttonText: t('legal-contacts.sercq-send-wizard.feedback.back-to-contacts'),
            onClick: () => navigate(-1),
          },
          actions: isEmailSmsStep && hasEmailOrSms ? { justifyContent: 'flex-end' } : {},
        }}
      >
        <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_1.title')}>
          <SercqSendContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
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
          slotsProps={{
            closeButton: { onClick: handleConfirmationModalAccept, variant: 'contained' },
            confirmButton: { onClick: handleConfirmationModalDecline, variant: 'outlined' },
          }}
          onCloseLabel={t(
            `courtesy-contacts.confirmation-modal-${modal.step.toLowerCase()}-accept`
          )}
          onConfirmLabel={t('button.do-later', { ns: 'common' })}
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
