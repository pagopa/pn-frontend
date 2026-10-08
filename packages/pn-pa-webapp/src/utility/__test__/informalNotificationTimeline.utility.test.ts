import { INFORMAL_NOTIFICATION_TIMELINE_MOCK } from '../../__mocks__/InformalNotificationTimeline.mock';
import {
  AnalogDeliveryType,
  BffInformalNotificationTimelineGroup,
  BffInformalNotificationTimelineItem,
  BffNotificationChannelType,
  InformalNotificationStatusV1,
  InformalNotificationViewedDetails,
  InformalTimelineElementCategoryV1,
  ResponseStatus,
  SendAnalogMessageFeedbackDetails,
} from '../../generated-client/informal-notifications';
import {
  getInformalTimelineEvents,
  getInformalTimelineSteps,
} from '../informalNotificationTimeline.utility';

const processingStatus = INFORMAL_NOTIFICATION_TIMELINE_MOCK.notificationStatusHistory.find(
  (item) => item.status === InformalNotificationStatusV1.Processing
)!;
const { status } = processingStatus;
const pecStep = processingStatus.steps[0];
const [deliveredEvent, feedbackEvent] = pecStep.events;

const viewedDetails: InformalNotificationViewedDetails = {
  recIndex: 0,
  eventTimestamp: '2026-09-21T14:05:00Z',
  sourceChannel: 'IO',
};

const viewedEvent: BffInformalNotificationTimelineItem = {
  elementId: 'INFORMAL_NOTIFICATION_VIEWED.IUN_YWNY-YHRA-KTYL-202609-P-A.RECINDEX_0',
  eventTimestamp: '2026-09-21T14:05:00Z',
  category: InformalTimelineElementCategoryV1.InformalNotificationViewed,
  details: viewedDetails,
};

