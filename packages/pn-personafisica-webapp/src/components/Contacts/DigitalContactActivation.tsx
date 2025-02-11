import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import { PnWizard, PnWizardStep, usePreviousLocation } from '@pagopa-pn/pn-commons';
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

const DigitalContactActivation: React.FC<Props> = ({ isTransferring = false }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const { navigateToPreviousLocation } = usePreviousLocation();
  const { defaultAPPIOAddress, defaultSMSAddress, defaultEMAILAddress, defaultSERCQ_SENDAddress } =
    useAppSelector(contactsSelectors.selectAddresses);

  const [activeStep, setActiveStep] = useState(0);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress);

  const [hasAppIO] = useState(
    defaultAPPIOAddress && defaultAPPIOAddress.value === IOAllowedValues.DISABLED
  );
  const [hasCourtesyContact] = useState(!(defaultSMSAddress || defaultEMAILAddress));

  const goToNextStep = () => {
    setActiveStep(activeStep + 1);
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
        <ButtonNaked onClick={goToNextStep} color="primary" size="medium" sx={{ mx: 'auto' }}>
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
  );
};

export default DigitalContactActivation;
