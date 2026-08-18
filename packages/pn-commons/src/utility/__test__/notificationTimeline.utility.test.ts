import { notificationTimelineDTO } from '../../__mocks__/NotificationTimeline.mock';
import { NotificationTimelineStep } from '../../models/NotificationTimeline';
import {
  flattenTimelineSteps,
  isTimelineGroupStep,
  toLegacyStatusHistory,
} from '../notificationTimeline.utility';

const [viewedStatus, deliveringStatus] = notificationTimelineDTO.notificationStatusHistory;

describe('notificationTimeline utility', () => {
  it('isTimelineGroupStep - discriminates the steps by stepType', () => {
    const eventStep: NotificationTimelineStep = viewedStatus.steps[0];
    const groupStep: NotificationTimelineStep = deliveringStatus.steps[0];

    expect(isTimelineGroupStep(eventStep)).toBe(false);
    expect(isTimelineGroupStep(groupStep)).toBe(true);
  });

  it('flattenTimelineSteps - unwraps the events of both event and group steps', () => {
    expect(flattenTimelineSteps(viewedStatus.steps)).toStrictEqual([
      viewedStatus.steps[0].stepType === 'EVENT' ? viewedStatus.steps[0].event : undefined,
    ]);

    const groupedEvents = deliveringStatus.steps.flatMap((step) =>
      isTimelineGroupStep(step) ? step.group.events : []
    );
    expect(flattenTimelineSteps(deliveringStatus.steps)).toStrictEqual(groupedEvents);
  });

  it('toLegacyStatusHistory - maps every status to the legacy model with flattened steps', () => {
    const legacyStatusHistory = toLegacyStatusHistory(
      notificationTimelineDTO.notificationStatusHistory
    );

    expect(legacyStatusHistory).toHaveLength(
      notificationTimelineDTO.notificationStatusHistory.length
    );
    expect(legacyStatusHistory[1]).toStrictEqual({
      status: deliveringStatus.status,
      activeFrom: deliveringStatus.activeFrom,
      relatedTimelineElements: [],
      deliveryMode: undefined,
      reworkedStatus: undefined,
      recipient: undefined,
      steps: flattenTimelineSteps(deliveringStatus.steps),
    });
  });
});
