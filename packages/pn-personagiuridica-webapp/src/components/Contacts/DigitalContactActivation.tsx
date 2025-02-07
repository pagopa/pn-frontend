import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import { PnWizard, PnWizardStep, usePreviousLocation } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import PecContactWizard from '../../components/Contacts/PecContactWizard';
import SercqSendContactWizard from '../../components/Contacts/SercqSendContactWizard';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';

type Props = {
  isTransferring?: boolean;
};

const DigitalContactActivation: React.FC<Props> = ({ isTransferring = false }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const { navigateToPreviousLocation } = usePreviousLocation();
  const { defaultSERCQ_SENDAddress } = useAppSelector(contactsSelectors.selectAddresses);

  const [activeStep, setActiveStep] = useState(0);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress);

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
    </PnWizard>
  );
};

export default DigitalContactActivation;
