/* eslint-disable sonarjs/cognitive-complexity */

/* eslint-disable complexity */

/* eslint-disable functional/immutable-data */
import { isNil } from 'lodash-es';

import { MIChipProps } from '@pagopa/mui-italia';

import {
  AnalogWorkflowDetails,
  ExtRegistriesPaymentDetails,
  F24PaymentDetails,
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDeliveryMode,
  NotificationDetailDocument,
  NotificationDetailOtherDocument,
  NotificationDetailRecipient,
  NotificationPayment,
  NotificationStatusHistory,
  NotificationViewedDetails,
  PagoPAPaymentFullDetails,
  PaymentDetails,
  PaymentStatus,
  ResponseStatus,
  SendDigitalDetails,
  SendPaperDetails,
  TimelineCategory,
} from '../models/NotificationDetail';
import { NotificationStatus } from '../models/NotificationStatus';
import {
  NotificationPaymentTimeline,
  NotificationPaymentTimelineElement,
} from '../models/NotificationTimeline';
import { getLocalizedOrDefaultLabel, hasLocalizedLabel } from '../utility/localization.utility';
import { TimelineStepInfo } from './TimelineUtils/TimelineStep';
import { TimelineStepFactory } from './TimelineUtils/TimelineStepFactory';
import { formatDate } from './date.utility';

type StatusInfo = {
  label: string;
  tooltip: string;
  description: string;
};

type StatusInfoWithColor = StatusInfo & {
  color: MIChipProps['color'];
};

type StatusViewer = 'as-delegate' | 'by-delegate' | 'by-other-delegate' | 'by-recipient';

type StatusLocalizationData = { [key: string]: string | undefined };

type ViewedVariantOptions = {
  statusObject?: NotificationStatusHistory;
  isMultiRecipient?: boolean;
  mandateId?: string;
  delegatorName?: string;
  userTaxId?: string;
};

const statusLocalizationNames = {
  [NotificationStatus.IN_VALIDATION]: 'in-validation',
  [NotificationStatus.ACCEPTED]: 'accepted',
  [NotificationStatus.DELIVERING]: 'delivering',
  [NotificationStatus.DELIVERED]: 'delivered',
  [NotificationStatus.VIEWED]: 'viewed',
  [NotificationStatus.EFFECTIVE_DATE]: 'effective-date',
  [NotificationStatus.PAID]: 'paid',
  [NotificationStatus.UNREACHABLE]: 'unreachable',
  [NotificationStatus.CANCELLED]: 'canceled',
  [NotificationStatus.REFUSED]: 'refused',
  [NotificationStatus.RETURNED_TO_SENDER]: 'returned-to-sender',
  [NotificationStatus.NOTIFICATION_TIMELINE_REWORKED]: 'notification-timeline-reworked',
  [NotificationStatus.CANCELLATION_IN_PROGRESS]: 'cancellation-in-progress',
} as const satisfies Record<NotificationStatus, string>;

function viewedByVariant({
  statusObject,
  isMultiRecipient,
  mandateId,
  delegatorName,
  userTaxId,
}: ViewedVariantOptions): { viewer: StatusViewer; data: StatusLocalizationData } | undefined {
  const viewedEvent = statusObject?.steps?.find(
    (step) => step.category === TimelineCategory.NOTIFICATION_VIEWED
  );
  const delegateInfo = (viewedEvent?.details as NotificationViewedDetails | undefined)
    ?.delegateInfo;
  const delegateName = delegateInfo?.denomination ?? statusObject?.recipient;

  if (mandateId && delegatorName && userTaxId) {
    if (delegateInfo?.taxId === userTaxId) {
      return { viewer: 'as-delegate', data: { recipient: delegatorName } };
    }
    if (delegateName) {
      return {
        viewer: 'by-other-delegate',
        data: { name: delegateName, recipient: delegatorName },
      };
    }
    return isMultiRecipient
      ? undefined
      : { viewer: 'by-recipient', data: { recipient: delegatorName } };
  }

  return delegateName ? { viewer: 'by-delegate', data: { name: delegateName } } : undefined;
}

// Verifies whether at least one VIEWED event has a legal fact
function hasViewedLegalFact(statusObject?: NotificationStatusHistory): boolean {
  return !!statusObject?.steps?.some(
    (step) => step.category === TimelineCategory.NOTIFICATION_VIEWED && step.legalFactsIds?.length
  );
}

/**
 * Returns the localization keys for the DELIVERED status for PA.
 * @param statusObject The DELIVERED status history entry.
 * @param statusHistory The notification status history.
 * @returns The localization keys, or undefined when statusObject is unavailable.
 */
