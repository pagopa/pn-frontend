import { mockTimelineStepAnalogFailureWorkflow } from '../../../__mocks__/TimelineStep.mock';
import { AnalogFailureWorkflowStep } from '../AnalogFailureWorkflowStep';

describe('AnalogFailureWorkflowStep', () => {
  it('test getTimelineStepInfo', () => {
    const analogFailureWorkflowStep = new AnalogFailureWorkflowStep();

    expect(
      analogFailureWorkflowStep.getTimelineStepInfo(mockTimelineStepAnalogFailureWorkflow)
    ).toStrictEqual({
      label: 'Invio analogico assolutamente fallimentare',
      description: `Invio analogico a ${mockTimelineStepAnalogFailureWorkflow.recipient?.denomination} assolutamente fallimentare.`,
    });
  });
});
