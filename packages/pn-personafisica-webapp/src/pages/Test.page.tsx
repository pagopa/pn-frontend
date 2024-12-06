import React from 'react';

import { Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';

const TestPage: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <PnWizard
      activeStep={activeStep}
      setActiveStep={setActiveStep}
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
      slotsProps={{
        nextButton: {
          onClick: (next, activeStep) => {
            console.log('next', activeStep);
            next();
          },
        },
      }}
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