function getNotificationDeliveredInfosForPA(
  statusObject: NotificationStatusHistory | undefined,
  statusHistory: Array<NotificationStatusHistory>
): { labelKey: string; descriptionKey?: string } | undefined {
  if (!statusObject) {
    return undefined;
  }
  // the timeline event that tells us if there is a stock and its status can be in the DELIVERED status and also in the DELIVERING one.
  // we have to get the DELIVERING STATUS and get only those events that are cronologically before the DELIVERED status
  // for each status we have the activeFrom property that is the date from witch the status starts to take effect
  const activeFrom = new Date(statusObject.activeFrom);
  // the timeline can be corrected and so we can have multiple DELIVERED statuses
  // in this case we have to get only those DELIVERING events that are releated to the current DELIVERED status
  // to do this, we have to check if there is a DELIVERED status next to the current (beacuse the events are ordered from most recent to the oldest)
  const nextDeliveredStatus = statusHistory.find(
    (status) =>
      status.status === NotificationStatus.DELIVERED && new Date(status.activeFrom) < activeFrom
  );
  // calc when the next status starts to take effect
  const activeTo = nextDeliveredStatus ? new Date(nextDeliveredStatus.activeFrom) : null;
  // get delivering status and filter out those events that are from the date of delivered status activation
  // and the date of the next status activation (i.e. the date from witch the delivered status ends to take effect)
  const deliveringStatus = statusHistory.find(
    (history) => history.status === NotificationStatus.DELIVERING
  );
  const deliveringStepsBeforeDelivered = deliveringStatus?.steps?.filter((step) =>
    activeTo
      ? new Date(step.timestamp) <= activeFrom && new Date(step.timestamp) > activeTo
      : new Date(step.timestamp) <= activeFrom
  );
  const stepsToCheck = [...(statusObject.steps || []), ...(deliveringStepsBeforeDelivered ?? [])];
  const isStock = stepsToCheck.some(
    (step) =>
      (step.category === TimelineCategory.SEND_ANALOG_PROGRESS ||
        step.category === TimelineCategory.SEND_ANALOG_FEEDBACK) &&
      AnalogDeliveryCodeStock.has((step.details as SendPaperDetails).deliveryDetailCode ?? '')
  );
  const isWithdrawnStock = stepsToCheck.some(
    (step) =>
      (step.category === TimelineCategory.SEND_ANALOG_PROGRESS ||
        step.category === TimelineCategory.SEND_ANALOG_FEEDBACK) &&
      AnalogDeliveryCodeWithdrawnStock.has(
        (step.details as SendPaperDetails).deliveryDetailCode ?? ''
      )
  );
  const isExpiredStock = stepsToCheck.some(
    (step) =>
      (step.category === TimelineCategory.SEND_ANALOG_PROGRESS ||
        step.category === TimelineCategory.SEND_ANALOG_FEEDBACK) &&
      AnalogDeliveryCodeExpiredStock.has(
        (step.details as SendPaperDetails).deliveryDetailCode ?? ''
      )
  );
  // case giacenza
  if (isExpiredStock) {
    // case expired stock
    return {
      labelKey: 'status.delivered-expired-stock',
      descriptionKey: 'status.delivered-expired-stock-description',
    };
  } else if (isWithdrawnStock) {
    // case withdraw stock
    return {
      labelKey: 'status.delivered-withdrawn-stock',
      descriptionKey: 'status.delivered-withdrawn-stock-description',
    };
  } else if (isStock) {
    return {
      labelKey: 'status.delivered-stock',
      descriptionKey: 'status.delivered-stock-description',
    };
  } else {
    return { labelKey: 'status.delivered-monorecipient' };
  }
}

/**
 * Returns the localized information for the DELIVERED status.
 *
 * Uses the delivery-mode-specific description when the corresponding localization
 * exists, including the multi-recipient variant. Otherwise, it preserves the legacy
 * behavior for multi-recipient notifications, PA-specific statuses and delivery mode.
 *
 * @param isMultiRecipient Whether the notification has multiple recipients.
 * @param statusObject Status history entry containing delivery information.
 * @param options Status history, recipients and party context.
 * @returns The localized label, tooltip and description for the DELIVERED status.
 */
