import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { IllusMICompleted } from '@pagopa/mui-italia';

import { IOAllowedValues } from '../../../models/contacts';
import { NOTIFICHE, ONBOARDING } from '../../../navigation/routes.const';
import { contactsSelectors } from '../../../redux/contact/reducers';
import { useAppSelector } from '../../../redux/hooks';
import IoStep from './IoStep';

const IoActivationWizard: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();

  const { defaultAPPIOAddress } = useAppSelector(contactsSelectors.selectAddresses);

  const [activeStep, setActiveStep] = useState(0);
  const [ioValue, setIoValue] = useState<IOAllowedValues | undefined>(
    defaultAPPIOAddress?.value as IOAllowedValues | undefined
  );

  const goToNotifications = () => {
    navigate(NOTIFICHE);
  };

  const exit = () => {
    navigate(ONBOARDING);
  };

  const goToFeedback = () => {
    setActiveStep(1);
  };

  return (
    <PnWizard
      title={
        <Typography fontSize="24px" fontWeight={700}>
          {t('onboarding.io-activation.title')}
        </Typography>
      }
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      slots={{
        feedbackIcon: IllusMICompleted,
      }}
      slotsProps={{
        exitButton: {
          onClick: exit,
          sx: {
            color: '#0E0F13',
            '&:hover': {
              color: '#0E0F13',
            },
          },
        },
        actions: {
          sx: { display: 'none' },
        },
        feedback: {
          title: t('onboarding.io-activation.feedback.title'),
          content: t('onboarding.io-activation.feedback.content'),
          buttonText: t('button.understand', { ns: 'common' }),
          onClick: goToNotifications,
        },
        stepContainer: {
          sx: {
            p: 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 24,
            borderBottomLeftRadius: 24,
            overflow: 'hidden',
          },
        },
      }}
    >
      <PnWizardStep>
        <IoStep value={ioValue} onChange={setIoValue} onContinue={goToFeedback} />
      </PnWizardStep>
    </PnWizard>
  );
};

export default IoActivationWizard;
