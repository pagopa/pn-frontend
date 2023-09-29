import { getTimelineElem, notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { initLocalizationForTest } from '../../../test-utils';
import { TimelineCategory } from '../../../types';
import { ScheduleDigitalWorkflowStep } from '../ScheduleDigitalWorkflowStep';

const timelineElem = getTimelineElem(TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW, {});
const payload = {
  step: timelineElem,
  recipient: notificationToFe.recipients[0],
  isMultiRecipient: false,
};

describe('ScheduleDigitalWorkflowStep', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('test getTimelineStepInfo', () => {
    // mono recipient
    const scheduleDigitalWorkflowStep = new ScheduleDigitalWorkflowStep();
    expect(scheduleDigitalWorkflowStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.schedule-digital-workflow`,
      description: `notifiche - detail.timeline.schedule-digital-workflow-description - ${JSON.stringify(
        scheduleDigitalWorkflowStep.nameAndTaxId(payload)
      )}`,
    });
    // multi recipient
    expect(
      scheduleDigitalWorkflowStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.schedule-digital-workflow`,
      description: `notifiche - detail.timeline.schedule-digital-workflow-description-multirecipient - ${JSON.stringify(
        scheduleDigitalWorkflowStep.nameAndTaxId(payload)
      )}`,
    });
  });
});
