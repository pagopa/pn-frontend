import { describe, expect, it } from 'vitest';

import { DigitalSource } from '../StatusHistory/types';
import { resolveTimelineDigitalAddressSource } from '../contacts.utility';

describe('resolveTimelineDigitalAddressSource', () => {
  it.each([DigitalSource.PLATFORM, DigitalSource.SENDER, DigitalSource.REGISTRY])(
    'returns the explicit digital address source %s',
    (digitalAddressSource) => {
      expect(resolveTimelineDigitalAddressSource({ digitalAddressSource })).toBe(
        digitalAddressSource
      );
    }
  );

  it('prefers a valid explicit source over a conflicting elementId', () => {
    expect(
      resolveTimelineDigitalAddressSource({
        digitalAddressSource: DigitalSource.PLATFORM,
        elementId: 'SEND_DIGITAL_FEEDBACK.SOURCE_SPECIAL.RETRY_0',
      })
    ).toBe(DigitalSource.PLATFORM);
  });

  it.each([
    ['PLATFORM', DigitalSource.PLATFORM],
    ['SPECIAL', DigitalSource.SENDER],
    ['GENERAL', DigitalSource.REGISTRY],
  ])('resolves SOURCE_%s from elementId when details source is missing', (token, expected) => {
    expect(
      resolveTimelineDigitalAddressSource({
        elementId: `SEND_DIGITAL_FEEDBACK.SOURCE_${token}.RETRY_0`,
      })
    ).toBe(expected);
  });

  it('falls back to elementId when the explicit source is invalid', () => {
    expect(
      resolveTimelineDigitalAddressSource({
        digitalAddressSource: 'UNKNOWN',
        elementId: 'SEND_DIGITAL_FEEDBACK.SOURCE_SPECIAL.RETRY_0',
      })
    ).toBe(DigitalSource.SENDER);
  });

  it.each([
    {},
    { digitalAddressSource: null, elementId: null },
    { digitalAddressSource: 'UNKNOWN', elementId: 'SEND_DIGITAL_FEEDBACK.RETRY_0' },
    { elementId: 'SEND_DIGITAL_FEEDBACK.SOURCE_UNKNOWN.RETRY_0' },
    { elementId: 'SEND_DIGITAL_FEEDBACK.SOURCE_SPECIAL' },
    { elementId: 'SEND_DIGITAL_FEEDBACK.SOURCE_special.RETRY_0' },
    { elementId: 'SEND_DIGITAL_FEEDBACK.SOURCE_SPECIAL_EXTRA.RETRY_0' },
  ])('returns null when no recognized source is available (%j)', (params) => {
    expect(resolveTimelineDigitalAddressSource(params)).toBeNull();
  });
});
