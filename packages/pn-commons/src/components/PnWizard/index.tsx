import React, {
  ElementType,
  ReactElement,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, ButtonProps, Paper, Stack, Step, StepLabel, Stepper } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PnWizardRef } from '../../models/Wizard';
import checkChildren from '../../utility/children.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PnWizardStep, { PnWizardStepProps } from './PnWizardStep';

type Props = {
  title: ReactNode;
  children: ReactNode;
  slots?: {
    nextButton: ElementType;
    prevButton: ElementType;
  };
  slotsProps?: {
    nextButton?: Omit<ButtonProps, 'onClick'> & {
      onClick?: (next: () => void, step: number) => void;
    };
    prevButton?: Omit<ButtonProps, 'onClick'> & {
      onClick?: (previous: () => void, step: number) => void;
    };
  };
};

const PnWizard = forwardRef<PnWizardRef, Props>(({ title, children, slots, slotsProps }, ref) => {
  checkChildren(children, [{ cmp: PnWizardStep }], 'PnWizard');

  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const childrens = React.Children.toArray(children);
  const steps = childrens
    .filter(
      (child): child is ReactElement<PnWizardStepProps> =>
        React.isValidElement(child) && child.type === PnWizardStep && child.props.label
    )
    .map((child) => ({ label: child.props.label }));

  const NextButton = slots?.nextButton ?? Button;
  const PrevButton = slots?.prevButton ?? Button;

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setActiveStep(step);
    }
  };

  const goToNextStep = () => goToStep(activeStep + 1);
  const goToPrevStep = () => goToStep(activeStep - 1);

  const handleNextStep = async () => {
    if (slotsProps?.nextButton?.onClick) {
      slotsProps.nextButton.onClick(goToNextStep, activeStep);
      return;
    }
    goToNextStep();
  };

  const handlePrevStep = async () => {
    if (slotsProps?.prevButton?.onClick) {
      slotsProps.prevButton.onClick(goToPrevStep, activeStep);
      return;
    }
    goToPrevStep();
  };

  useImperativeHandle(
    ref,
    () => ({
      activeStep,
    }),
    [activeStep]
  );

  return (
    <Stack display="flex" alignItems="center" justifyContent="center">
      <Box p={3} sx={{ maxWidth: { xs: '100%', lg: '90%' } }}>
        <ButtonNaked
          type="button"
          size="medium"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          {getLocalizedOrDefaultLabel('common', 'button.exit', 'Esci')}
        </ButtonNaked>

        <Box sx={{ mt: 2, mb: 3 }}>{title}</Box>

        {steps.length > 0 && (
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Paper sx={{ p: 3, mb: '20px', mt: 3 }} elevation={0}>
          {childrens[activeStep]}
        </Paper>

        <Stack direction={{ xs: 'column-reverse', md: 'row' }} justifyContent="space-between">
          <PrevButton
            type="button"
            disabled={activeStep === 0}
            {...slotsProps?.prevButton}
            onClick={handlePrevStep}
          >
            {getLocalizedOrDefaultLabel('common', 'button.indietro', 'Indietro')}
          </PrevButton>
          <NextButton
            type="button"
            variant="contained"
            {...slotsProps?.nextButton}
            onClick={handleNextStep}
          >
            {getLocalizedOrDefaultLabel('common', 'button.conferma', 'Conferma')}
          </NextButton>
        </Stack>
      </Box>
    </Stack>
  );
});

export default PnWizard;
