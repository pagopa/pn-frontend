import { describe, expect, it } from 'vitest';

import { TimelineCategory } from '../../models/NotificationDetail';
import { NotificationTimelineEvent } from '../../models/NotificationTimeline';
import { buildPecTimelineSections } from '../pecTimeline.utility';

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

describe('buildPecTimelineSections', () => {
  it('groups events belonging to the same PEC address', () => {
    const first = createEvent(
      'FIRST',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      'a@pec.it',
      'SPECIAL'
    );
    const second = createEvent('SECOND', TimelineCategory.SEND_DIGITAL_PROGRESS, 'a@pec.it');
    const third = createEvent('THIRD', TimelineCategory.SEND_DIGITAL_FEEDBACK, 'a@pec.it');

    expect(buildPecTimelineSections([first, second, third])).toEqual([
      {
        kind: 'address',
        address: 'a@pec.it',
        source: 'SPECIAL',
        events: [first, second, third],
      },
    ]);
  });

  it('keeps different PEC addresses in separate groups', () => {
    const first = createEvent(
      'FIRST',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      'a@pec.it',
      'SPECIAL'
    );
    const second = createEvent(
      'SECOND',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      'b@pec.it',
      'PLATFORM'
    );

    expect(buildPecTimelineSections([first, second])).toEqual([
      {
        kind: 'address',
        address: 'a@pec.it',
        source: 'SPECIAL',
        events: [first],
      },
      {
        kind: 'address',
        address: 'b@pec.it',
        source: 'PLATFORM',
        events: [second],
      },
    ]);
  });

  it('keeps general workflow events outside PEC groups', () => {
    const first = createEvent(
      'FIRST',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      'a@pec.it',
      'SPECIAL'
    );
    const workflow = createEvent('WORKFLOW', TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW);
    const second = createEvent('SECOND', TimelineCategory.SEND_DIGITAL_FEEDBACK, 'a@pec.it');

    expect(buildPecTimelineSections([first, workflow, second])).toEqual([
      {
        kind: 'address',
        address: 'a@pec.it',
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
    const event = createEvent('EVENT', TimelineCategory.SEND_DIGITAL_DOMICILE, 'a@pec.it', source);

    expect(buildPecTimelineSections([event])).toEqual([
      {
        kind: 'address',
        address: 'a@pec.it',
        source,
        events: [event],
      },
    ]);
  });

  it('recovers the source from a later event for the same address', () => {
    const feedback = createEvent('FEEDBACK', TimelineCategory.SEND_DIGITAL_FEEDBACK, 'a@pec.it');
    const domicile = createEvent(
      'DOMICILE',
      TimelineCategory.SEND_DIGITAL_DOMICILE,
      'a@pec.it',
      'GENERAL'
    );

    expect(buildPecTimelineSections([feedback, domicile])).toEqual([
      {
        kind: 'address',
        address: 'a@pec.it',
        source: 'GENERAL',
        events: [feedback, domicile],
      },
    ]);
  });

  it('uses a null source when the source cannot be determined', () => {
    const event = createEvent('UNKNOWN', TimelineCategory.SEND_DIGITAL_FEEDBACK, 'a@pec.it');

    expect(buildPecTimelineSections([event])).toEqual([
      {
        kind: 'address',
        address: 'a@pec.it',
        source: null,
        events: [event],
      },
    ]);
  });

  it('preserves event order when addresses are interleaved', () => {
    const a1 = createEvent('A1', TimelineCategory.SEND_DIGITAL_DOMICILE, 'a@pec.it', 'SPECIAL');
    const b1 = createEvent('B1', TimelineCategory.SEND_DIGITAL_DOMICILE, 'b@pec.it', 'PLATFORM');
    const a2 = createEvent('A2', TimelineCategory.SEND_DIGITAL_PROGRESS, 'a@pec.it');
    const b2 = createEvent('B2', TimelineCategory.SEND_DIGITAL_FEEDBACK, 'b@pec.it');

    const sections = buildPecTimelineSections([a1, b1, a2, b2]);

    expect(sections).toEqual([
      {
        kind: 'address',
        address: 'a@pec.it',
        source: 'SPECIAL',
        events: [a1, a2],
      },
      {
        kind: 'address',
        address: 'b@pec.it',
        source: 'PLATFORM',
        events: [b1, b2],
      },
    ]);
  });

  it('does not group non-digital events even if they contain an address', () => {
    const event = createEvent(
      'WORKFLOW',
      TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
      'a@pec.it',
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
