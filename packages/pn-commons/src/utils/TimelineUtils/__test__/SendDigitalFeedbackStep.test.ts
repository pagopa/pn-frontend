import _ from 'lodash';

import { mockTimelineStepSendDigitalFeedback } from '../../../__mocks__/TimelineStep.mock';
import { SendDigitalDetails } from '../../../types';
import { SendDigitalFeedbackStep } from '../SendDigitalFeedbackStep';

describe('SendDigitalFeedbackStep', () => {
  it('test getTimelineStepInfo with responseStatus OK', () => {
    const sendDigitalDomicileStep = new SendDigitalFeedbackStep();
    const digitalAddress = (mockTimelineStepSendDigitalFeedback.step.details as SendDigitalDetails)
      .digitalAddress;
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo(mockTimelineStepSendDigitalFeedback)
    ).toStrictEqual({
      label: `Invio via PEC riuscito`,
      description: `L'invio della notifica a ${mockTimelineStepSendDigitalFeedback.recipient?.denomination} all'indirizzo PEC ${digitalAddress?.address} è riuscito.`,
    });
  });

  it('test getTimelineStepInfo with responseStatus KO', () => {
    const sendDigitalDomicileStep = new SendDigitalFeedbackStep();
    let cloneMockTimelineStepSendDigitalFeedback = _.cloneDeep(mockTimelineStepSendDigitalFeedback);
    (cloneMockTimelineStepSendDigitalFeedback.step.details as SendDigitalDetails).responseStatus =
      'KO';
    const digitalAddress = (
      cloneMockTimelineStepSendDigitalFeedback.step.details as SendDigitalDetails
    ).digitalAddress;
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo(cloneMockTimelineStepSendDigitalFeedback)
    ).toStrictEqual({
      label: `Invio via PEC non riuscito`,
      description: `L'invio della notifica a ${cloneMockTimelineStepSendDigitalFeedback.recipient?.denomination} all'indirizzo PEC ${digitalAddress?.address} non è riuscito perché la casella è satura, non valida o inattiva.`,
    });
  });
});
