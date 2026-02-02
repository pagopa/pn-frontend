import type { DigitalDomicileType } from '@pagopa-pn/pn-commons';

export const DeliveryOutcomeType = {
  ANALOG: 'ANALOG',
  DIGITAL_FAILURE: 'DIGITAL_FAILURE',
  DIGITAL: 'DIGITAL',
  VIEWED: 'VIEWED',
} as const;

export type DeliveryOutcomeType = (typeof DeliveryOutcomeType)[keyof typeof DeliveryOutcomeType];

export const DigitalSource = {
  PLATFORM: 'PLATFORM',
  SENDER: 'SPECIAL',
  REGISTRY: 'GENERAL',
} as const;

export type DigitalSource = (typeof DigitalSource)[keyof typeof DigitalSource];

export type DigitalDomicileChannel = DigitalDomicileType.PEC | DigitalDomicileType.SERCQ;

export type DeliveryOutcome =
  | { type: typeof DeliveryOutcomeType.ANALOG }
  | { type: typeof DeliveryOutcomeType.DIGITAL_FAILURE }
  | { type: typeof DeliveryOutcomeType.VIEWED }
  | {
      type: typeof DeliveryOutcomeType.DIGITAL;
      details: {
        source: DigitalSource | null;
        domicileType: DigitalDomicileChannel | null;
      };
    };
