import {
  DigitalDomicileType,
  type INotificationDetailTimeline,
  NotificationStatus,
  type NotificationStatusHistory,
  ResponseStatus,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

import {
  type DeliveryOutcome,
  DeliveryOutcomeType,
  type DigitalDomicileChannel,
  DigitalSource,
  type DigitalSource as DigitalSourceType,
} from './types';

type ParsedStatusHistory = {
  categories: ReadonlySet<TimelineCategory>;
  firstOkDigitalFeedbackStep?: INotificationDetailTimeline;
  hasViewedStatus: boolean;
};

export class StatusHistoryParser {
  private static readonly DIGITAL_SOURCES = new Set<string>(Object.values(DigitalSource));

  private constructor(private readonly parsed: ParsedStatusHistory) {}

  static parse(
    statusHistory: Array<NotificationStatusHistory> | null | undefined
  ): StatusHistoryParser {
    const sanitizedHistory = statusHistory ?? [];
    const categories = new Set<TimelineCategory>();

    // eslint-disable-next-line functional/no-let
    let firstOkDigitalFeedbackStep: INotificationDetailTimeline | undefined;
    // eslint-disable-next-line functional/no-let
    let hasViewedStatus = false;

    for (const historyItem of sanitizedHistory) {
      if (historyItem.status === NotificationStatus.VIEWED) {
        hasViewedStatus = true;
      }

      const steps = historyItem.steps ?? [];
      for (const step of steps) {
        categories.add(step.category);

        if (!firstOkDigitalFeedbackStep && this.isSendDigitalFeedbackOk(step)) {
          firstOkDigitalFeedbackStep = step;
        }
      }
    }

    return new StatusHistoryParser({
      categories,
      firstOkDigitalFeedbackStep,
      hasViewedStatus,
    });
  }

  hasViewedStatus(): boolean {
    return this.parsed.hasViewedStatus;
  }

  hasCategory(category: TimelineCategory): boolean {
    return this.parsed.categories.has(category);
  }

  hasSimpleRegisteredLetter(): boolean {
    return this.hasCategory(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER);
  }

  resolveDeliveryOutcome(): DeliveryOutcome | null {
    if (this.hasCategory(TimelineCategory.SEND_ANALOG_DOMICILE)) {
      return { type: DeliveryOutcomeType.ANALOG };
    }

    if (this.hasSimpleRegisteredLetter()) {
      return { type: DeliveryOutcomeType.DIGITAL_FAILURE };
    }

    const okFeedbackStep = this.parsed.firstOkDigitalFeedbackStep;
    if (okFeedbackStep) {
      const source = StatusHistoryParser.resolveDigitalSource(okFeedbackStep);
      const domicileType = StatusHistoryParser.resolveDigitalDomicileType(okFeedbackStep);

      return {
        type: DeliveryOutcomeType.DIGITAL,
        details: { source, domicileType },
      };
    }

    if (this.parsed.hasViewedStatus) {
      return { type: DeliveryOutcomeType.VIEWED };
    }

    return null;
  }

  private static getDetails(step: INotificationDetailTimeline): any | null {
    const details = (step as any).details;
    return details && typeof details === 'object' ? details : null;
  }

  private static isSendDigitalFeedbackOk(step: INotificationDetailTimeline): boolean {
    if (step.category !== TimelineCategory.SEND_DIGITAL_FEEDBACK) {
      return false;
    }

    const details = this.getDetails(step);
    return details?.responseStatus === ResponseStatus.OK;
  }

  private static resolveDigitalSource(step: INotificationDetailTimeline): DigitalSourceType | null {
    const details = this.getDetails(step);
    const source = details?.digitalAddressSource;

    if (this.isDigitalSource(source)) {
      return source;
    }
    return this.parseDigitalSourceFromElementId(step.elementId);
  }

  private static parseDigitalSourceFromElementId(
    elementId: string | null | undefined
  ): DigitalSourceType | null {
    if (!elementId) {
      return null;
    }

    const match = /\.SOURCE_([A-Z_]+)\./.exec(elementId);
    if (!match) {
      return null;
    }

    const token = match[1];
    return this.isDigitalSource(token) ? token : null;
  }

  private static isDigitalSource(value: unknown): value is DigitalSourceType {
    return typeof value === 'string' && this.DIGITAL_SOURCES.has(value);
  }

  private static resolveDigitalDomicileType(
    step: INotificationDetailTimeline
  ): DigitalDomicileChannel | null {
    const details = this.getDetails(step);
    const addressType = details?.digitalAddress?.type;

    return addressType === DigitalDomicileType.PEC || addressType === DigitalDomicileType.SERCQ
      ? addressType
      : null;
  }
}
