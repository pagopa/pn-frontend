import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, DialogContentText, Typography } from '@mui/material';
import { ConfirmationModal, PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import PecContactWizard from '../../components/Contacts/PecContactWizard';
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

type ModalType = {
  open: boolean;
};

const DigitalContactActivation: React.FC<Props> = ({ isTransferring = false, onGoBack }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const { IS_DOD_ENABLED } = getConfiguration();
  const { defaultSMSAddress, defaultEMAILAddress, defaultSERCQ_SENDAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const [modal, setModal] = useState<ModalType>({ open: false });
  const [activeStep, setActiveStep] = useState(0);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress || !IS_DOD_ENABLED);

  const showEmailStep = useMemo(() => !(defaultSMSAddress || defaultEMAILAddress), []);

  const hasCourtesyContact = defaultEMAILAddress || defaultSMSAddress;

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

  const showConfirmationModal = () => {
    setModal({ open: true });
  };

  const handleExit = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else if (hasCourtesyContact) {
      goToNextStep();
    } else {
      showConfirmationModal();
    }
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
    if (hasCourtesyContact) {
      return (
        <Button variant="contained" onClick={goToNextStep} color="primary" size="medium">
          {t('button.conferma', { ns: 'common' })}
        </Button>
      );
    }

    return (
      <ButtonNaked
        onClick={showConfirmationModal}
        color="primary"
        size="medium"
        sx={{ mx: 'auto' }}
      >
        {t('button.not-now', { ns: 'common' })}
      </ButtonNaked>
    );
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
            buttonText: t('legal-contacts.sercq-send-wizard.feedback.go-to-contacts'),
            onClick: () => navigate(RECAPITI),
          },
          actions: hasCourtesyContact ? { justifyContent: 'flex-end' } : {},
        }}
      >
        <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_1.title')}>
          <HowItWorksContactWizard
            goToNextStep={goToNextStep}
            setShowPecWizard={setShowPecWizard}
          />
        </PnWizardStep>
        {showEmailStep && (
          <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_2.step-title')}>
            <EmailSmsContactWizard />
          </PnWizardStep>
        )}
      </PnWizard>
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
            children: t(`courtesy-contacts.confirmation-modal-accept`),
          },
          confirmButton: {
            onClick: handleConfirmationModalDecline,
            children: t('button.do-later', { ns: 'common' }),
          },
        }}
      >
        <Trans
          ns={'recapiti'}
          i18nKey={modal ? `courtesy-contacts.confirmation-modal-content` : ''}
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
    </>
  );
};

export default DigitalContactActivation;