describe('informalNotificationTimeline utility', () => {
  it('maps the events of a channel group to their copy keys, keeping the backend order', () => {
    expect(getInformalTimelineEvents(pecStep, status)).toEqual([
      {
        id: deliveredEvent.elementId,
        date: deliveredEvent.eventTimestamp,
        key: 'delivered.pec',
        tag: 'DELIVERED',
      },
      {
        id: feedbackEvent.elementId,
        date: feedbackEvent.eventTimestamp,
        key: 'send_digital_message_feedback.ok.pec',
      },
    ]);
  });

  it('adds the SEND group only in the processing status, starting it with the filed row', () => {
    const steps = getInformalTimelineSteps(processingStatus.steps, status);
    const sendStep = steps.find((step) => step.channel === BffNotificationChannelType.Send)!;

    expect(steps.map((step) => step.channel)).toEqual([
      BffNotificationChannelType.Pec,
      BffNotificationChannelType.Send,
    ]);
    expect(getInformalTimelineEvents(sendStep, status, '2026-09-21T13:59:18Z')).toEqual([
      { id: 'filed', date: '2026-09-21T13:59:18Z', key: 'filed.send' },
    ]);
    // an already present SEND group is left untouched
    expect(getInformalTimelineSteps(steps, status)).toBe(steps);

    // the other statuses get neither the SEND group nor the filed row
    const completed = InformalNotificationStatusV1.CompletedReached;
    expect(getInformalTimelineSteps(processingStatus.steps, completed)).toBe(
      processingStatus.steps
    );
    expect(getInformalTimelineEvents(sendStep, completed, '2026-09-21T13:59:18Z')).toEqual([]);
  });

  it('uses the registered letter code for analog events and tags the delivery on every channel', () => {
    const analogFeedbackDetails: SendAnalogMessageFeedbackDetails = {
      recIndex: 0,
      sentAttemptMade: 0,
      deliveryType: AnalogDeliveryType.Rs,
      responseStatus: ResponseStatus.Ok,
      registeredLetterCode: 'RR-0123456',
    };
    const analogFeedback = {
      ...feedbackEvent,
      category: InformalTimelineElementCategoryV1.SendAnalogMessageFeedback,
      details: analogFeedbackDetails,
    };
    const analogStep: BffInformalNotificationTimelineGroup = {
      channel: BffNotificationChannelType.Analog,
      events: [deliveredEvent, analogFeedback],
    };

    expect(
      getInformalTimelineEvents(analogStep, status).map(({ key, values, tag }) => ({
        key,
        values,
        tag,
      }))
    ).toEqual([
      { key: 'delivered.analog_registered', values: { code: 'RR-0123456' }, tag: 'DELIVERED' },
      {
        key: 'send_analog_message_feedback.ok.analog_registered',
        values: { code: 'RR-0123456' },
        tag: undefined,
      },
    ]);

    const [ioDelivered, ioFeedback] = getInformalTimelineEvents(
      { ...pecStep, channel: BffNotificationChannelType.Io },
      status
    );
    expect(ioDelivered).toMatchObject({ key: 'delivered.io', tag: 'DELIVERED' });
    expect(ioFeedback.tag).toBeUndefined();
  });

  it('tags the reading on IO and the reading from web after the filed row', () => {
    expect(
      getInformalTimelineEvents(
        { channel: BffNotificationChannelType.Io, events: [viewedEvent] },
        status
      )
    ).toEqual([
      {
        id: viewedEvent.elementId,
        date: viewedEvent.eventTimestamp,
        key: 'informal_notification_viewed.io',
        tag: 'VIEWED',
      },
    ]);

    // the reading from the web portal is in the SEND group
    expect(
      getInformalTimelineEvents(
        {
          channel: BffNotificationChannelType.Send,
          events: [{ ...viewedEvent, details: { ...viewedDetails, sourceChannel: 'WEB' } }],
        },
        status,
        '2026-09-21T13:59:18Z'
      ).map(({ key, tag }) => ({ key, tag }))
    ).toEqual([
      { key: 'filed.send', tag: undefined },
      { key: 'informal_notification_viewed.send', tag: 'VIEWED' },
    ]);
  });

  it('maps the progress event to the successful sending only for email and IO', () => {
    const progressEvent: BffInformalNotificationTimelineItem = {
      elementId:
        'SEND_DIGITAL_MESSAGE_PROGRESS.IUN_YWNY-YHRA-KTYL-202609-P-A.RECINDEX_0.IDX_2.CHANNEL_EMAIL',
      eventTimestamp: '2026-09-21T14:01:00Z',
      category: InformalTimelineElementCategoryV1.SendDigitalMessageProgress,
      details: { recIndex: 0, channel: 'EMAIL' },
    };

    expect(
      getInformalTimelineEvents(
        { channel: BffNotificationChannelType.Email, events: [deliveredEvent, progressEvent] },
        status
      )
    ).toEqual([
      {
        id: deliveredEvent.elementId,
        date: deliveredEvent.eventTimestamp,
        key: 'delivered.email',
        tag: 'DELIVERED',
      },
      {
        id: progressEvent.elementId,
        date: progressEvent.eventTimestamp,
        key: 'send_digital_message_feedback.ok.email',
      },
    ]);

    const [ioDelivered, ioProgress] = getInformalTimelineEvents(
      { channel: BffNotificationChannelType.Io, events: [deliveredEvent, progressEvent] },
      status
    );
    expect(ioDelivered).toMatchObject({ key: 'delivered.io', tag: 'DELIVERED' });
    expect(ioProgress).toEqual({
      id: progressEvent.elementId,
      date: progressEvent.eventTimestamp,
      key: 'send_digital_message_feedback.ok.io',
    });
  });

  it('maps the IO feedback with the SENDER_NOT_ALLOWED code to the unavailable channel', () => {
    const ioFeedbackEvent: BffInformalNotificationTimelineItem = {
      elementId:
        'SEND_DIGITAL_MESSAGE_FEEDBACK.IUN_YWNY-YHRA-KTYL-202609-P-A.RECINDEX_0.IDX_1.CHANNEL_IO',
      eventTimestamp: '2026-09-21T14:01:00Z',
      category: InformalTimelineElementCategoryV1.SendDigitalMessageFeedback,
      details: {
        recIndex: 0,
        channel: 'IO',
        responseStatus: ResponseStatus.Ko,
        deliveryDetail: { code: 'SENDER_NOT_ALLOWED' },
      },
    };

    expect(
      getInformalTimelineEvents(
        { channel: BffNotificationChannelType.Io, events: [ioFeedbackEvent] },
        status
      )
    ).toEqual([
      {
        id: ioFeedbackEvent.elementId,
        date: ioFeedbackEvent.eventTimestamp,
        key: 'send_digital_message_skip.io',
      },
    ]);
  });

  it('keeps the raw category for the UNKNOWN channel and discards the events without a copy', () => {
    expect(
      getInformalTimelineEvents({ ...pecStep, channel: BffNotificationChannelType.Unknown }, status)
    ).toEqual([
      expect.objectContaining({ key: 'DELIVERED', raw: true }),
      expect.objectContaining({ key: 'SEND_DIGITAL_MESSAGE_FEEDBACK', raw: true }),
    ]);

    expect(
      getInformalTimelineEvents(
        {
          ...pecStep,
          events: [
            {
              ...feedbackEvent,
              category: InformalTimelineElementCategoryV1.SendDigitalMessageProgress,
            },
          ],
        },
        status
      )
    ).toEqual([]);
  });
});
