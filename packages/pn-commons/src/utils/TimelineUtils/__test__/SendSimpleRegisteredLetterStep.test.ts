import { mockTimelineStepAnalogFailureWorkflow } from '../../../__mocks__/TimelineStep.mock';
import { AnalogWorkflowDetails } from '../../../types';
import { SendSimpleRegisteredLetterStep } from '../SendSimpleRegisteredLetterStep';

describe('SendSimpleRegisteredLetterStep', () => {
  it('test getTimelineStepInfo', () => {
    const sendSimpleRegisteredLetterStep = new SendSimpleRegisteredLetterStep();

    expect(
      sendSimpleRegisteredLetterStep.getTimelineStepInfo(mockTimelineStepAnalogFailureWorkflow)
    ).toStrictEqual({
      label: 'Invio via raccomandata semplice',
      description: `È in corso l'invio della notifica a ${
        mockTimelineStepAnalogFailureWorkflow.recipient?.denomination
      } all'indirizzo ${
        (mockTimelineStepAnalogFailureWorkflow.step.details as AnalogWorkflowDetails)
          .physicalAddress?.address
      } tramite raccomandata semplice.`,
    });
  });
});
