import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  ButtonProps,
  Paper,
  PaperProps,
  Stack,
  StackProps,
  Typography,
} from '@mui/material';
import { ButtonNaked, IllusCompleted } from '@pagopa/mui-italia';

import checkChildren from '../../utility/children.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PnWizardStep, { PnWizardStepProps } from './PnWizardStep';
import PnWizardStepper from './PnWizardStepper';

type Props = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  title: ReactNode;
  children: ReactNode;
  onExit?: () => void;
  slots?: {
    nextButton?: JSXElementConstructor<ButtonProps>;
    prevButton?: JSXElementConstructor<ButtonProps>;
  };
  slotsProps?: {
    stepContainer?: Partial<PaperProps>;
    nextButton?: Omit<ButtonProps, 'onClick'> & {
      onClick?: (next: () => void, step: number) => void;
    };
    prevButton?: Omit<ButtonProps, 'onClick'> & {
      onClick?: (previous: () => void, step: number) => void;
    };
    actions?: StackProps;
    container?: Omit<StackProps, 'children'> & { 'data-testid'?: string };
    feedback?: {
      title: string;
      buttonText: string;
      onClick: () => void;
    };
  };
};

const PnWizard: React.FC<Props> = ({
  activeStep,
  setActiveStep,
  title,
  children,
  onExit,
  slots,
  slotsProps,
}) => {
  checkChildren(children, [{ cmp: PnWizardStep }], 'PnWizard');
  const PrevButton = slots?.prevButton || Button;
  const NextButton = slots?.nextButton || Button;

  const childrens = React.Children.toArray(children);
  const steps = childrens
    .filter(
      (child): child is ReactElement<PnWizardStepProps> =>
        React.isValidElement(child) && child.type === PnWizardStep && child.props.label
    )
    .map((child) => ({ label: child.props.label }));

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setActiveStep(step);
    }
  };

  const handleNextStep = async () => {
    if (slotsProps?.nextButton?.onClick) {
      slotsProps.nextButton.onClick(() => goToStep(activeStep + 1), activeStep);
      return;
    }
    goToStep(activeStep + 1);
  };

  const handlePrevStep = async () => {
    if (slotsProps?.prevButton?.onClick) {
      slotsProps.prevButton.onClick(() => goToStep(activeStep - 1), activeStep);
      return;
    }
    goToStep(activeStep - 1);
  };

  if (activeStep >= childrens.length && slotsProps?.feedback) {
    const feedback = slotsProps?.feedback;
    return (
      <Box
        sx={{ minHeight: '350px', height: '100%', display: 'flex' }}
        data-testid="wizard-feedback-step"
      >
        <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
          <IllusCompleted />
          <Typography
            data-testid="wizard-feedback-title"
            variant="h4"
            color="text.primary"
            sx={{ margin: '20px 0 10px 0' }}
          >
            {feedback.title}
          </Typography>
          <Button
            data-testid="wizard-feedback-button"
            variant="contained"
            sx={{ marginTop: '30px' }}
            onClick={feedback.onClick}
          >
            {feedback.buttonText}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Stack display="flex" alignItems="center" justifyContent="center" {...slotsProps?.container}>
      <Box p={3}>
        {onExit && (
          <ButtonNaked
            type="button"
            size="medium"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={onExit}
          >
            {getLocalizedOrDefaultLabel('common', 'button.exit', 'Esci')}
          </ButtonNaked>
        )}
        <Box sx={{ mt: 2, mb: 3 }} data-testid="wizard-title">
          {title}
        </Box>

        {steps.length > 0 && <PnWizardStepper steps={steps} activeStep={activeStep} />}

        <Paper sx={{ p: 3, mb: '20px', mt: 3 }} elevation={0} {...slotsProps?.stepContainer}>
          {childrens[activeStep]}
        </Paper>

        <Stack direction={{ xs: 'column-reverse', md: 'row' }} {...slotsProps?.actions}>
          <PrevButton
            data-testid="prev-button"
            sx={{ mt: { xs: 2, md: 0 } }}
            {...slotsProps?.prevButton}
            onClick={handlePrevStep}
          >
            {getLocalizedOrDefaultLabel('common', 'button.indietro', 'Indietro')}
          </PrevButton>

          <NextButton
            data-testid="next-button"
            variant="contained"
            sx={{ ml: { md: 'auto' } }}
            {...slotsProps?.nextButton}
            onClick={handleNextStep}
          >
            {getLocalizedOrDefaultLabel('common', 'button.conferma', 'Conferma')}
          </NextButton>
        </Stack>
      </Box>
    </Stack>
  );
};

export default PnWizard;