function deliveredStatusVariant(
  isMultiRecipient?: boolean,
  statusObject?: NotificationStatusHistory,
  options?: {
    statusHistory?: Array<NotificationStatusHistory>;
    recipients: Array<NotificationDetailRecipient | string>;
    isParty?: boolean;
    delegatorName?: string;
  }
): StatusInfo {
  const deliveryMode = statusObject?.deliveryMode;
  const delegatorName = options?.delegatorName;

  const context: StatusLocalizationContext = {
    isMultiRecipient,
    deliveryMode,
    isDelegate: !!(deliveryMode && delegatorName),
  };

  const description = resolveStatusLocalization(
    NotificationStatus.DELIVERED,
    'description',
    context
  );

  // eslint-disable-next-line functional/no-let
  let descriptionData: StatusLocalizationData | undefined;
  // eslint-disable-next-line functional/no-let
  let descriptionSelection = description;
  // eslint-disable-next-line functional/no-let
  let labelKey: string | undefined;

  if (description.variant.deliveryMode || description.variant.isDelegate || isMultiRecipient) {
    descriptionData = description.variant.isDelegate ? { recipient: delegatorName } : undefined;
  } else if (options?.isParty) {
    // if it is a PA, change the title and the description
    // ... only for single-recipient notifications!
    const paSelection = getNotificationDeliveredInfosForPA(
      statusObject,
      options.statusHistory || []
    );

    labelKey = paSelection?.labelKey;

    if (paSelection?.descriptionKey) {
      descriptionSelection = { ...description, key: paSelection.descriptionKey };
    }
  } else if (deliveryMode) {
    // if the deliveryMode is defined, then change the description for a more specific one ...
    // ... only for single-recipient notifications!
    const deliveryModeDescription = getLocalizedOrDefaultLabel(
      'notifications',
      `status.deliveryMode.${deliveryMode}`
    );

    descriptionData = { deliveryMode: deliveryModeDescription };
    descriptionSelection = {
      ...description,
      key: 'status.delivered-description-with-delivery-mode',
    };
  }

  return localizeStatus(
    NotificationStatus.DELIVERED,
    undefined,
    context,
    descriptionData,
    descriptionSelection,
    labelKey
  );
}

const AnalogDeliveryCodeStock = new Set(['RECRN003C', 'RECRN011', 'RECAG011A']);
const AnalogDeliveryCodeWithdrawnStock = new Set(['RECAG005C', 'RECAG006C']);
const AnalogDeliveryCodeExpiredStock = new Set(['RECAG008C', 'RECRN005C', 'PNAG012', 'PNRN012']);

type StatusLocalizationVariant = {
  deliveryMode?: NotificationDeliveryMode;
  isDelegate?: boolean;
  // Who performed the access recorded in the VIEWED event.
  viewer?: StatusViewer;
  legalFact?: 'with' | 'without';
};

type StatusLocalizationContext = StatusLocalizationVariant & { isMultiRecipient?: boolean };

type StatusLocalizationSelection = {
  key: string;
  variant: StatusLocalizationVariant;
  isMultiRecipient: boolean;
};

function statusLocalizationKey(
  status: NotificationStatus,
  part: keyof StatusInfo,
  isMultiRecipient?: boolean,
  variant?: StatusLocalizationVariant
): string {
  const suffix = isMultiRecipient ? '-multirecipient' : '';
  const partSuffix = part === 'label' ? '' : `-${part}`;
  const modeSuffix = variant?.deliveryMode ? `-${variant.deliveryMode}` : '';

  // eslint-disable-next-line functional/no-let
  let delegateSuffix = '';
  if (variant?.viewer) {
    delegateSuffix = `-${variant.viewer}`;
  } else if (variant?.isDelegate) {
    delegateSuffix = '-delegate';
  }

  const legalFactSuffix = variant?.legalFact ? `-${variant.legalFact}-legal-fact` : '';

  return `status.${statusLocalizationNames[status]}${partSuffix}${modeSuffix}${delegateSuffix}${legalFactSuffix}${suffix}`;
}

// Map non-canonical localization keys to their existing equivalents.
// New keys follow the canonial suffix order: mode, viewer/delegate, legal fact, multirecipient
const statusLocalizationAliases: Readonly<Record<string, string | undefined>> = {
  'status.viewed-description-as-delegate': 'status.viewed-as-delegate-description',
  'status.viewed-description-by-delegate': 'status.viewed-by-delegate-description',
  'status.viewed-description-by-other-delegate': 'status.viewed-by-other-delegate-description',
  'status.viewed-description-by-recipient': 'status.viewed-by-recipient-description',
  'status.viewed-description-without-legal-fact-multirecipient':
    'status.viewed-without-legal-fact-description-multirecipient',
  'status.returned-to-sender-description-with-legal-fact':
    'status.returned-to-sender-with-legal-fact-description',
};

/**
 * Selects the most specific available localization variant, retaining
 * the previous selection when a more specific key is unavailable.
 * Delegate/viewer and with-legal-fact variants also support standalone fallbacks.
 */
