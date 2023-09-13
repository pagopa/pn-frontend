import {
  mockTimelineStepSendAnalogDomicile890,
  mockTimelineStepSendAnalogDomicileAR,
} from '../../../__mocks__/TimelineStep.mock';
import { AnalogWorkflowDetails } from '../../../types';
import { SendAnalogDomicileStep } from '../SendAnalogDomicileStep';

describe('SendAnalogDomicileStep', () => {
  it('test getTimelineStepInfo with serviceLevel REGISTERED_LETTER_890', () => {
    const sendAnalogDomicileStep = new SendAnalogDomicileStep();

    expect(
      sendAnalogDomicileStep.getTimelineStepInfo(mockTimelineStepSendAnalogDomicile890)
    ).toStrictEqual({
      label: 'Invio via raccomandata 890',
      description: `È in corso l'invio della notifica a ${
        mockTimelineStepSendAnalogDomicile890.recipient?.denomination
      } all'indirizzo ${
        (mockTimelineStepSendAnalogDomicile890.step.details as AnalogWorkflowDetails)
          .physicalAddress?.address
      } tramite raccomandata 890.`,
    });
  });

  it('test getTimelineStepInfo with different serviceLevel', () => {
    const sendAnalogDomicileStep = new SendAnalogDomicileStep();

    expect(
      sendAnalogDomicileStep.getTimelineStepInfo(mockTimelineStepSendAnalogDomicileAR)
    ).toStrictEqual({
      label: 'Invio via raccomandata A/R',
      description: `È in corso l'invio della notifica a ${
        mockTimelineStepSendAnalogDomicileAR.recipient?.denomination
      } all'indirizzo ${
        (mockTimelineStepSendAnalogDomicileAR.step.details as AnalogWorkflowDetails).physicalAddress
          ?.address
      } tramite raccomandata A/R.`,
    });
  });
});
