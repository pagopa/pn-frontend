import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { TimelineCategory } from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { initLocalizationExists } from '../../localization.utility';
import { AnalogFailureWorkflowStep } from '../AnalogFailureWorkflowStep';

const timelineElem = getTimelineElem(TimelineCategory.ANALOG_FAILURE_WORKFLOW, {});
const payload = {
  step: timelineElem,
  recipient: notificationDTO.recipients[0],
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

  it('test getTimelineStepInfo with monorecipient title', () => {
    const analogFailureWorkflowStep = new AnalogFailureWorkflowStep();
    try {
      initLocalizationExists(
        (_ns, path) =>
          path === 'detail.timeline.analog-failure-workflow-monorecipient' ||
          path === 'detail.timeline.analog-failure-workflow-description-delegate'
      );
      // mono recipient, direct view
      expect(analogFailureWorkflowStep.getTimelineStepInfo(payload)).toStrictEqual({
        label: `notifiche - detail.timeline.analog-failure-workflow-monorecipient`,
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
      // delegate
      expect(
        analogFailureWorkflowStep.getTimelineStepInfo({
          ...payload,
          delegatorName: 'Test Delegator',
        })
      ).toStrictEqual({
        label: `notifiche - detail.timeline.analog-failure-workflow`,
        description: `notifiche - detail.timeline.analog-failure-workflow-description-delegate - ${JSON.stringify(
          { ...analogFailureWorkflowStep.nameAndTaxId(payload), recipient: 'Test Delegator' }
        )}`,
      });
    } finally {
      initLocalizationExists(() => false);
    }
  });
});
