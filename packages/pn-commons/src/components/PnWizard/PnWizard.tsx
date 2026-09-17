import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Box, Paper, PaperProps, Stack, StackProps, Typography } from '@mui/material';
import { IllusMICompleted, IllustrationProps, MIButton, MIButtonProps } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { checkChildren } from '../../utility/children.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PnWizardStep, { PnWizardStepProps } from './PnWizardStep';
import PnWizardStepper from './PnWizardStepper';

type NextButtonProps = Omit<MIButtonProps, 'onClick' | 'href'> & {
  onClick?: (next: () => void, step: number) => void;
  label?: string;
  herf?: never;
};

type PrevButtonProps = Omit<MIButtonProps, 'onClick' | 'href'> & {
  onClick?: (previous: () => void, step: number) => void;
  herf?: never;
};

type Props = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  title: ReactNode;
  children: ReactNode;
  slots?: {
    nextButton?: JSXElementConstructor<NextButtonProps>;
    prevButton?: JSXElementConstructor<PrevButtonProps>;
    exitButton?: JSXElementConstructor<MIButtonProps>;
    feedbackIcon?: JSXElementConstructor<IllustrationProps>;
  };
  slotsProps?: {
    stepContainer?: Partial<PaperProps>;
    nextButton?: NextButtonProps;
    prevButton?: PrevButtonProps;
    exitButton?: MIButtonProps;
    actions?: StackProps;
    container?: Omit<StackProps, 'children'> & { 'data-testid'?: string };
    feedback?: {
      title: string;
      content?: ReactNode;
      buttonText: string;
      iconProps?: Partial<IllustrationProps>;
      onClick: () => void;
      onFeedbackShow?: () => void;
    };
    belowStepContent?: ReactNode;
  };
};

const PnWizard: React.FC<Props> = ({
  activeStep,
  setActiveStep,
  title,
  children,
  slots,
  slotsProps,
}) => {
  checkChildren(children, [{ cmp: PnWizardStep }], 'PnWizard');
  const PrevButton = slots?.prevButton || MIButton;
  const NextButton = slots?.nextButton || MIButton;
  const ExitButton = slots?.exitButton || MIButton;
  const FeedbackIcon = slots?.feedbackIcon || IllusMICompleted;
  const isMobile = useIsMobile();
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

    feedback.onFeedbackShow?.();

    return (
      <Box
        sx={{ minHeight: '350px', height: '100%', display: 'flex' }}
        data-testid="wizard-feedback-step"
      >
        <Box sx={{ mt: 11, mx: 'auto', textAlign: 'center', width: '80vw' }}>
          <FeedbackIcon {...slotsProps?.feedback?.iconProps} />
          <Typography
            data-testid="wizard-feedback-title"
            variant="h4"
            color="text.primary"
            sx={{ mt: 4, mb: 1, mx: '0px auto' }}
          >
            {feedback.title}
          </Typography>
          <Typography
            data-testid="wizard-feedback-content"
            color="text.primary"
            variant="body2"
            fontWeight="400"
            sx={{ mt: 1, mb: 2, mx: '0px auto', fontSize: { xs: '14px', sm: '16px' } }}
          >
            {feedback.content}
          </Typography>

          <MIButton
            data-testid="wizard-feedback-button"
            variant="contained"
            sx={{ mt: 2, mb: 11 }}
            onClick={feedback.onClick}
          >
            {feedback.buttonText}
          </MIButton>
        </Box>
      </Box>
    );
  }

  return (
    <Stack display="flex" alignItems="center" justifyContent="center" {...slotsProps?.container}>
      <Box p={3}>
        <ExitButton
          {...slotsProps?.exitButton}
          data-testid="exit-button"
          startIcon={<ArrowBackRoundedIcon />}
          variant="text"
          sx={{ p: 0 }}
        >
          {getLocalizedOrDefaultLabel('common', 'button.exit', 'Esci')}
        </ExitButton>
        <Box sx={{ mt: 2, mb: 3 }} data-testid="wizard-title">
          {title}
        </Box>

        {steps.length > 0 && <PnWizardStepper steps={steps} activeStep={activeStep} />}

        <Paper
          elevation={0}
          {...slotsProps?.stepContainer}
          sx={{ p: 3, mb: '20px', mt: 3, ...slotsProps?.stepContainer?.sx }}
        >
          {childrens[activeStep]}
        </Paper>

        {slotsProps?.belowStepContent}

        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          justifyContent="space-between"
          spacing={isMobile ? 2 : 0}
          {...slotsProps?.actions}
        >
          <PrevButton
            {...slotsProps?.prevButton}
            variant="text"
            data-testid="prev-button"
            sx={{ mt: { xs: 2, md: 0 } }}
            onClick={handlePrevStep}
          >
            {getLocalizedOrDefaultLabel('common', 'button.indietro', 'Indietro')}
          </PrevButton>

          <NextButton
            {...slotsProps?.nextButton}
            data-testid="next-button"
            variant="contained"
            sx={{ ml: { md: 'auto' } }}
            onClick={handleNextStep}
          >
            {slotsProps?.nextButton?.label ||
              getLocalizedOrDefaultLabel('common', 'button.conferma', 'Conferma')}
          </NextButton>
        </Stack>
      </Box>
    </Stack>
  );
};

export default PnWizard;
