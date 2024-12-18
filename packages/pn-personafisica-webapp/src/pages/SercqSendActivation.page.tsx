import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import SercqSendContactWizard from '../components/Contacts/SercqSendContactWizard';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { getDigitalAddresses } from '../redux/contact/actions';
import { resetState } from '../redux/contact/reducers';
import { useAppDispatch } from '../redux/hooks';

const SercqSendActivation: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeStep, setActiveStep] = useState(0);
  const [pageReady, setPageReady] = useState(false);

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

    return null;
  };

  const fetchAddresses = useCallback(() => {
    void dispatch(getDigitalAddresses()).then(() => {
      setPageReady(true);
    });
  }, []);

  useEffect(() => {
    fetchAddresses();
    return () => void dispatch(resetState());
  }, []);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: { xs: '100%', lg: '760px' } }}>
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
            }}
          >
            <PnWizardStep label={t('legal-contacts.sercq-send-wizard.step_1.title')}>
              <SercqSendContactWizard goToNextStep={goToNextStep} />
            </PnWizardStep>
          </PnWizard>
        </Box>
      </Box>
    </LoadingPageWrapper>
  );
};

export default SercqSendActivation;
