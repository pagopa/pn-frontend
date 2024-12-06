import React from 'react';

import { Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';

const TestPage: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const onStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <PnWizard
      title={
        <Typography
          data-testid="titleBox"
          role="heading"
          variant="h4"
          display="inline-block"
          sx={{ verticalAlign: 'middle' }}
        >
          Attiva domicilio digitale
        </Typography>
      }
      slots={{
        nextButton: currentStep === 1 ? () => <></> : undefined,
      }}
      slotsProps={{
        nextButton: {
          onClick: (next, activeStep) => {
            console.log('next', activeStep);
            next();
          },
          variant: 'contained',
          color: 'primary',
        },
      }}
      onStepChange={onStepChange}
    >
      <PnWizardStep label="step 1">
        <div>Step 1</div>
      </PnWizardStep>
      <PnWizardStep label="step 2">
        <div>Step 2</div>
      </PnWizardStep>
    </PnWizard>
  );
};

export default TestPage;
