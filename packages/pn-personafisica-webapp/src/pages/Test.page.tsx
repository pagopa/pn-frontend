import React, { useRef } from 'react';

import { Typography } from '@mui/material';
import { PnWizard, PnWizardRef, PnWizardStep } from '@pagopa-pn/pn-commons';

const TestPage: React.FC = () => {
  const wizardRef = useRef<PnWizardRef>({ activeStep: 0 });

  console.log('wizardRef', wizardRef.current.activeStep);

  return (
    <PnWizard
      ref={wizardRef}
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
          variant: wizardRef.current?.activeStep === 0 ? 'outlined' : 'contained',
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
