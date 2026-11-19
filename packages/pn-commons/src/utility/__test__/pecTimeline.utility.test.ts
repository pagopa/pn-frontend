import { describe, expect, it } from 'vitest';

import { TimelineCategory } from '../../models/NotificationDetail';
import { NotificationTimelineEvent } from '../../models/NotificationTimeline';
import { buildPecTimelineSections } from '../pecTimeline.utility';

const PEC_ADDRESS = 'recipient@example.test';
const OTHER_PEC_ADDRESS = 'other@example.test';

const createEvent = (
  id: string,
  category: TimelineCategory,
  address?: string,
  source?: string
): NotificationTimelineEvent =>
  ({
    elementId: `${id}.SOURCE_${source ?? 'UNKNOWN'}.REPEAT_false`,
    category,
    timestamp: '2026-10-22T10:00:00Z',
    isHidden: false,
    details: address
      ? {
          digitalAddress: { type: 'PEC', address },
          ...(source ? { digitalAddressSource: source } : {}),
        }
      : {},
    legalFactsIds: [],
  } as unknown as NotificationTimelineEvent);

const createFeedback = (id: string, address: string, source: string): NotificationTimelineEvent => {
  const event = createEvent(id, TimelineCategory.SEND_DIGITAL_FEEDBACK, address);

  return {
    ...event,
    elementId: `${id}.SOURCE_${source}.REPEAT_false`,
  };
};

