import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';

import LegalContactManager from '../components/Contacts/LegalContactManager';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';

const DigitalContactManagement: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const goToNextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else {
      setActiveStep((currentStep) => currentStep - 1);
    }
  };

  const getPreviouButton = () => {
    if (activeStep === 0 || activeStep === 1) {
      return (
        <Button
          onClick={handleBack}
          color="primary"
          size="medium"
          sx={{ mx: 'auto' }}
          variant="outlined"
        >
          {t('button.indietro', { ns: 'common' })}
        </Button>
      );
    }
    return null;
  };

  const getNextButton = () => {
    if (activeStep === 1) {
      return (
        <Button
          onClick={goToNextStep}
          // color="primary"
          size="medium"
          sx={{ mx: 'auto' }}
          variant="contained"
        >
          {t('button.conferma', { ns: 'common' })}
        </Button>
      );
    }

    return null;
  };

  return (
    <LoadingPageWrapper isInitialized={true}>
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: { xs: '100%', lg: '760px' } }}>
          <PnWizard
            title={
              <Typography fontSize="28px" fontWeight={700}>
                {t('legal-contacts.digital-domicile-management.title')}
              </Typography>
            }
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            slots={{
              stepContainer: Box,
              prevButton: getPreviouButton,
              nextButton: getNextButton,
            }}
            slotsProps={{
              stepContainer: { sx: { p: 0, mb: '20px', mt: 3 } },
            }}
          >
            <PnWizardStep>
              {activeStep === 0 && <LegalContactManager goToNextStep={goToNextStep} />}
            </PnWizardStep>
          </PnWizard>
        </Box>
      </Box>
    </LoadingPageWrapper>
  );
};

export default DigitalContactManagement;
