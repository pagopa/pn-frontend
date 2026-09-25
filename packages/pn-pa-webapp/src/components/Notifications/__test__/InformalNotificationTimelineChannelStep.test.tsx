import { INFORMAL_NOTIFICATION_TIMELINE_MOCK } from '../../../__mocks__/InformalNotificationTimeline.mock';
import { render } from '../../../__test__/test-utils';
import {
  BffInformalNotificationTimelineItem,
  BffNotificationChannelType,
  InformalNotificationStatusV1,
  InformalNotificationViewedDetails,
  InformalTimelineElementCategoryV1,
} from '../../../generated-client/informal-notifications';
import InformalNotificationTimelineChannelStep from '../InformalNotificationTimelineChannelStep';

const pecStep = INFORMAL_NOTIFICATION_TIMELINE_MOCK.notificationStatusHistory.find(
  (item) => item.status === InformalNotificationStatusV1.Processing
)!.steps[0];

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

describe('InformalNotificationTimelineChannelStep Component', () => {
  it('renders the channel header and one row with date for each event', () => {
    const { getByText, getAllByRole, getAllByTestId } = render(
      <InformalNotificationTimelineChannelStep step={pecStep} />
    );

    expect(getByText('informal.detail.send-by-channel.channel.pec')).toBeInTheDocument();

    const rows = getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('informal.timeline.event.delivered.pec');
    expect(rows[1]).toHaveTextContent(
      'informal.timeline.event.send_digital_message_feedback.ok.pec'
    );
    expect(getAllByTestId('dateItem')).toHaveLength(2);
  });

  it('shows the viewed and delivered tags only on the IO channel', () => {
    const { getByText, rerender, queryByText } = render(
      <InformalNotificationTimelineChannelStep
        step={{ channel: BffNotificationChannelType.Io, events: [viewedEvent, ...pecStep.events] }}
      />
    );

    expect(getByText('informal.detail.send-by-channel.status.viewed')).toBeInTheDocument();
    expect(
      getByText('informal.timeline.event.informal_notification_viewed.io')
    ).toBeInTheDocument();
    expect(getByText('informal.detail.send-by-channel.status.delivered')).toBeInTheDocument();

    rerender(<InformalNotificationTimelineChannelStep step={pecStep} />);

    expect(queryByText('informal.detail.send-by-channel.status.delivered')).not.toBeInTheDocument();
  });

  it('shows the raw category for the UNKNOWN channel', () => {
    const { getByText, queryByText } = render(
      <InformalNotificationTimelineChannelStep
        step={{ ...pecStep, channel: BffNotificationChannelType.Unknown }}
      />
    );

    expect(getByText('DELIVERED')).toBeInTheDocument();
    expect(getByText('SEND_DIGITAL_MESSAGE_FEEDBACK')).toBeInTheDocument();
    expect(queryByText(/informal\.timeline\.event/)).not.toBeInTheDocument();
  });

  it('renders only the header when no event has a copy', () => {
    const { getByText, queryByTestId } = render(
      <InformalNotificationTimelineChannelStep
        step={{
          ...pecStep,
          events: [
            {
              ...pecStep.events[1],
              category: InformalTimelineElementCategoryV1.SendDigitalMessageProgress,
            },
          ],
        }}
      />
    );

    expect(getByText('informal.detail.send-by-channel.channel.pec')).toBeInTheDocument();
    expect(queryByTestId('timeline-group-body')).not.toBeInTheDocument();
  });
});
