import { describe, expect, it } from 'vitest';

import {
  DigitalDomicileType,
  NotificationStatus,
  ResponseStatus,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

import { StatusHistoryParser } from '../parser';
import { DeliveryOutcomeType, DigitalSource } from '../types';

const step = (overrides: any) => ({
  category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
  details: {},
  ...overrides,
});

const historyItem = (overrides: any) => ({
  status: undefined,
  steps: [],
  ...overrides,
});

describe('StatusHistoryParser', () => {
  it('returns ANALOG if SEND_ANALOG_DOMICILE is present', () => {
    const history = [
      historyItem({
        status: NotificationStatus.VIEWED,
        steps: [step({ category: TimelineCategory.SEND_ANALOG_DOMICILE })],
      }),
    ];

    const parser = StatusHistoryParser.parse(history);
    expect(parser.resolveDeliveryOutcome()).toEqual({ type: DeliveryOutcomeType.ANALOG });
  });

  it('returns DIGITAL_FAILURE if SEND_SIMPLE_REGISTERED_LETTER is present', () => {
    const history = [
      historyItem({
        status: NotificationStatus.VIEWED,
        steps: [step({ category: TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER })],
      }),
    ];

    const parser = StatusHistoryParser.parse(history);
    expect(parser.hasSimpleRegisteredLetter()).toBe(true);
    expect(parser.resolveDeliveryOutcome()).toEqual({ type: DeliveryOutcomeType.DIGITAL_FAILURE });
  });

  it('returns DIGITAL with details when an OK SEND_DIGITAL_FEEDBACK is present', () => {
    const history = [
      historyItem({
        steps: [
          step({
            category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
            details: {
              responseStatus: ResponseStatus.OK,
              digitalAddressSource: DigitalSource.PLATFORM,
              digitalAddress: { type: DigitalDomicileType.PEC },
            },
          }),
        ],
      }),
    ];

    const parser = StatusHistoryParser.parse(history);

    expect(parser.resolveDeliveryOutcome()).toEqual({
      type: DeliveryOutcomeType.DIGITAL,
      details: {
        source: DigitalSource.PLATFORM,
        domicileType: DigitalDomicileType.PEC,
      },
    });
  });

  it('returns VIEWED if only VIEWED is present and no explicit channel outcome exists', () => {
    const history = [
      historyItem({
        status: NotificationStatus.VIEWED,
        steps: [],
      }),
    ];

    const parser = StatusHistoryParser.parse(history);
    expect(parser.hasViewedStatus()).toBe(true);
    expect(parser.resolveDeliveryOutcome()).toEqual({ type: DeliveryOutcomeType.VIEWED });
  });

  it('returns null if history is empty/null', () => {
    expect(StatusHistoryParser.parse(null).resolveDeliveryOutcome()).toBeNull();
    expect(StatusHistoryParser.parse([]).resolveDeliveryOutcome()).toBeNull();
  });
});
