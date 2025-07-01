import { describe, expect, it, vi } from 'vitest';

import { disableConsoleLogging, fireEvent, render } from '../../../test-utils';
import PnWizard from '../PnWizard';
import PnWizardStep from '../PnWizardStep';

describe('PnWizard Component', () => {
  disableConsoleLogging('error');
  const setActiveStep = vi.fn();

  it('renders PnWizard', () => {
    const { getByTestId, getByText, queryByText } = render(
      <PnWizard activeStep={0} setActiveStep={setActiveStep} title="Wizard Title">
        <PnWizardStep label="Label Step 1">Step 1</PnWizardStep>
        <PnWizardStep label="Label Step 2">Step 2</PnWizardStep>
      </PnWizard>
    );

    expect(getByTestId('wizard-title')).toBeInTheDocument();
    expect(getByText('Step 1')).toBeInTheDocument();
    expect(queryByText('Step 2')).not.toBeInTheDocument();
  });

  it('should call the exit callback', () => {
    const onExitMock = vi.fn();
    const { getByRole } = render(
      <PnWizard
        activeStep={0}
        setActiveStep={setActiveStep}
        title="Wizard Title"
        slotsProps={{
          exitButton: { onClick: onExitMock },
        }}
      >
        <PnWizardStep label="Label Step 1">Step 1</PnWizardStep>
        <PnWizardStep label="Label Step 2">Step 2</PnWizardStep>
      </PnWizard>
    );

    const exitButton = getByRole('button', { name: 'Esci' });
    fireEvent.click(exitButton);
    expect(onExitMock).toHaveBeenCalledOnce();
  });

  it('should call setActiveStep on step navigation', () => {
    const { getByTestId } = render(
      <PnWizard activeStep={0} setActiveStep={setActiveStep} title="Wizard Title">
        <PnWizardStep label="Label Step 1">Step 1</PnWizardStep>
        <PnWizardStep label="Label Step 2">Step 2</PnWizardStep>
      </PnWizard>
    );

    const nextButton = getByTestId('next-button');

    fireEvent.click(nextButton);
    expect(setActiveStep).toHaveBeenCalledTimes(1);
    expect(setActiveStep).toHaveBeenCalledWith(1);
  });

  it('should use custom buttons from slots', () => {
    const CustomNextButton = () => <div data-testid="custom-next">Custom Next</div>;

    const { getByTestId } = render(
      <PnWizard
        activeStep={0}
        setActiveStep={setActiveStep}
        title="Wizard Title"
        slots={{ nextButton: CustomNextButton }}
      >
        <PnWizardStep label="Label Step 1">Step 1</PnWizardStep>
        <PnWizardStep label="Label Step 2">Step 2</PnWizardStep>
      </PnWizard>
    );

    expect(getByTestId('custom-next')).toBeInTheDocument();
  });

  it('should calls custom onClick passed to slotsProps', () => {
    const customNextClick = vi.fn();
    const customPrevClick = vi.fn();
    const onExitMock = vi.fn();

    const { getByTestId } = render(
      <PnWizard
        activeStep={1}
        setActiveStep={setActiveStep}
        title="Wizard Title"
        slotsProps={{
          nextButton: { onClick: customNextClick },
          prevButton: { onClick: customPrevClick },
          exitButton: { onClick: onExitMock },
        }}
      >
        <PnWizardStep label="Label Step 1">Step 1</PnWizardStep>
        <PnWizardStep label="Label Step 2">Step 2</PnWizardStep>
      </PnWizard>
    );

    const nextButton = getByTestId('next-button');
    const prevButton = getByTestId('prev-button');
    const exitButton = getByTestId('exit-button');

    fireEvent.click(nextButton);
    expect(customNextClick).toHaveBeenCalledTimes(1);

    fireEvent.click(prevButton);
    expect(customPrevClick).toHaveBeenCalledTimes(1);

    fireEvent.click(exitButton);
    expect(onExitMock).toHaveBeenCalledTimes(1);
  });

  it('should render feedback step', () => {
    const { getByTestId } = render(
      <PnWizard
        activeStep={2}
        setActiveStep={setActiveStep}
        title="Wizard Title"
        slotsProps={{
          feedback: {
            title: 'Custom title',
            buttonText: 'Custom button text',
            onClick: vi.fn(),
          },
        }}
      >
        <PnWizardStep label="Label Step 1">Step 1</PnWizardStep>
        <PnWizardStep label="Label Step 2">Step 2</PnWizardStep>
      </PnWizard>
    );

    const feedbackStep = getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();
  });

  it('should not render feedback step', () => {
    const { queryByTestId } = render(
      <PnWizard activeStep={2} setActiveStep={setActiveStep} title="Wizard Title">
        <PnWizardStep label="Label Step 1">Step 1</PnWizardStep>
        <PnWizardStep label="Label Step 2">Step 2</PnWizardStep>
      </PnWizard>
    );

    const feedbackStep = queryByTestId('wizard-feedback-step');
    expect(feedbackStep).not.toBeInTheDocument();
  });

  it('should render custom feedback step', () => {
    const customFeedbackFn = vi.fn();

    const { getByTestId } = render(
      <PnWizard
        activeStep={2}
        setActiveStep={setActiveStep}
        title="Wizard Title"
        slotsProps={{
          feedback: {
            title: 'Custom title',
            buttonText: 'Custom button text',
            onClick: customFeedbackFn,
          },
        }}
      >
        <PnWizardStep label="Label Step 1">Step 1</PnWizardStep>
        <PnWizardStep label="Label Step 2">Step 2</PnWizardStep>
      </PnWizard>
    );

    const feedbackStep = getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const title = getByTestId('wizard-feedback-title');
    expect(title).toHaveTextContent('Custom title');
    const button = getByTestId('wizard-feedback-button');
    expect(button).toHaveTextContent('Custom button text');
    fireEvent.click(button);
    expect(customFeedbackFn).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if children are not PnWizardStep', () => {
    expect(() =>
      render(
        <PnWizard activeStep={0} setActiveStep={setActiveStep} title="Wizard Title">
          <div>Step 1</div>
        </PnWizard>
      )
    ).toThrow('PnWizard can have only children of type PnWizardStep');
  });
});
