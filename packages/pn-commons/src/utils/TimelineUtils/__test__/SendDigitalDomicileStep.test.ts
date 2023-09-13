import _ from 'lodash';

import { mockTimelineStepSendDigitalDomicile } from '../../../__mocks__/TimelineStep.mock';
import { DigitalWorkflowDetails } from '../../../types';
import { SendDigitalDomicileStep } from '../SendDigitalDomicileStep';

describe('SendDigitalDomicileStep', () => {
  it('test getTimelineStepInfo without digitalAddress data', () => {
    const sendDigitalDomicileStep = new SendDigitalDomicileStep();
    let cloneMockTimelineStepSendDigitalDomicile = _.cloneDeep(mockTimelineStepSendDigitalDomicile);
    (
      cloneMockTimelineStepSendDigitalDomicile.step.details as DigitalWorkflowDetails
    ).digitalAddress = undefined;
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo(cloneMockTimelineStepSendDigitalDomicile)
    ).toStrictEqual(null);
  });

  it('test getTimelineStepInfo with digitalAddress data', () => {
    const sendDigitalDomicileStep = new SendDigitalDomicileStep();
    const digitalAddress = (
      mockTimelineStepSendDigitalDomicile.step.details as DigitalWorkflowDetails
    ).digitalAddress;
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo(mockTimelineStepSendDigitalDomicile)
    ).toStrictEqual({
      label: `Invio via PEC`,
      description: `È in corso l'invio della notifica a ${mockTimelineStepSendDigitalDomicile.recipient?.denomination} all'indirizzo PEC ${digitalAddress?.address}`,
    });
  });
});
