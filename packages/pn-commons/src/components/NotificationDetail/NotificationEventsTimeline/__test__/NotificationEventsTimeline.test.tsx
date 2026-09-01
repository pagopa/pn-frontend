import { vi } from 'vitest';

import { notificationTimelineDTO } from '../../../../__mocks__/NotificationTimeline.mock';
import { NotificationStatus } from '../../../../models';
import {
  LegalFactType,
  NotificationDetailRecipient,
  RecipientType,
  ReworkedStatus,
  TimelineCategory,
} from '../../../../models/NotificationDetail';
import {
  NotificationTimelineGroup,
  NotificationTimelineStatusHistory,
  NotificationTimelineStep,
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

const hiddenEventStepOfRecipient = (recIndex: number): NotificationTimelineStep => ({
  stepType: 'EVENT',
  event: {
    elementId: `DIGITAL_SUCCESS_WORKFLOW.RECINDEX_${recIndex}`,
    timestamp: '2026-08-06T09:14:58.508308Z',
    category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
    details: { recIndex },
    legalFactsIds: [
      { key: 'safestorage://legal-fact.pdf', category: LegalFactType.DIGITAL_DELIVERY },
    ],
    isHidden: true,
  },
});

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

const orderedTestIds = (container: HTMLElement, testIds: Array<string>) =>
  Array.from(
    container.querySelectorAll(testIds.map((testId) => `[data-testid="${testId}"]`).join(', '))
  ).map((el) => el.getAttribute('data-testid'));

describe('NotificationEventsTimeline', () => {
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

    expect(within(groupBody).getAllByTestId('timeline-event')).toHaveLength(2);
  });

  it('shows the recipient before the groups only when it changes, on multi-recipient notifications', () => {
    const { getAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={multiRecipients}
        statusHistory={multiRecipientStatusHistory}
        clickHandler={clickHandler}
        isSenderTimeline
      />
    );

    const recipientLabels = getAllByTestId('timeline-group-recipient');
    expect(recipientLabels).toHaveLength(2);
    expect(recipientLabels[0]).toHaveTextContent('Utente Test Uno - TSTUTN00A07A001G');
    expect(recipientLabels[1]).toHaveTextContent('Utente Test Due - TSTUTN00A07A002H');
  });

  it('attaches the header to the event that first introduces a new recipient, so it renders under the correct section', () => {
    const { container, getAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={multiRecipients}
        statusHistory={[
          {
            ...multiRecipientStatusHistory[0],
            steps: [
              multiRecipientStatusHistory[0].steps[0],
              multiRecipientStatusHistory[0].steps[1],
              hiddenEventStepOfRecipient(1),
              multiRecipientStatusHistory[0].steps[2],
            ],
          },
        ]}
        clickHandler={clickHandler}
        isSenderTimeline
      />
    );

    const recipientLabels = getAllByTestId('timeline-group-recipient');
    expect(recipientLabels).toHaveLength(2);
    expect(recipientLabels[0]).toHaveTextContent('Utente Test Uno - TSTUTN00A07A001G');
    expect(recipientLabels[1]).toHaveTextContent('Utente Test Due - TSTUTN00A07A002H');

    expect(
      orderedTestIds(container, [
        'timeline-group-recipient',
        'timeline-group',
        'download-legalfact',
      ])
    ).toStrictEqual([
      'timeline-group-recipient',
      'timeline-group',
      'timeline-group',
      'timeline-group-recipient',
      'download-legalfact',
      'timeline-group',
    ]);
  });

  it('attaches the header to a leading event when it is the first occurrence of a recipient, not to the group after it', () => {
    const { container, getAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={multiRecipients}
        statusHistory={[
          {
            ...multiRecipientStatusHistory[0],
            steps: [hiddenEventStepOfRecipient(0), ...multiRecipientStatusHistory[0].steps],
          },
        ]}
        clickHandler={clickHandler}
        isSenderTimeline
      />
    );

    const recipientLabels = getAllByTestId('timeline-group-recipient');
    expect(recipientLabels).toHaveLength(2);
    expect(recipientLabels[0]).toHaveTextContent('Utente Test Uno - TSTUTN00A07A001G');
    expect(recipientLabels[1]).toHaveTextContent('Utente Test Due - TSTUTN00A07A002H');

    expect(
      orderedTestIds(container, [
        'timeline-group-recipient',
        'timeline-group',
        'download-legalfact',
      ])
    ).toStrictEqual([
      'timeline-group-recipient',
      'download-legalfact',
      'timeline-group',
      'timeline-group',
      'timeline-group-recipient',
      'timeline-group',
    ]);
  });

  it('does not show the recipient at all when a status only has a single, standalone event step', () => {
    const { queryAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={multiRecipients}
        statusHistory={[
          {
            status: NotificationStatus.VIEWED,
            activeFrom: '2026-08-06T09:14:58.508308Z',
            steps: [hiddenEventStepOfRecipient(1)],
          },
        ]}
        clickHandler={clickHandler}
        isSenderTimeline
      />
    );

    expect(queryAllByTestId('timeline-group-recipient')).toHaveLength(0);
  });

  it('does not show the recipient on single recipient notifications', () => {
    const { queryAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        clickHandler={clickHandler}
        isSenderTimeline
      />
    );

    expect(queryAllByTestId('timeline-group-recipient')).toHaveLength(0);
  });

  it('does not show the recipient on the recipient-facing timeline, even with multiple recipients', () => {
    const { queryAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={multiRecipients}
        statusHistory={multiRecipientStatusHistory}
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
