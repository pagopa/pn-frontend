import { getTimelineElem, notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { initLocalizationForTest } from '../../../test-utils';
import { TimelineCategory } from '../../../types';
import { AnalogFailureWorkflowStep } from '../AnalogFailureWorkflowStep';

const timelineElem = getTimelineElem(TimelineCategory.ANALOG_FAILURE_WORKFLOW, {});
const payload = {
  step: timelineElem,
  recipient: notificationToFe.recipients[0],
  isMultiRecipient: false,
};

describe('AnalogFailureWorkflowStep', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('test getTimelineStepInfo', () => {
    // mono recipient
    const analogFailureWorkflowStep = new AnalogFailureWorkflowStep();
    expect(analogFailureWorkflowStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.analog-failure-workflow`,
      description: `notifiche - detail.timeline.analog-failure-workflow-description - ${JSON.stringify(
        analogFailureWorkflowStep.nameAndTaxId(payload)
      )}`,
    });
    // multi recipient
    expect(
      analogFailureWorkflowStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.analog-failure-workflow`,
      description: `notifiche - detail.timeline.analog-failure-workflow-description-multirecipient - ${JSON.stringify(
        analogFailureWorkflowStep.nameAndTaxId(payload)
      )}`,
    });
  });
});
