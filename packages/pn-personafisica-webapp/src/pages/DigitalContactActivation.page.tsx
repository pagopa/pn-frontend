import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import IOContactWizard from '../components/Contacts/IOContactWizard';
import PecContactWizard from '../components/Contacts/PecContactWizard';
import SercqSendContactWizard from '../components/Contacts/SercqSendContactWizard';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { IOAllowedValues } from '../models/contacts';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppSelector } from '../redux/hooks';

const DigitalContactActivation: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const { defaultAPPIOAddress, defaultSERCQ_SENDAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const [activeStep, setActiveStep] = useState(0);
  const [showPecWizard, setShowPecWizard] = useState(!!defaultSERCQ_SENDAddress);

  const hasAppIO = defaultAPPIOAddress && defaultAPPIOAddress.value === IOAllowedValues.DISABLED;

  const goToNextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const getNextButton = () => {
    if (activeStep === 0) {
      return (
        <ButtonNaked onClick={() => navigate(-1)} color="primary" size="medium" sx={{ mx: 'auto' }}>
          {t('button.annulla', { ns: 'common' })}
        </ButtonNaked>
      );
    }

    if (activeStep === 1 && hasAppIO) {
      return (
        <ButtonNaked onClick={goToNextStep} color="primary" size="medium" sx={{ mx: 'auto' }}>
          {t('button.not-now', { ns: 'common' })}
        </ButtonNaked>
      );
    }

    return null;
  };

  return (
    <LoadingPageWrapper isInitialized={true}>
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: { xs: '100%', lg: '760px' } }}>
          {!showPecWizard ? (
            <PnWizard
              title={
                <Typography fontSize="28px" fontWeight={700}>
                  {t('legal-contacts.sercq-send-wizard.title')}
                </Typography>
              }
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              slots={{
                nextButton: getNextButton,
                prevButton: () => <></>,
              }}
            >
              <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_1.title')}>
                <SercqSendContactWizard
                  goToNextStep={goToNextStep}
                  setShowPecWizard={setShowPecWizard}
                />
              </PnWizardStep>
              {hasAppIO && (
                <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_2.title')}>
                  <IOContactWizard goToNextStep={goToNextStep} />
                </PnWizardStep>
              )}
            </PnWizard>
          ) : (
            <PecContactWizard setShowPecWizard={setShowPecWizard} />
          )}
        </Box>
      </Box>
    </LoadingPageWrapper>
  );
};

export default DigitalContactActivation;