function resolveStatusLocalization(
  status: NotificationStatus,
  part: keyof StatusInfo,
  context: StatusLocalizationContext = {}
): StatusLocalizationSelection {
  // eslint-disable-next-line functional/no-let
  let selected: StatusLocalizationSelection = {
    key: statusLocalizationKey(status, part),
    variant: {},
    isMultiRecipient: false,
  };
  const select = (
    variant: StatusLocalizationVariant,
    isMultiRecipient: boolean
  ): StatusLocalizationSelection | undefined => {
    const key = statusLocalizationKey(status, part, isMultiRecipient, variant);

    if (hasLocalizedLabel('notifications', key)) {
      return { key, variant, isMultiRecipient };
    }

    const alias = statusLocalizationAliases[key];

    if (alias && hasLocalizedLabel('notifications', alias)) {
      return { key: alias, variant, isMultiRecipient };
    }

    return undefined;
  };

  if (context.isMultiRecipient) {
    selected = select({}, true) ?? selected;
  }
  if (context.deliveryMode) {
    // multi-recipient notifications do not fall back to single-recipient delivery-mode descriptions
    selected =
      select({ deliveryMode: context.deliveryMode }, !!context.isMultiRecipient) ?? selected;
  }
  if (context.legalFact) {
    const variant = { ...selected.variant, legalFact: context.legalFact };
    const selection = select(variant, selected.isMultiRecipient);
    if (selection) {
      selected = selection;
    } else if (context.legalFact === 'with' && selected.isMultiRecipient) {
      // the with-legal-fact variant can fll back to its standalone key
      selected = select({ legalFact: context.legalFact }, false) ?? selected;
    }
  }
  if (context.viewer || context.isDelegate) {
    const viewer = context.viewer ? { viewer: context.viewer } : { isDelegate: true };
    // if the combined variant is unavailable try the delegate/viewer variant without the multi-recipient suffix
    selected =
      select({ ...selected.variant, ...viewer }, selected.isMultiRecipient) ??
      select({ deliveryMode: context.deliveryMode, ...viewer }, false) ??
      selected;
  }
  return selected;
}

function localizeStatus(
  status: NotificationStatus,
  data?: StatusLocalizationData,
  context: StatusLocalizationContext = {},
  descriptionData?: StatusLocalizationData,
  descriptionSelection?: StatusLocalizationSelection,
  labelKey?: string
): StatusInfo {
  const interpolationData = data && Object.keys(data).length ? data : undefined;
  const baseContext = { isMultiRecipient: context.isMultiRecipient };
  const description =
    descriptionSelection ?? resolveStatusLocalization(status, 'description', context);

  const resolvedDescriptionData = (() => {
    if (description.variant.viewer || description.variant.isDelegate) {
      return descriptionData;
    }

    if (description.variant.legalFact) {
      return undefined;
    }

    // An explicitly selected description can use its own interpolation data.
    if (descriptionSelection) {
      return descriptionData ?? interpolationData;
    }

    return interpolationData;
  })();

  return {
    label: getLocalizedOrDefaultLabel(
      'notifications',
      labelKey ?? resolveStatusLocalization(status, 'label', baseContext).key
    ),
    tooltip: getLocalizedOrDefaultLabel(
      'notifications',
      resolveStatusLocalization(status, 'tooltip', baseContext).key,
      undefined,
      interpolationData
    ),
    description: getLocalizedOrDefaultLabel(
      'notifications',
      description.key,
      undefined,
      resolvedDescriptionData
    ),
  };
}

/**
 * Returns localized information for a notification status.
 * @param status The notification status or its history entry.
 * @param options Notification context, including recipients, status history and delegation.
 * @returns The localized label, tooltip, description and status color.
 */
