import { render } from '../../../__test__/test-utils';
import {
  BffChannelStatusV1,
  BffNotificationChannelType,
} from '../../../generated-client/informal-notifications';
import InformalNotificationChannelStatusBox from '../InformalNotificationChannelStatus/InformalNotificationChannelStatusBox';

describe('InformalNotificationChannelStatusBox Component', () => {
  it('renders nothing when there are no channels', () => {
    const { container, rerender } = render(<InformalNotificationChannelStatusBox />);
    expect(container).toBeEmptyDOMElement();

    rerender(<InformalNotificationChannelStatusBox channelsStatus={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders one row for each channel with its label and status', () => {
    const { getByText, getAllByRole } = render(
      <InformalNotificationChannelStatusBox
        channelsStatus={[
          { channel: BffNotificationChannelType.Send, status: BffChannelStatusV1.Filed },
          { channel: BffNotificationChannelType.Pec, status: BffChannelStatusV1.Delivered },
          { channel: BffNotificationChannelType.Io, status: BffChannelStatusV1.Viewed },
        ]}
      />
    );

    expect(getByText('informal.detail.send-by-channel.title')).toBeInTheDocument();

    const rows = getAllByRole('listitem');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent('informal.detail.send-by-channel.channel.send');
    expect(rows[0]).toHaveTextContent('informal.detail.send-by-channel.status.filed');
    expect(rows[1]).toHaveTextContent('informal.detail.send-by-channel.channel.pec');
    expect(rows[1]).toHaveTextContent('informal.detail.send-by-channel.status.delivered');
    expect(rows[2]).toHaveTextContent('informal.detail.send-by-channel.channel.io');
    expect(rows[2]).toHaveTextContent('informal.detail.send-by-channel.status.viewed');
  });

  it('shows the generic description for the statuses waiting to be sent', () => {
    const { getAllByRole } = render(
      <InformalNotificationChannelStatusBox
        channelsStatus={[
          { channel: BffNotificationChannelType.Email, status: BffChannelStatusV1.ReadyToSend },
          { channel: BffNotificationChannelType.Sms, status: BffChannelStatusV1.WaitingToSend },
        ]}
      />
    );

    const rows = getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('informal.detail.send-by-channel.description.ready_to_send');
    expect(rows[1]).toHaveTextContent(
      'informal.detail.send-by-channel.description.waiting_to_send'
    );
  });

  it('shows the channel specific description for the unavailable and workflow ended statuses', () => {
    const { getAllByRole } = render(
      <InformalNotificationChannelStatusBox
        channelsStatus={[
          { channel: BffNotificationChannelType.Io, status: BffChannelStatusV1.Unavailable },
          { channel: BffNotificationChannelType.Pec, status: BffChannelStatusV1.WorkflowEnded },
        ]}
      />
    );

    const rows = getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('informal.detail.send-by-channel.description.unavailable.io');
    expect(rows[1]).toHaveTextContent(
      'informal.detail.send-by-channel.description.workflow_ended.pec'
    );
  });

  it('does not show the status tag for the workflow ended status', () => {
    const { getByRole } = render(
      <InformalNotificationChannelStatusBox
        channelsStatus={[
          { channel: BffNotificationChannelType.Pec, status: BffChannelStatusV1.WorkflowEnded },
        ]}
      />
    );

    const row = getByRole('listitem');
    expect(row).toHaveTextContent('informal.detail.send-by-channel.channel.pec');
    expect(row).not.toHaveTextContent('informal.detail.send-by-channel.status');
  });

  it('does not show any description for the statuses already processed', () => {
    const { getAllByRole } = render(
      <InformalNotificationChannelStatusBox
        channelsStatus={[
          { channel: BffNotificationChannelType.Pec, status: BffChannelStatusV1.Delivered },
          { channel: BffNotificationChannelType.Email, status: BffChannelStatusV1.NotDelivered },
        ]}
      />
    );

    getAllByRole('listitem').forEach((row) => {
      expect(row).not.toHaveTextContent('informal.detail.send-by-channel.description');
    });
  });
});
