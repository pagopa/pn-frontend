import { DigitalSource, type DigitalSource as DigitalSourceType } from './StatusHistory/types';

type TimelineDigitalAddressSourceParams = {
  digitalAddressSource?: unknown;
  elementId?: string | null;
};

const DIGITAL_SOURCES = new Set<string>(Object.values(DigitalSource));

const isDigitalSource = (value: unknown): value is DigitalSourceType =>
  typeof value === 'string' && DIGITAL_SOURCES.has(value);

const parseDigitalSourceFromElementId = (
  elementId: string | null | undefined
): DigitalSourceType | null => {
  if (!elementId) {
    return null;
  }

  const match = /\.SOURCE_([A-Z_]+)\./.exec(elementId);
  if (!match) {
    return null;
  }

  const token = match[1];
  return isDigitalSource(token) ? token : null;
};

export const resolveTimelineDigitalAddressSource = ({
  digitalAddressSource,
  elementId,
}: TimelineDigitalAddressSourceParams): DigitalSourceType | null => {
  if (isDigitalSource(digitalAddressSource)) {
    return digitalAddressSource;
  }
  return parseDigitalSourceFromElementId(elementId);
};