describe('buildPecTimelineSections', () => {
  it('groups events belonging to the same PEC address and source', () => {
    const first = createEvent(
      'FIRST',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'SPECIAL'
    );
    const second = createEvent(
      'SECOND',
      TimelineCategory.SEND_DIGITAL_PROGRESS,
      PEC_ADDRESS,
      'SPECIAL'
    );
    const third = createFeedback('THIRD', PEC_ADDRESS, 'SPECIAL');

    expect(buildPecTimelineSections([first, second, third])).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'SPECIAL',
        events: [first, second, third],
      },
    ]);
  });

  it('keeps different PEC addresses in separate groups', () => {
    const first = createEvent(
      'FIRST',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'SPECIAL'
    );
    const second = createEvent(
      'SECOND',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      OTHER_PEC_ADDRESS,
      'PLATFORM'
    );

    expect(buildPecTimelineSections([first, second])).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'SPECIAL',
        events: [first],
      },
      {
        kind: 'address',
        address: OTHER_PEC_ADDRESS,
        source: 'PLATFORM',
        events: [second],
      },
    ]);
  });

  it('separates events sent to the same PEC address from different sources', () => {
    const specialFeedback = createFeedback('SPECIAL_FEEDBACK', PEC_ADDRESS, 'SPECIAL');
    const specialProgress = createEvent(
      'SPECIAL_PROGRESS',
      TimelineCategory.SEND_DIGITAL_PROGRESS,
      PEC_ADDRESS,
      'SPECIAL'
    );
    const specialDomicile = createEvent(
      'SPECIAL_DOMICILE',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'SPECIAL'
    );

    const platformFeedback = createFeedback('PLATFORM_FEEDBACK', PEC_ADDRESS, 'PLATFORM');
    const platformProgress = createEvent(
      'PLATFORM_PROGRESS',
      TimelineCategory.SEND_DIGITAL_PROGRESS,
      PEC_ADDRESS,
      'PLATFORM'
    );
    const platformDomicile = createEvent(
      'PLATFORM_DOMICILE',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'PLATFORM'
    );

    expect(
      buildPecTimelineSections([
        specialFeedback,
        specialProgress,
        specialDomicile,
        platformFeedback,
        platformProgress,
        platformDomicile,
      ])
    ).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'SPECIAL',
        events: [specialFeedback, specialProgress, specialDomicile],
      },
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'PLATFORM',
        events: [platformFeedback, platformProgress, platformDomicile],
      },
    ]);
  });

  it('keeps general workflow events outside PEC groups', () => {
    const first = createEvent(
      'FIRST',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'SPECIAL'
    );
    const workflow = createEvent('WORKFLOW', TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW);
    const second = createFeedback('SECOND', PEC_ADDRESS, 'SPECIAL');

    expect(buildPecTimelineSections([first, workflow, second])).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'SPECIAL',
        events: [first, second],
      },
      {
        kind: 'general',
        event: workflow,
      },
    ]);
  });

  it('does not group digital events without a PEC address', () => {
    const event = createEvent('NO_ADDRESS', TimelineCategory.SEND_DIGITAL_FEEDBACK);

    expect(buildPecTimelineSections([event])).toEqual([{ kind: 'general', event }]);
  });

  it.each([['PLATFORM'], ['SPECIAL'], ['GENERAL']])('resolves the %s PEC source', (source) => {
    const event = createEvent('EVENT', TimelineCategory.SEND_DIGITAL_DOMICILE, PEC_ADDRESS, source);

    expect(buildPecTimelineSections([event])).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source,
        events: [event],
      },
    ]);
  });

  it('resolves feedback sources from elementId when details have no source', () => {
    const feedback = createFeedback('FEEDBACK', PEC_ADDRESS, 'GENERAL');
    const domicile = createEvent(
      'DOMICILE',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'GENERAL'
    );

    expect(buildPecTimelineSections([feedback, domicile])).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'GENERAL',
        events: [feedback, domicile],
      },
    ]);
  });

  it('keeps unknown and known sources in separate sections', () => {
    const feedback = createEvent('FEEDBACK', TimelineCategory.SEND_DIGITAL_FEEDBACK, PEC_ADDRESS);
    const domicile = createEvent(
      'DOMICILE',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'GENERAL'
    );

    expect(buildPecTimelineSections([feedback, domicile])).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: null,
        events: [feedback],
      },
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'GENERAL',
        events: [domicile],
      },
    ]);
  });

  it('uses a null source when the source cannot be determined', () => {
    const event = createEvent('UNKNOWN', TimelineCategory.SEND_DIGITAL_FEEDBACK, PEC_ADDRESS);

    expect(buildPecTimelineSections([event])).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: null,
        events: [event],
      },
    ]);
  });

  it('preserves section and event order when address-source pairs are interleaved', () => {
    const special1 = createEvent(
      'SPECIAL_1',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'SPECIAL'
    );
    const platform1 = createEvent(
      'PLATFORM_1',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'PLATFORM'
    );
    const special2 = createFeedback('SPECIAL_2', PEC_ADDRESS, 'SPECIAL');
    const platform2 = createFeedback('PLATFORM_2', PEC_ADDRESS, 'PLATFORM');

    expect(buildPecTimelineSections([special1, platform1, special2, platform2])).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'SPECIAL',
        events: [special1, special2],
      },
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'PLATFORM',
        events: [platform1, platform2],
      },
    ]);
  });

  it('does not mutate the input events or their order', () => {
    const first = createEvent(
      'FIRST',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      PEC_ADDRESS,
      'SPECIAL'
    );
    const second = createFeedback('SECOND', PEC_ADDRESS, 'SPECIAL');
    const events = Object.freeze([first, second]);

    Object.freeze(first);
    Object.freeze(second);

    const sections = buildPecTimelineSections(
      events as unknown as Array<NotificationTimelineEvent>
    );

    expect(sections).toEqual([
      {
        kind: 'address',
        address: PEC_ADDRESS,
        source: 'SPECIAL',
        events: [first, second],
      },
    ]);
    expect(events).toEqual([first, second]);
  });

  it('does not group non-digital events even if they contain an address', () => {
    const event = createEvent(
      'WORKFLOW',
      TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
      PEC_ADDRESS,
      'SPECIAL'
    );

    expect(buildPecTimelineSections([event])).toEqual([{ kind: 'general', event }]);
  });

  it('preserves hidden workflow events without associating them with a PEC', () => {
    const event = {
      ...createEvent('FAILURE', TimelineCategory.DIGITAL_FAILURE_WORKFLOW),
      isHidden: true,
    };

    expect(buildPecTimelineSections([event])).toEqual([{ kind: 'general', event }]);
  });

  it('returns no sections when there are no events', () => {
    expect(buildPecTimelineSections([])).toEqual([]);
  });
});
