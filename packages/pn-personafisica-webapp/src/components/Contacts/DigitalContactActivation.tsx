import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle, Typography } from '@mui/material';
import {
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  PnWizard,
  PnWizardStep,
  usePreviousLocation,
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
  step: ActiveStep;
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
  const { navigateToPreviousLocation } = usePreviousLocation();
  const { defaultAPPIOAddress, defaultSMSAddress, defaultEMAILAddress, defaultSERCQ_SENDAddress } =
    useAppSelector(contactsSelectors.selectAddresses);

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress);

  const [hasAppIO] = useState(
    defaultAPPIOAddress && defaultAPPIOAddress.value === IOAllowedValues.DISABLED
  );
  const [hasCourtesyContact] = useState(!(defaultSMSAddress || defaultEMAILAddress));

  const goToNextStep = () => {
    setActiveStep((step) => step + 1);
  };

  const handleConfirmationModalAccept = () => {
    setModalOpen(null);
  };

  const handleConfirmationModalDecline = () => {
    if (modalOpen?.exit) {
      setActiveStep(5); // set the current step greater than the number of steps to go to the thankyou page
    } else {
      goToNextStep();
    }
    setModalOpen(null);
  };

  const handleNotNow = () => {
    if (activeStep === 1 && hasAppIO) {
      setModalOpen({ step: ActiveStep.IO });
    } else {
      setModalOpen({ step: ActiveStep.EMAIL });
    }
  };

  const getNextButton = () => {
    if (activeStep === 0) {
      return (
        <ButtonNaked
          onClick={navigateToPreviousLocation}
          color="primary"
          size="medium"
          sx={{ mx: 'auto' }}
        >
          {t('button.annulla', { ns: 'common' })}
        </ButtonNaked>
      );
    }

    if (activeStep > 0 && (hasAppIO || hasCourtesyContact)) {
      return (
        <ButtonNaked onClick={handleNotNow} color="primary" size="medium" sx={{ mx: 'auto' }}>
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
            onClick: navigateToPreviousLocation,
          },
        }}
      >
        <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_1.title')}>
          <SercqSendContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
        </PnWizardStep>
        {hasAppIO && (
          <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_2.title')}>
            <IOContactWizard goToNextStep={goToNextStep} />
          </PnWizardStep>
        )}
        {hasCourtesyContact && (
          <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_3.step-title')}>
            <EmailSmsContactWizard />
          </PnWizardStep>
        )}
      </PnWizard>
      <CourtesyContactConfirmationDialog
        open={!!modalOpen}
        title={t('courtesy-contacts.confirmation-modal-title')}
        content={
          modalOpen
            ? `courtesy-contacts.confirmation-modal-${modalOpen?.step.toLowerCase()}-content`
            : ''
        }
        onConfirm={handleConfirmationModalAccept}
        confirmAction={
          modalOpen
            ? t(`courtesy-contacts.confirmation-modal-${modalOpen?.step.toLowerCase()}-accept`)
            : ''
        }
        onDiscard={handleConfirmationModalDecline}
      />
    </>
  );
};

export default DigitalContactActivation;
