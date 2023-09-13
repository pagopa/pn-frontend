import { mockTimelineStepSendDigitalWorkflow } from '../../../__mocks__/TimelineStep.mock';
import { ScheduleDigitalWorkflowStep } from '../ScheduleDigitalWorkflowStep';

describe('ScheduleDigitalWorkflowStep', () => {
  it('test getTimelineStepInfo', () => {
    const scheduleDigitalWorkflowStep = new ScheduleDigitalWorkflowStep();

    expect(
      scheduleDigitalWorkflowStep.getTimelineStepInfo(mockTimelineStepSendDigitalWorkflow)
    ).toStrictEqual({
      label: 'Invio per via digitale in preparazione',
      description: `L'invio della notifica per via digitale a Ada Lovelace è in preparazione.`,
    });
  });
});
