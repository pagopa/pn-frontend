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
import { NOTIFICHE } from '../../navigation/routes.const';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import EmailSmsContactWizard from './EmailSmsContactWizard';

type Props = {
  isTransferring?: boolean;
  onGoBack?: () => void;
};

const DigitalContactActivation: React.FC<Props> = ({ isTransferring = false, onGoBack }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const { IS_DOD_ENABLED } = getConfiguration();
  const { defaultEMAILAddress, defaultSMSAddress, defaultAPPIOAddress, defaultSERCQ_SENDAddress } =
    useAppSelector(contactsSelectors.selectAddresses);

  const [activeStep, setActiveStep] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress || !IS_DOD_ENABLED);

  const showIOStep = useMemo(
    () => defaultAPPIOAddress && defaultAPPIOAddress.value === IOAllowedValues.DISABLED,
    []
  );

  const hasEmailOrSms = !!(defaultEMAILAddress || defaultSMSAddress);

  const isEmailSmsStep = (activeStep === 1 && !showIOStep) || activeStep === 2;

  const feedbackTitleLabel = `legal-contacts.sercq-send-wizard.feedback.title-sercq_send-${
    isTransferring ? 'transfer' : 'activation'
  }`;
  const feedbackContentLabel = 'legal-contacts.sercq-send-wizard.feedback.content-sercq_send';

  const handleConfirmEmailSmsStep = () => {
    if (hasEmailOrSms) {
      goToNextStep();
    } else {
      setShowConfirmationModal(true);
    }
  };

  const goToNextStep = () => {
    setActiveStep((step) => step + 1);
  };

  const goToPreviousStep = () => {
    setActiveStep((step) => step - 1);
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
          onClick={handleConfirmEmailSmsStep}
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
          title: t(feedbackTitleLabel),
          content: t(feedbackContentLabel),
          buttonText: t('button.understand', { ns: 'common' }),
          onClick: () => navigate(NOTIFICHE),
        },
        actions: !isEmailSmsStep ? { justifyContent: 'center' } : {},
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
      <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_3.step-title')}>
        <EmailSmsContactWizard />

        <ConfirmationModal
          open={showConfirmationModal}
          title={t('courtesy-contacts.confirmation-modal-title')}
          slots={{
            confirmButton: Button,
          }}
          slotsProps={{
            confirmButton: {
              onClick: () => setShowConfirmationModal(false),
              children: t('button.understand', { ns: 'common' }),
            },
          }}
        >
          <Trans
            ns="recapiti"
            i18nKey={`courtesy-contacts.confirmation-modal-email-content`}
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
      </PnWizardStep>
    </PnWizard>
  );
};

export default DigitalContactActivation;
