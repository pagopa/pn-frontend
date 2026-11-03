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

  it('resolves digital source from elementId when details source is missing', () => {
    const history = [
      historyItem({
        steps: [
          step({
            elementId: 'SEND_DIGITAL_FEEDBACK.SOURCE_SPECIAL.RETRY_0',
            details: {
              responseStatus: ResponseStatus.OK,
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
        source: DigitalSource.SENDER,
        domicileType: DigitalDomicileType.PEC,
      },
    });
  });

  it('returns DIGITAL with null source when no valid source is available', () => {
    const history = [
      historyItem({
        steps: [
          step({
            elementId: 'SEND_DIGITAL_FEEDBACK.RETRY_0',
            details: {
              responseStatus: ResponseStatus.OK,
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
        source: null,
        domicileType: DigitalDomicileType.PEC,
      },
    });
  });

  it('ignores non-OK digital feedback when resolving delivery outcome', () => {
    const history = [
      historyItem({
        steps: [
          step({
            details: {
              responseStatus: ResponseStatus.KO,
              digitalAddressSource: DigitalSource.PLATFORM,
              digitalAddress: { type: DigitalDomicileType.PEC },
            },
          }),
        ],
      }),
    ];

    const parser = StatusHistoryParser.parse(history);

    expect(parser.resolveDeliveryOutcome()).toBeNull();
  });

  it('uses the first OK digital feedback when multiple feedback events are present', () => {
    const history = [
      historyItem({
        steps: [
          step({
            details: {
              responseStatus: ResponseStatus.KO,
              digitalAddressSource: DigitalSource.PLATFORM,
              digitalAddress: { type: DigitalDomicileType.PEC },
            },
          }),
          step({
            details: {
              responseStatus: ResponseStatus.OK,
              digitalAddressSource: DigitalSource.SENDER,
              digitalAddress: { type: DigitalDomicileType.SERCQ },
            },
          }),
          step({
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
        source: DigitalSource.SENDER,
        domicileType: DigitalDomicileType.SERCQ,
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
