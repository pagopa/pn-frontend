import { INFORMAL_NOTIFICATION_TIMELINE_MOCK } from '../../../__mocks__/InformalNotificationTimeline.mock';
import { render } from '../../../__test__/test-utils';
import InformalNotificationSenderTimeline from '../InformalNotificationSenderTimeline';

const { notificationStatusHistory, communicationOutcomes } = INFORMAL_NOTIFICATION_TIMELINE_MOCK;

describe('InformalNotificationSenderTimeline Component', () => {
  it('renders every status of the history with its copy', () => {
    const { getByText, queryByText } = render(
      <InformalNotificationSenderTimeline
        statusHistory={notificationStatusHistory}
        communicationOutcomes={communicationOutcomes}
      />
    );

    expect(getByText('informal.status.completed.label')).toBeInTheDocument();
    expect(getByText('informal.status.completed.description')).toBeInTheDocument();
    expect(getByText('informal.status.processing.label')).toBeInTheDocument();
    expect(getByText('informal.status.accepted.label')).toBeInTheDocument();
    expect(getByText('informal.status.accepted.description')).toBeInTheDocument();
    // processing shows the channel groups instead of its description
    expect(queryByText('informal.status.processing.description')).not.toBeInTheDocument();
  });

  it('shows the channel groups under the processing status, SEND included', () => {
    const { getByText } = render(
      <InformalNotificationSenderTimeline
        statusHistory={notificationStatusHistory}
        communicationOutcomes={communicationOutcomes}
      />
    );

    expect(getByText('informal.detail.send-by-channel.channel.pec')).toBeInTheDocument();
    expect(getByText('informal.detail.send-by-channel.channel.send')).toBeInTheDocument();
    expect(getByText('informal.timeline.event.filed.send')).toBeInTheDocument();
  });

  it('shows the delivered outcome when the communication is delivered but not viewed', () => {
    const { getByText, queryByText } = render(
      <InformalNotificationSenderTimeline
        statusHistory={notificationStatusHistory}
        communicationOutcomes={{ delivered: true, viewed: false }}
      />
    );

    expect(getByText('informal.timeline.outcome.delivered.title')).toBeInTheDocument();
    expect(queryByText('informal.timeline.outcome.viewed.title')).not.toBeInTheDocument();
  });

  it('shows only the viewed outcome when the communication is viewed', () => {
    const { getByText, queryByText } = render(
      <InformalNotificationSenderTimeline
        statusHistory={notificationStatusHistory}
        communicationOutcomes={{ delivered: true, viewed: true }}
      />
    );

    expect(getByText('informal.timeline.outcome.viewed.title')).toBeInTheDocument();
    expect(queryByText('informal.timeline.outcome.delivered.title')).not.toBeInTheDocument();
  });
});