export function getNotificationStatusInfos(
  status: NotificationStatus | NotificationStatusHistory,
  options?: {
    statusHistory?: Array<NotificationStatusHistory>;
    recipients: Array<NotificationDetailRecipient | string>;
    isParty?: boolean;
    mandateId?: string;
    delegatorName?: string;
    userTaxId?: string;
  }
): StatusInfoWithColor {
  const statusComesAsAnObject = !!(status as NotificationStatusHistory).status;
  const statusObject: NotificationStatusHistory | undefined = statusComesAsAnObject
    ? (status as NotificationStatusHistory)
    : undefined;
  const actualStatus: NotificationStatus = statusComesAsAnObject
    ? (status as NotificationStatusHistory).status
    : (status as NotificationStatus);
  const isMultiRecipient = options && options.recipients.length > 1;

  // the subject is either the recipient or (for the VIEWED)
  // the delegate who have seen the notification for first.
  // Hence the "let" is OK, in the particular cases inside the following switch statement
  // it will be reassigned if needed (i.e. if the value should reference a delegate instead).

  /* eslint-disable-next-line functional/no-let */
  let subject = getLocalizedOrDefaultLabel('notifications', `status.recipient`, 'destinatario');

  // beware!!
  // the isMultiRecipient attribute should be added to the context (when calling localizeStatus)
  // **only** if the tooltip and copy for a state should differ for multi-recipient notification.
  // If copy and tooltip are the same for the mono and multi-recipient cases,
  // then this attribute should **not** be sent, so that the default/mono literals will be taken.
  // ---------------------------------------------------
  // Carlos Lombardi, 2023.02.23

  switch (actualStatus) {
    case NotificationStatus.DELIVERED: {
      const statusInfos = deliveredStatusVariant(isMultiRecipient, statusObject, options);
      // set the color at the end to avoid a type error since the color is defined as an union among some well-known strings
      return { color: 'default', ...statusInfos };
    }
    case NotificationStatus.DELIVERING:
      return {
        color: 'default',
        ...localizeStatus(NotificationStatus.DELIVERING),
      };
    case NotificationStatus.UNREACHABLE: {
      const statusInfos = localizeStatus(
        NotificationStatus.UNREACHABLE,
        undefined,
        { isMultiRecipient, isDelegate: !!options?.delegatorName },
        options?.delegatorName ? { recipient: options.delegatorName } : undefined
      );

      return { color: 'error', ...statusInfos };
    }
    case NotificationStatus.PAID:
      return {
        color: 'success',
        ...localizeStatus(NotificationStatus.PAID),
      };
    case NotificationStatus.ACCEPTED:
      return {
        color: 'default',
        ...localizeStatus(NotificationStatus.ACCEPTED),
      };
    case NotificationStatus.EFFECTIVE_DATE: {
      // the status became active at the very moment the notification perfected, so `activeFrom` is
      // the date the revised copy asks for. The wording in the base catalog has no `{{date}}`, so
      // passing it is a no-op with the overlay off.
      const dateData = statusObject ? { date: formatDate(statusObject.activeFrom, false) } : {};
      const statusInfos = localizeStatus(
        NotificationStatus.EFFECTIVE_DATE,
        dateData,
        { isMultiRecipient, isDelegate: !!options?.delegatorName },
        options?.delegatorName ? { ...dateData, recipient: options.delegatorName } : undefined
      );
      return { color: 'info', ...statusInfos };
    }
    case NotificationStatus.VIEWED: {
      if (statusObject?.recipient) {
        subject = getLocalizedOrDefaultLabel(
          'notifications',
          `status.delegate`,
          `delegato ${statusObject.recipient}`,
          { name: statusObject.recipient }
        );
      }
      const viewer = viewedByVariant({
        statusObject,
        isMultiRecipient,
        mandateId: options?.mandateId,
        delegatorName: options?.delegatorName,
        userTaxId: options?.userTaxId,
      });
      return {
        color: 'success',
        ...localizeStatus(
          NotificationStatus.VIEWED,
          { subject },
          {
            isMultiRecipient,
            viewer: viewer?.viewer,
            legalFact: !hasViewedLegalFact(statusObject) ? 'without' : undefined,
          },
          viewer?.data
        ),
      };
    }
    case NotificationStatus.CANCELLED:
      return {
        color: 'warning',
        ...localizeStatus(NotificationStatus.CANCELLED),
      };
    case NotificationStatus.CANCELLATION_IN_PROGRESS:
      return {
        color: 'warning',
        ...localizeStatus(NotificationStatus.CANCELLATION_IN_PROGRESS),
      };
    case NotificationStatus.RETURNED_TO_SENDER:
      return {
        color: 'warning',
        ...localizeStatus(NotificationStatus.RETURNED_TO_SENDER, undefined, {
          isMultiRecipient,
          legalFact: hasViewedLegalFact(statusObject) ? 'with' : undefined,
        }),
      };
    case NotificationStatus.NOTIFICATION_TIMELINE_REWORKED:
      return {
        color: 'warning',
        ...localizeStatus(NotificationStatus.NOTIFICATION_TIMELINE_REWORKED),
      };
    default:
      return {
        color: 'default',
        label: 'Non definito',
        tooltip: 'Stato sconosciuto',
        description: 'Stato sconosciuto',
      };
  }
}

