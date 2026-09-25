import { ComponentType } from 'react';

import {
  ChatOutlined,
  DraftsOutlined,
  InfoOutlined,
  LocalPostOfficeOutlined,
  MailOutlineRounded,
  MarkEmailReadOutlined,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { IOIcon, MailShieldRounded, SendIcon } from '@pagopa-pn/pn-commons';

import {
  AnalogDeliveryType,
  BffChannelStatusV1,
  BffInformalNotificationTimelineGroup,
  BffInformalNotificationTimelineItem,
  BffNotificationChannelType,
  DeliveredDetails,
  InformalTimelineElementCategoryV1,
  SendAnalogMessageFeedbackDetails,
  SendDigitalMessageFeedbackDetails,
} from '../generated-client/informal-notifications';

export type InformalTimelineEventView = {
  id: string;
  date?: string;
  key: string;
  values?: Record<string, string>;
  tag?: InformalTimelineEventTag;
  raw?: boolean;
};

type InformalTimelineEventTag =
  | typeof BffChannelStatusV1.Delivered
  | typeof BffChannelStatusV1.Viewed;

type InformalTimelineEventCopy = {
  key: string;
  values?: Record<string, string>;
  tag?: InformalTimelineEventTag;
  raw?: boolean;
};

export const INFORMAL_CHANNEL_ICON: Record<
  BffNotificationChannelType,
  ComponentType<SvgIconProps>
> = {
  SEND: SendIcon,
  IO: IOIcon,
  SMS: ChatOutlined,
  EMAIL: MailOutlineRounded,
  ANALOG: LocalPostOfficeOutlined,
  PEC: MailShieldRounded,
  UNKNOWN: InfoOutlined,
};

export const IO_TAG_ICON: Record<InformalTimelineEventTag, ComponentType<SvgIconProps>> = {
  DELIVERED: MarkEmailReadOutlined,
  VIEWED: DraftsOutlined,
};

export const getChannelLabelKey = (channel: BffNotificationChannelType) =>
  `informal.detail.send-by-channel.channel.${channel.toLowerCase()}`;

/**
 * Check if SEND is already present in the timeline. If not, it creates it.
 * @param steps - Timeline steps
 */
export const getInformalTimelineSteps = (
  steps: Array<BffInformalNotificationTimelineGroup>
): Array<BffInformalNotificationTimelineGroup> => {
  if (!steps.some((step) => step.channel === BffNotificationChannelType.Send)) {
    return [...steps, { channel: BffNotificationChannelType.Send, events: [] }];
  }

  return steps;
};

/**
 * On IO the delivery and the reading of the notification are highlighted with a tag.
 * @param step - Channel group
 * @param tag - Tag to show
 */
const getIOTag = (
  step: BffInformalNotificationTimelineGroup,
  tag: InformalTimelineEventTag
): InformalTimelineEventTag | undefined =>
  step.channel === BffNotificationChannelType.Io ? tag : undefined;

/**
 * Registered letters has the code, ordinary mail doesn't.
 * @param details - Details of the SEND_ANALOG_MESSAGE_FEEDBACK event
 */
const getAnalogVariant = (
  details?: SendAnalogMessageFeedbackDetails
): { variant: 'analog_registered' | 'analog_ordinary'; values?: Record<string, string> } =>
  details?.deliveryType === AnalogDeliveryType.Rs
    ? { variant: 'analog_registered', values: { code: details.registeredLetterCode || '' } }
    : { variant: 'analog_ordinary' };

const getEventCopy = (
  event: BffInformalNotificationTimelineItem,
  step: BffInformalNotificationTimelineGroup
): InformalTimelineEventCopy | null => {
  // there is no copy for an unknown channel, so the key is the raw category
  if (step.channel === BffNotificationChannelType.Unknown) {
    return event.category ? { key: event.category, raw: true } : null;
  }

  if (!event.details) {
    return null;
  }

  const channel = step.channel.toLowerCase();

  switch (event.category) {
    case InformalTimelineElementCategoryV1.SendDigitalMessageFeedback: {
      const { responseStatus } = event.details as SendDigitalMessageFeedbackDetails;

      return { key: `send_digital_message_feedback.${responseStatus.toLowerCase()}.${channel}` };
    }

    case InformalTimelineElementCategoryV1.SendAnalogMessageFeedback: {
      const details = event.details as SendAnalogMessageFeedbackDetails;
      const { variant, values } = getAnalogVariant(details);

      return {
        key: `send_analog_message_feedback.${details.responseStatus.toLowerCase()}.${variant}`,
        values,
      };
    }

    case InformalTimelineElementCategoryV1.Delivered: {
      if (step.channel !== BffNotificationChannelType.Analog) {
        return { key: `delivered.${channel}`, tag: getIOTag(step, BffChannelStatusV1.Delivered) };
      }

      // the delivery code is only on the feedback event the delivery refers to
      const { sourceElementId } = event.details as DeliveredDetails;
      const feedback = step.events.find((item) => item.elementId === sourceElementId);
      const { variant, values } = getAnalogVariant(
        feedback?.details as SendAnalogMessageFeedbackDetails | undefined
      );

      return { key: `delivered.${variant}`, values };
    }

    case InformalTimelineElementCategoryV1.SendDigitalMessageSkip:
      return { key: `send_digital_message_skip.${channel}` };

    case InformalTimelineElementCategoryV1.InformalNotificationViewed:
      return {
        key: `informal_notification_viewed.${channel}`,
        tag: getIOTag(step, BffChannelStatusV1.Viewed),
      };

    default:
      return null;
  }
};

const getEventId = (
  event: BffInformalNotificationTimelineItem,
  step: BffInformalNotificationTimelineGroup,
  index: number
) => event.elementId ?? `${step.channel}-${index}`;

const toEventView = (
  copy: InformalTimelineEventCopy,
  id: string,
  date?: string
): InformalTimelineEventView => ({ id, date, ...copy });

/**
 * Maps the events of a channel group to the rows to show, discarding the ones without a copy.
 * The SEND group always starts with the "filed" row, since every notification is filed on SEND.
 * The UNKNOWN group has no copy to pick, so its events have the raw category as key.
 * @param step - Channel group
 * @param filedDate - Date the notification was filed on SEND
 */
export const getInformalTimelineEvents = (
  step: BffInformalNotificationTimelineGroup,
  filedDate?: string
): Array<InformalTimelineEventView> => {
  const events = step.events.flatMap((event, index) => {
    const copy = getEventCopy(event, step);

    return copy ? [toEventView(copy, getEventId(event, step, index), event.eventTimestamp)] : [];
  });

  if (step.channel !== BffNotificationChannelType.Send) {
    return events;
  }

  return [toEventView({ key: 'filed.send' }, 'filed', filedDate), ...events];
};
