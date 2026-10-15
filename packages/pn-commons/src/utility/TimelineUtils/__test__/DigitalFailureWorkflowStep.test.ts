import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { TimelineCategory } from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { DigitalFailureWorkflowStep } from '../DigitalFailureWorkflowStep';

describe('DigitalFailureWorkflowStep', () => {
  const timelineStep = new DigitalFailureWorkflowStep();

  beforeAll(() => {
    initLocalizationForTest();
  });

  it('returns the localized label and description for a single recipient', () => {
    const recipient = notificationDTO.recipients[0];
    const payload = {
      step: getTimelineElem(TimelineCategory.DIGITAL_FAILURE_WORKFLOW, {
        recIndex: 0,
      }),
      recipient,
      isMultiRecipient: false,
    };

    expect(timelineStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: 'notifiche - detail.timeline.digital-failure-workflow',
      description:
        'notifiche - detail.timeline.digital-failure-workflow-description - ' +
        JSON.stringify({
          name: recipient.denomination,
          taxId: `(${recipient.taxId})`,
        }),
    });
  });

  it('uses the multi-recipient description when necessary', () => {
    const recipient = notificationDTO.recipients[0];
    const payload = {
      step: getTimelineElem(TimelineCategory.DIGITAL_FAILURE_WORKFLOW, {
        recIndex: 0,
      }),
      recipient,
      isMultiRecipient: true,
    };

    expect(timelineStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: 'notifiche - detail.timeline.digital-failure-workflow',
      description:
        'notifiche - detail.timeline.digital-failure-workflow-description-multirecipient - ' +
        JSON.stringify({
          name: recipient.denomination,
          taxId: `(${recipient.taxId})`,
        }),
    });
  });
});
