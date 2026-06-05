import type {
  BooleanSuperPropertyEventData,
  PAHasPayload,
  PAHasProperty,
  YesNo,
} from '../../../models/PAEventPayloads';

export const mapBooleanToYesNo = (value: boolean): YesNo => (value ? 'yes' : 'no');

export const mapBooleanSuperPropertyToPayload = <K extends PAHasProperty>(
  property: K,
  { value }: BooleanSuperPropertyEventData
): PAHasPayload<K> =>
  ({
    [property]: mapBooleanToYesNo(value),
  } as PAHasPayload<K>);
