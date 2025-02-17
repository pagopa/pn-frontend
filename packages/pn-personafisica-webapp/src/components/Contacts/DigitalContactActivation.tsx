import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, DialogContentText, DialogTitle, Typography } from '@mui/material';
import {
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  PnWizard,
  PnWizardStep,
} from '@pagopa-pn/pn-commons';
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
  exit?: boolean;
};

type DialogProps = {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  confirmAction: string;
  onDiscard?: () => void;
};

const CourtesyContactConfirmationDialog: React.FC<DialogProps> = ({
  open,
  title,
  content,
  onConfirm,
  confirmAction,
  onDiscard,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <PnDialog
      open={open}
      onClose={onDiscard}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="confirmationDialog"
    >
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <PnDialogContent>
        <Trans
          ns={'recapiti'}
          i18nKey={content}
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
      </PnDialogContent>
      <PnDialogActions>
        <Button key="confirm" onClick={onConfirm} variant="contained" data-testid="confirmButton">
          {confirmAction}
        </Button>
        {onDiscard && (
          <Button key="cancel" onClick={onDiscard} variant="outlined" data-testid="discardButton">
            {t('button.do-later')}
          </Button>
        )}
      </PnDialogActions>
    </PnDialog>
  );
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
    handleSkipOrExit(!!modal.exit);
  };

  const handleSkipOrExitClick = (exit: boolean) => {
    if (hasCourtesyContact || activeStep === 0) {
      handleSkipOrExit(exit);
    } else {
      showConfirmationModal(exit);
    }
  };

  const handleSkipOrExit = (exit: boolean) => {
    if (exit) {
      if (activeStep === 0) {
        navigate(-1);
      } else {
        setActiveStep(3); // set the current step greater than the number of steps to go to the thankyou page
      }
    } else {
      goToNextStep();
    }
  };

  const showConfirmationModal = (exit: boolean) => {
    if (activeStep === 1 && showIOStep) {
      setModal({ open: true, step: ActiveStep.IO, exit });
    } else {
      setModal({ open: true, step: ActiveStep.EMAIL, exit });
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
          onClick={() => handleSkipOrExitClick(false)}
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
      <CourtesyContactConfirmationDialog
        open={modal.open}
        title={t('courtesy-contacts.confirmation-modal-title')}
        content={
          modal.step
            ? `courtesy-contacts.confirmation-modal-${modal.step.toLowerCase()}-content`
            : ''
        }
        onConfirm={handleConfirmationModalAccept}
        confirmAction={
          modal.step
            ? t(`courtesy-contacts.confirmation-modal-${modal.step.toLowerCase()}-accept`)
            : ''
        }
        onDiscard={handleConfirmationModalDecline}
      />
    </>
  );
};

export default DigitalContactActivation;
