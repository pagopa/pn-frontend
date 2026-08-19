import { vi } from 'vitest';

import { notificationTimelineDTO } from '../../../../__mocks__/NotificationTimeline.mock';
import { NotificationStatus } from '../../../../models';
import {
  NotificationDetailRecipient,
  RecipientType,
  ReworkedStatus,
} from '../../../../models/NotificationDetail';
import {
  NotificationTimelineGroup,
  NotificationTimelineStatusHistory,
} from '../../../../models/NotificationTimeline';
import { createMatchMedia, fireEvent, render, within } from '../../../../test-utils';
import NotificationEventsTimeline from '../NotificationEventsTimeline';

const multiRecipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
    taxId: 'TSTUTN00A07A001G',
    denomination: 'Utente Test Uno',
    payments: [],
  },
  {
    recipientType: RecipientType.PF,
    taxId: 'TSTUTN00A07A002H',
    denomination: 'Utente Test Due',
    payments: [],
  },
];

const groupOfRecipient = (
  groupId: string,
  recipient: NotificationDetailRecipient,
  recIndex: number
): NotificationTimelineGroup => ({
  groupId,
  denomination: recipient.denomination,
  taxId: recipient.taxId,
  recIndex,
  category: 'ANALOG',
  channel: 'AR_REGISTERED_LETTER',
  attempt: 1,
  hasReworkedEvents: false,
  events: [],
});

/**
 * Due gruppi del primo destinatario, uno del secondo: l'intestazione col destinatario
 * deve comparire solo quando cambia.
 */
const multiRecipientStatusHistory: Array<NotificationTimelineStatusHistory> = [
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2026-08-06T09:14:58.508308Z',
    steps: [
      { stepType: 'GROUP', group: groupOfRecipient('first-recipient-pec', multiRecipients[0], 0) },
      { stepType: 'GROUP', group: groupOfRecipient('first-recipient-890', multiRecipients[0], 0) },
      { stepType: 'GROUP', group: groupOfRecipient('second-recipient-890', multiRecipients[1], 1) },
    ],
  },
];

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

  it('shows the recipient before the groups only when it changes, on multi-recipient notifications', () => {
    const { getAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={multiRecipients}
        statusHistory={multiRecipientStatusHistory}
        clickHandler={clickHandler}
      />
    );

    const recipientLabels = getAllByTestId('timeline-group-recipient');
    expect(recipientLabels).toHaveLength(2);
    expect(recipientLabels[0]).toHaveTextContent('Utente Test Uno - TSTUTN00A07A001G');
    expect(recipientLabels[1]).toHaveTextContent('Utente Test Due - TSTUTN00A07A002H');
  });

  it('does not show the recipient on single recipient notifications', () => {
    const { queryAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        clickHandler={clickHandler}
      />
    );

    expect(queryAllByTestId('timeline-group-recipient')).toHaveLength(0);
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