export const getNotificationAllowedStatus = () => [
  {
    value: 'All',
    label: getLocalizedOrDefaultLabel('notifications', 'status.all'),
  },
  {
    value: NotificationStatus.ACCEPTED,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      statusLocalizationKey(NotificationStatus.ACCEPTED, 'label')
    ),
  },
  {
    value: NotificationStatus.DELIVERING,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      statusLocalizationKey(NotificationStatus.DELIVERING, 'label')
    ),
  },
  {
    value: NotificationStatus.DELIVERED,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      statusLocalizationKey(NotificationStatus.DELIVERED, 'label')
    ),
  },
  {
    value: NotificationStatus.EFFECTIVE_DATE,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      statusLocalizationKey(NotificationStatus.EFFECTIVE_DATE, 'label')
    ),
  },
  {
    value: NotificationStatus.VIEWED,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      statusLocalizationKey(NotificationStatus.VIEWED, 'label')
    ),
  },
  {
    value: NotificationStatus.CANCELLED,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      statusLocalizationKey(NotificationStatus.CANCELLED, 'label')
    ),
  },
  {
    value: NotificationStatus.UNREACHABLE,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      statusLocalizationKey(NotificationStatus.UNREACHABLE, 'label')
    ),
  },
  {
    value: NotificationStatus.RETURNED_TO_SENDER,
    label: getLocalizedOrDefaultLabel(
      'notifications',
      statusLocalizationKey(NotificationStatus.RETURNED_TO_SENDER, 'label')
    ),
  },
];

function legalFactTypeForAnalogEvent(
  timelineStep: INotificationDetailTimeline,
  legalFactKey?: string
) {
  const attachments = (timelineStep.details as SendPaperDetails).attachments;
  const matchingAttachment = legalFactKey && attachments?.find((att) => att.url === legalFactKey);
  return matchingAttachment ? matchingAttachment.documentType : undefined;
}

/**
 * Get legalFact label based on timeline step and legalfact type.
 * @param {INotificationDetailTimeline} timelineStep Timeline step
 * @param {LegalFactType} legalFactType Legalfact type
 * @returns {string} attestation or receipt
 */
export function getLegalFactLabel(
  timelineStep: INotificationDetailTimeline,
  legalFactType?: LegalFactType | 'AAR',
  legalFactKey?: string
): string {
  const legalFactLabel = getLocalizedOrDefaultLabel(
    'notifications',
    `detail.legalfact`,
    'Attestazione opponibile a terzi'
  );
  const receiptLabel = getLocalizedOrDefaultLabel('notifications', `detail.receipt`, 'Ricevuta');
  // TODO: localize in pn_ga branch

  // To the moment the examples of legal facts associated to this
  // kind of events have ANALOG_DELIVERY as legalFactType, but I'm not sure this is OK,
  // I already asked to BE colleagues.
  // Moreover, I found no documentation which indicates
  // the legalFactType to expect for such events.
  // Hence I keep the condition on the category only.
  // -------------------------
  // Update as of 2023.04.21
  //
  // As far as the new specification seems to indicate,
  // the attachments for the analog flow will be always linked to
  // SEND_ANALOG_PROGRESS events and not to SEND_ANALOG_FEEDBACK ones.
  // As this is quite recent and maybe not that stable, I prefer to keep this code commented out
  // for a while
  // -------------------------
  // Carlos Lombardi
  // -------------------------
  // if (timelineStep.category === TimelineCategory.SEND_ANALOG_FEEDBACK) {
  //   if ((timelineStep.details as SendPaperDetails).responseStatus === ResponseStatus.OK) {
  //     return `${receiptLabel} ${getLocalizedOrDefaultLabel(
  //       'notifications',
  //       'detail.timeline.legalfact.paper-receipt-delivered',
  //       'di consegna raccomandata'
  //     )}`;
  //   } else if ((timelineStep.details as SendPaperDetails).responseStatus === ResponseStatus.KO) {
  //     return `${receiptLabel} ${getLocalizedOrDefaultLabel(
  //       'notifications',
  //       'detail.timeline.legalfact.paper-receipt-not-delivered',
  //       'di mancata consegna raccomandata'
  //     )}`;
  //   }
  //   return receiptLabel;

  // For the SEND_ANALOG_PROGRESS / SEND_SIMPLE_REGISTERED_LETTER_PROGRESS events,
  // the text depend on the kind of document ... that is not indicated in legalFactType,
  // but rather inside the "attachments" attribute present in the detail of the timeline step
  // -------------------------
  // Carlos Lombardi
  if (
    timelineStep.category === TimelineCategory.SEND_ANALOG_PROGRESS ||
    timelineStep.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS
  ) {
    const type = legalFactTypeForAnalogEvent(timelineStep, legalFactKey) || 'generic';
    // eslint-disable-next-line functional/no-let
    let text = getLocalizedOrDefaultLabel(
      'notifications',
      `detail.timeline.analog-workflow-attachment-kind.${type}`,
      ''
    );
    if (text.length === 0) {
      text = getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.analog-workflow-attachment-kind.generic',
        `Documento allegato all'evento`
      );
    }
    return text;
    // Carlos Lombardi

    // PN-5484
  } else if (
    timelineStep.category === TimelineCategory.COMPLETELY_UNREACHABLE &&
    legalFactType === LegalFactType.ANALOG_FAILURE_DELIVERY
  ) {
    return getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.analog-failure-delivery',
      'Deposito avviso di avvenuta ricezione'
    );
  } else if (
    timelineStep.category === TimelineCategory.ANALOG_FAILURE_WORKFLOW &&
    (timelineStep.details as AnalogWorkflowDetails).generatedAarUrl
  ) {
    return getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.aar-document',
      'Avviso di avvenuta ricezione'
    );
  } else if (
    timelineStep.category === TimelineCategory.SEND_DIGITAL_PROGRESS &&
    legalFactType === LegalFactType.PEC_RECEIPT
  ) {
    if (
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'C001' ||
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'DP00'
    ) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-accepted',
        'di accettazione PEC'
      )}`;
    } else if (
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'C008' ||
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'C010' ||
      (timelineStep.details as SendDigitalDetails).deliveryDetailCode === 'DP10'
    ) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-not-accepted',
        'di mancata accettazione PEC'
      )}`;
    }
  } else if (
    timelineStep.category === TimelineCategory.SEND_DIGITAL_FEEDBACK &&
    legalFactType === LegalFactType.PEC_RECEIPT
  ) {
    if ((timelineStep.details as SendDigitalDetails).responseStatus === ResponseStatus.OK) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-delivered',
        'di consegna PEC'
      )}`;
    } else if ((timelineStep.details as SendDigitalDetails).responseStatus === ResponseStatus.KO) {
      return `${receiptLabel} ${getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.legalfact.pec-receipt-not-delivered',
        'di mancata consegna PEC'
      )}`;
    }
    // this is (at least in the examples I've seen)
    // related to the category REQUEST_ACCEPTED
  } else if (legalFactType === LegalFactType.SENDER_ACK) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.sender-ack',
      'notifica presa in carico'
    )}`;
  } else if (
    legalFactType === LegalFactType.DIGITAL_DELIVERY &&
    timelineStep.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
  ) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.digital-delivery-success',
      'notifica digitale'
    )}`;
  } else if (
    legalFactType === LegalFactType.DIGITAL_DELIVERY &&
    timelineStep.category === TimelineCategory.DIGITAL_FAILURE_WORKFLOW
  ) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.digital-delivery-failure',
      'mancato recapito digitale'
    )}`;

    // this is(at least in the examples I've seen)
    // related to the category NOTIFICATION_VIEWED
  } else if (legalFactType === LegalFactType.RECIPIENT_ACCESS) {
    return `${legalFactLabel}: ${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.legalfact.recipient-access',
      'avvenuto accesso'
    )}`;
  } else if (legalFactType === LegalFactType.NOTIFICATION_CANCELLED) {
    return `${getLocalizedOrDefaultLabel(
      'notifications',
      'detail.timeline.notification-cancelled-document',
      'Dichiarazione annullamento notifica'
    )}`;
  }
  return legalFactLabel;
}

