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

import PecContactWizard from '../../components/Contacts/PecContactWizard';
import SercqSendContactWizard from '../../components/Contacts/SercqSendContactWizard';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import EmailSmsContactWizard from './EmailSmsContactWizard';

type Props = {
  isTransferring?: boolean;
};

type ModalType = {
  open: boolean;
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
  const { defaultSMSAddress, defaultEMAILAddress, defaultSERCQ_SENDAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const [modal, setModal] = useState<ModalType>({ open: false });
  const [activeStep, setActiveStep] = useState(0);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress);

  const showEmailStep = useMemo(() => !(defaultSMSAddress || defaultEMAILAddress), []);

  const hasCourtesyContact = !!(defaultEMAILAddress || defaultSMSAddress);

  const goToNextStep = () => {
    setActiveStep((step) => step + 1);
  };

  const handleConfirmationModalAccept = () => {
    setModal({ open: false });
  };

  const handleConfirmationModalDecline = () => {
    if (modal.exit) {
      setActiveStep(2); // set the current step greater than the number of steps to go to the thankyou page
    } else {
      goToNextStep();
    }
    setModal({ open: false });
  };

  const handleNotNow = () => {
    setModal({ open: true });
  };

  const handleExit = () => {
    if (activeStep === 1) {
      handleNotNow();
    } else {
      navigate(-1);
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
    if (hasCourtesyContact) {
      return (
        <Button variant="contained" onClick={goToNextStep} color="primary" size="medium">
          {t('button.conferma', { ns: 'common' })}
        </Button>
      );
    }

    return (
      <ButtonNaked onClick={handleNotNow} color="primary" size="medium" sx={{ mx: 'auto' }}>
        {t('button.not-now', { ns: 'common' })}
      </ButtonNaked>
    );
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
        onExit={handleExit}
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
          buttonContainer: hasCourtesyContact ? { justifyContent: 'flex-end' } : {},
        }}
      >
        <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_1.title')}>
          <SercqSendContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
        </PnWizardStep>
        {showEmailStep && (
          <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_2.step-title')}>
            <EmailSmsContactWizard />
          </PnWizardStep>
        )}
      </PnWizard>
      <CourtesyContactConfirmationDialog
        open={modal.open}
        title={t('courtesy-contacts.confirmation-modal-title')}
        content={modal ? `courtesy-contacts.confirmation-modal-content` : ''}
        onConfirm={handleConfirmationModalAccept}
        confirmAction={t(`courtesy-contacts.confirmation-modal-accept`)}
        onDiscard={handleConfirmationModalDecline}
      />
    </>
  );
};

export default DigitalContactActivation;
