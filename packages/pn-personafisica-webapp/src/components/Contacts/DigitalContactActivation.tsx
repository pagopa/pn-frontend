import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Typography } from '@mui/material';
import { ConfirmationModal, PnWizard, PnWizardStep, appStateActions } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import IOContactWizard from '../../components/Contacts/IOContactWizard';
import PecContactWizard from '../../components/Contacts/PecContactWizard';
import SercqSendContactWizard from '../../components/Contacts/SercqSendContactWizard';
import { PFEventsType } from '../../models/PFEventsType';
import { IOAllowedValues } from '../../models/contacts';
import { RECAPITI } from '../../navigation/routes.const';
import { enableIOAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import EmailSmsContactWizard from './EmailSmsContactWizard';

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
  const dispatch = useAppDispatch();

  const goToNextStep = () => {
    setActiveStep((step) => step + 1);
  };

  const goToEnd = () => {
    setActiveStep(3); // set the current step greater than the number of steps to go to the thankyou page
  };

  const handleConfirmIOActivation = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_START);
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION);
    dispatch(enableIOAddress())
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS, true);
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('courtesy-contacts.io-added-successfully', { ns: 'recapiti' }),
          })
        );
        goToNextStep();
      })
      .catch(() => {});
  };

  const handleConfirmationModalAccept = () => {
    handleConfirmIOActivation();
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
          <SercqSendContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
        </PnWizardStep>
        {showIOStep && (
          <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_2.title')}>
            <IOContactWizard
              goToNextStep={goToNextStep}
              handleConfirmIOActivation={handleConfirmIOActivation}
              handleSkipOrExitClick={handleSkipOrExitClick}
            />
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
          title={t('courtesy-contacts.confirmation-modal-io-title')}
          slots={{
            confirmButton: Button,
            closeButton: Button,
          }}
          slotsProps={{
            closeButton: {
              onClick: handleConfirmationModalDecline,
              children: t('button.do-later', { ns: 'common' }),
            },
            confirmButton: {
              onClick: handleConfirmationModalAccept,
              children: t(
                `courtesy-contacts.confirmation-modal-${modal.step.toLowerCase()}-accept`
              ),
            },
          }}
        >
          <Trans
            ns="recapiti"
            i18nKey={`courtesy-contacts.confirmation-modal-${modal.step.toLowerCase()}-content`}
          />
        </ConfirmationModal>
      )}
    </>
  );
};

export default DigitalContactActivation;