/**
 * Returns the mapping between current notification timeline status and its label and descriptive message.
 * @param  {INotificationDetailTimeline} step
 * @param {Array<NotificationDetailRecipient>} recipients
 * @returns {TimelineStepInfo | null }
 */
export function getNotificationTimelineStatusInfos(
  step: INotificationDetailTimeline,
  recipients: Array<NotificationDetailRecipient>,
  allStepsForThisStatus?: Array<INotificationDetailTimeline>,
  isNewTimelineCopyEnabled?: boolean,
  delegatorName?: string
): TimelineStepInfo | null {
  const recipient = isNil(step.details.recIndex)
    ? undefined
    : // For the accesses from recipient apps (cittadino / impresa)
    // the API response will probably (in some future) include only the info about the requester recipient,
    // i.e. recipients will be an array with exactly one element, disregarding how many recipients are included
    // in the notification being requested.
    // In that case, we don't consider the recIndex indicated in each timeline step,
    // but otherwise take all steps as related with the only recipient included in the API response.
    recipients.length === 1
    ? recipients[0]
    : recipients[step.details.recIndex];

  // we show the multirecipient versions of the step descriptions
  // only if the array of recipients include more than one "full" element
  // (i.e. an element including the full data about the recipient, instead of being included
  // just to preserve the correlation with the recIndex in each step).
  // We consider a recipient description to be "full" if it includes recipientType, taxId and denomination.
  // -------------------------------------
  // Carlos Lombardi, 2023.05.17
  // cfr. PN-5911
  // -------------------------------------
  return TimelineStepFactory.createTimelineStep(step).getTimelineStepInfo({
    step,
    recipient,
    isMultiRecipient:
      recipients.filter(
        (recDescription) =>
          recDescription.denomination && recDescription.taxId && recDescription.recipientType
      ).length > 1,
    allStepsForThisStatus,
    delegatorName,
    isNewTimelineCopyEnabled,
  });
}

