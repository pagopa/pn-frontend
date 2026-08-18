import { vi } from 'vitest';

import { notificationTimelineDTO } from '../../../../__mocks__/NotificationTimeline.mock';
import { NotificationStatus } from '../../../../models';
import { ReworkedStatus } from '../../../../models/NotificationDetail';
import { createMatchMedia, fireEvent, render, within } from '../../../../test-utils';
import NotificationEventsTimeline from '../NotificationEventsTimeline';

describe('NotificationEventsTimeline', () => {
  // Define mock data for props
  const recipients = notificationTimelineDTO.recipients;
  const statusHistory = notificationTimelineDTO.notificationStatusHistory;
  const clickHandler = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component', () => {
    const { queryByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        clickHandler={clickHandler}
      />
    );
    expect(queryByTestId('NotificationEventsTimeline')).toBeInTheDocument();
    expect(queryByTestId('more-less-timeline-step')).not.toBeInTheDocument();
  });

  it('renders macro step with tag reworked', () => {
    window.matchMedia = createMatchMedia(1920);
    const { container } = render(
      <NotificationEventsTimeline
        recipients={[]}
        statusHistory={[
          {
            status: NotificationStatus.NOTIFICATION_TIMELINE_REWORKED,
            activeFrom: '2023-01-03T00:00:00Z',
            steps: [],
          },
          {
            status: NotificationStatus.DELIVERED,
            activeFrom: '2023-01-01T00:00:00Z',
            steps: [],
            reworkedStatus: ReworkedStatus.VALID,
          },
          {
            status: NotificationStatus.EFFECTIVE_DATE,
            activeFrom: '2023-01-02T00:00:00Z',
            steps: [],
            reworkedStatus: ReworkedStatus.NOT_VALID,
          },
        ]}
        clickHandler={clickHandler}
      />
    );
    expect(container).toHaveTextContent('status.notification-timeline-reworked');
    expect(container).toHaveTextContent('status.reworked-status-valid');
    expect(container).toHaveTextContent('status.reworked-status-not-valid');
  });

  it('renders a group for each grouped step, divided one from the other', () => {
    const { getAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        clickHandler={clickHandler}
      />
    );
    // the mock has two groups, both belonging to the DELIVERING status
    expect(getAllByTestId('timeline-group')).toHaveLength(2);
    expect(getAllByTestId('timeline-group-divider')).toHaveLength(1);
  });

  it('shows the events of a group only when the group is expanded', () => {
    const { getAllByTestId, queryAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        clickHandler={clickHandler}
      />
    );
    expect(queryAllByTestId('timeline-group-body')).toHaveLength(0);

    const firstGroup = getAllByTestId('timeline-group')[0];
    fireEvent.click(within(firstGroup).getByTestId('timeline-group-header'));

    const groupBody = within(firstGroup).getByTestId('timeline-group-body');
    // the first group of the mock has two visible events
    expect(within(groupBody).getAllByTestId('timeline-event')).toHaveLength(2);
  });

  it('downloads the legal fact of a hidden event', () => {
    const { getAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        clickHandler={clickHandler}
      />
    );
    // the mock has two hidden events, both carrying one legal fact
    const legalFactButtons = getAllByTestId('download-legalfact');
    expect(legalFactButtons).toHaveLength(2);

    fireEvent.click(legalFactButtons[0]);
    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(
      notificationTimelineDTO.notificationStatusHistory[0].steps[0].stepType === 'EVENT'
        ? notificationTimelineDTO.notificationStatusHistory[0].steps[0].event.legalFactsIds?.[0]
        : undefined
    );
  });
});
