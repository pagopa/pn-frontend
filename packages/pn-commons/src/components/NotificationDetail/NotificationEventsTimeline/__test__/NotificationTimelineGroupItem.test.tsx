import { vi } from 'vitest';

import { notificationTimelineDTO } from '../../../../__mocks__/NotificationTimeline.mock';
import { NotificationTimelineGroup } from '../../../../models/NotificationTimeline';
import { fireEvent, render, waitFor, within } from '../../../../test-utils';
import {
  flattenTimelineSteps,
  isTimelineGroupStep,
} from '../../../../utility/notificationTimeline.utility';
import NotificationTimelineGroupItem from '../NotificationTimelineGroupItem';

const [, deliveringStatus] = notificationTimelineDTO.notificationStatusHistory;

const recipients = notificationTimelineDTO.recipients;
const allEvents = flattenTimelineSteps(deliveringStatus.steps);
const analogGroup = deliveringStatus.steps.filter(isTimelineGroupStep)[0].group;

const clickHandler = vi.fn();

const renderGroup = (group: NotificationTimelineGroup, hasMultipleAttempts = false) =>
  render(
    <NotificationTimelineGroupItem
      group={group}
      allEvents={allEvents}
      recipients={recipients}
      clickHandler={clickHandler}
      disableDownloads={false}
      language="it"
      hasMultipleAttempts={hasMultipleAttempts}
    />
  );

describe('NotificationTimelineGroupItem', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the collapsed header with the channel label and the registered letter code', () => {
    const { container } = renderGroup(analogGroup);

    const header = within(container).getByTestId('timeline-group-header');
    expect(header).toHaveTextContent('detail.timeline.send-analog-domicile-890-group-label');
    expect(header).toHaveTextContent(analogGroup.registeredLetterCode!);
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(within(container).queryByTestId('timeline-group-body')).not.toBeInTheDocument();
  });

  it('shows the attempt label when the channel has multiple attempts', () => {
    const { container } = renderGroup(analogGroup, true);

    expect(within(container).getByTestId('timeline-group-header')).toHaveTextContent(
      'detail.timeline.send-analog-domicile-890-first-attempt-group-label'
    );
  });

  it('expands and collapses the events of the group', async () => {
    const { container } = renderGroup(analogGroup);

    const header = within(container).getByTestId('timeline-group-header');
    fireEvent.click(header);

    const body = within(container).getByTestId('timeline-group-body');
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(header).toHaveAttribute('aria-controls', body.id);
    expect(within(body).getAllByTestId('timeline-event')).toHaveLength(
      analogGroup.events.filter((event) => !event.isHidden).length
    );

    fireEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(within(container).queryByTestId('timeline-group-body')).not.toBeInTheDocument()
    );
  });

  it('tags the group when it carries reworked events', () => {
    const { container } = renderGroup(analogGroup);
    expect(within(container).queryByText('status.reworked-status-group')).not.toBeInTheDocument();

    const reworkedGroup: NotificationTimelineGroup = { ...analogGroup, hasReworkedEvents: true };
    const { container: reworkedContainer } = renderGroup(reworkedGroup);
    expect(within(reworkedContainer).getByText('status.reworked-status-group')).toBeInTheDocument();
  });
});