export const getF24Payments = (
  payments: Array<NotificationPayment>,
  recIndex: number,
  onlyF24: boolean = true
): Array<F24PaymentDetails> =>
  payments.reduce((arr, payment, index) => {
    if (payment.f24 && ((onlyF24 && !payment.pagoPa) || !onlyF24)) {
      // eslint-disable-next-line functional/immutable-data
      arr.push({
        ...payment.f24,
        attachmentIdx: index,
        recIndex,
      });
    }
    return arr;
  }, [] as Array<F24PaymentDetails>);

export const getPagoPaF24Payments = (
  payments: Array<NotificationPayment>,
  recIndex: number,
  withLoading: boolean = false
): Array<PaymentDetails> =>
  payments.reduce((arr, payment, index) => {
    if (payment.pagoPa) {
      // eslint-disable-next-line functional/immutable-data
      arr.push({
        pagoPa: {
          ...payment.pagoPa,
          attachmentIdx: index,
          recIndex,
        } as PagoPAPaymentFullDetails,
        f24: payment.f24 ? { ...payment.f24, attachmentIdx: index, recIndex } : undefined,
        ...(withLoading && { isLoading: true }),
      });
    }
    return arr;
  }, [] as Array<PaymentDetails>);

const isPaymentTimelineElement = (
  element: NotificationPaymentTimelineElement
): element is Extract<NotificationPaymentTimelineElement, { category: TimelineCategory.PAYMENT }> =>
  element.category === TimelineCategory.PAYMENT && !!element.details;

/**
 * Populate only pagoPA(with eventual f24 associated) payment history array before send notification to fe.
 * @param  {NotificationPaymentTimeline} timeline
 * @param  {Array<PaymentDetails>} pagoPaF24Payments
 * @param  {Array<ExtRegistriesPaymentDetails>} checkoutPayments
 * @returns Array<PaymentDetails>
 */
export const populatePaymentsPagoPaF24 = (
  timeline: NotificationPaymentTimeline,
  pagoPaF24Payments: Array<PaymentDetails> | Array<NotificationPayment>,
  checkoutPayments: Array<ExtRegistriesPaymentDetails>
): Array<PaymentDetails> => {
  const paymentDetails: Array<PaymentDetails> = [];

  if (!pagoPaF24Payments || pagoPaF24Payments.length === 0) {
    return [];
  }

  // 1. Get all timeline steps that have category payment
  const paymentTimelineStep = timeline.filter(isPaymentTimelineElement);

  // 2. populate payment history array with the informations from timeline and related recipients
  for (const userPayment of pagoPaF24Payments) {
    if (!userPayment.pagoPa) {
      continue;
    }

    if (
      checkoutPayments.length &&
      checkoutPayments?.findIndex(
        (payment) =>
          payment.creditorTaxId === userPayment.pagoPa?.creditorTaxId &&
          payment.noticeCode === userPayment.pagoPa?.noticeCode
      ) === -1
    ) {
      continue;
    }

    // 3. Get payment by creditorTaxId and noticeCode from checkout
    const checkoutPayment = checkoutPayments.find(
      (p) =>
        p.creditorTaxId === userPayment?.pagoPa?.creditorTaxId &&
        p.noticeCode === userPayment?.pagoPa?.noticeCode
    );

    const timelineEvent = paymentTimelineStep.find(
      (item) =>
        item.details.creditorTaxId === userPayment?.pagoPa?.creditorTaxId &&
        item.details.noticeCode === userPayment?.pagoPa?.noticeCode
    )?.details;

    if (timelineEvent) {
      (Object.keys(timelineEvent) as Array<keyof typeof timelineEvent>).forEach((key) =>
        timelineEvent[key] === undefined ? delete timelineEvent[key] : {}
      );
    }

    const pagoPAPayment = {
      ...userPayment.pagoPa,
      ...checkoutPayment,
      ...timelineEvent,
    };

    if (timelineEvent && !checkoutPayment) {
      // from timeline we have only succeded payments
      pagoPAPayment.status = PaymentStatus.SUCCEEDED;
    }

    paymentDetails.push({
      pagoPa: pagoPAPayment,
      f24: userPayment.f24,
    } as PaymentDetails);
  }

  return paymentDetails;
};

export const isNotificationDetailOtherDocument = (
  value: NotificationDetailDocument | NotificationDetailOtherDocument
): value is NotificationDetailOtherDocument => value.documentType === 'AAR';
