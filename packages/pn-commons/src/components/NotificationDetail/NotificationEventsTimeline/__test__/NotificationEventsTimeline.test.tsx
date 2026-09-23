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
  events: [
    {
      elementId: `${groupId}.VISIBLE_EVENT`,
      timestamp: '2026-08-06T09:14:58.508308Z',
      category: TimelineCategory.REQUEST_ACCEPTED,
      details: { recIndex },
      legalFactsIds: [],
      isHidden: false,
    },
  ],
});

const hiddenEventStepOfRecipient = (
  recIndex: number,
  category: TimelineCategory,
  legalFactType: LegalFactType
): NotificationTimelineStep => ({
  stepType: 'EVENT',
  event: {
    elementId: `${category}.RECINDEX_${recIndex}`,
    timestamp: '2026-08-06T09:14:58.508308Z',
    category,
    details: { recIndex },
    legalFactsIds: [{ key: 'safestorage://legal-fact.pdf', category: legalFactType }],
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
              hiddenEventStepOfRecipient(
                1,
                TimelineCategory.NOTIFICATION_VIEWED,
                LegalFactType.RECIPIENT_ACCESS
              ),
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
            steps: [
              hiddenEventStepOfRecipient(
                0,
                TimelineCategory.NOTIFICATION_VIEWED,
                LegalFactType.RECIPIENT_ACCESS
              ),
              ...multiRecipientStatusHistory[0].steps,
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
      'download-legalfact',
      'timeline-group',
      'timeline-group',
      'timeline-group-recipient',
      'timeline-group',
    ]);
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

  it('renders a status legal fact inline when all its events are hidden and the new copy is enabled', () => {
    const statusWithHiddenEvent: NotificationTimelineStatusHistory = {
      status: NotificationStatus.VIEWED,
      activeFrom: '2026-08-06T09:14:58.508308Z',
      steps: [
        hiddenEventStepOfRecipient(
          0,
          TimelineCategory.NOTIFICATION_VIEWED,
          LegalFactType.RECIPIENT_ACCESS
        ),
      ],
    };

    const legalFact =
      statusWithHiddenEvent.steps[0].stepType === 'EVENT'
        ? statusWithHiddenEvent.steps[0].event.legalFactsIds![0]
        : undefined;

    const { getByRole, queryByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={[statusWithHiddenEvent]}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    expect(queryByTestId('timeline-event')).not.toBeInTheDocument();

    fireEvent.click(getByRole('button'));

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(legalFact);
  });

  it('disables a status legal fact when downloads are disabled', () => {
    const statusWithHiddenEvent: NotificationTimelineStatusHistory = {
      status: NotificationStatus.VIEWED,
      activeFrom: '2026-08-06T09:14:58.508308Z',
      steps: [
        hiddenEventStepOfRecipient(
          0,
          TimelineCategory.NOTIFICATION_VIEWED,
          LegalFactType.RECIPIENT_ACCESS
        ),
      ],
    };

    const { getByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={[statusWithHiddenEvent]}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
        disableDownloads
      />
    );

    expect(getByTestId('download-legalfact')).toBeDisabled();
  });

  it('renders a status legal fact below the description when the new copy is disabled', () => {
    const statusWithHiddenEvent: NotificationTimelineStatusHistory = {
      status: NotificationStatus.VIEWED,
      activeFrom: '2026-08-06T09:14:58.508308Z',
      steps: [
        hiddenEventStepOfRecipient(
          0,
          TimelineCategory.NOTIFICATION_VIEWED,
          LegalFactType.RECIPIENT_ACCESS
        ),
      ],
    };

    const legalFact =
      statusWithHiddenEvent.steps[0].stepType === 'EVENT'
        ? statusWithHiddenEvent.steps[0].event.legalFactsIds![0]
        : undefined;

    const { getByRole, queryByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={[statusWithHiddenEvent]}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled={false}
      />
    );

    expect(queryByTestId('timeline-event')).not.toBeInTheDocument();

    fireEvent.click(getByRole('button'));

    expect(clickHandler).toHaveBeenCalledWith(legalFact);
  });

  it('renders multiple status legal facts under their recipients', () => {
    const firstLegalFact = {
      key: 'safestorage://fictional-first-attestation.pdf',
      category: LegalFactType.DIGITAL_DELIVERY,
    };
    const secondLegalFact = {
      key: 'safestorage://fictional-second-attestation.pdf',
      category: LegalFactType.DIGITAL_DELIVERY,
    };

    const status: NotificationTimelineStatusHistory = {
      status: NotificationStatus.DELIVERED,
      activeFrom: '2026-08-06T09:14:58.508308Z',
      steps: [
        {
          stepType: 'EVENT',
          event: {
            elementId: 'FICTIONAL_VIEWED_EVENT_0',
            timestamp: '2026-08-06T09:14:58.508308Z',
            category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
            details: { recIndex: 0 },
            legalFactsIds: [firstLegalFact],
            isHidden: true,
          },
        },
        {
          stepType: 'EVENT',
          event: {
            elementId: 'FICTIONAL_VIEWED_EVENT_1',
            timestamp: '2026-08-06T09:15:58.508308Z',
            category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
            details: { recIndex: 1 },
            legalFactsIds: [secondLegalFact],
            isHidden: true,
          },
        },
      ],
    };

    const { container, getAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={multiRecipients}
        statusHistory={[status]}
        clickHandler={clickHandler}
        isSenderTimeline
        isNewTimelineCopyEnabled
      />
    );

    const recipients = getAllByTestId('timeline-group-recipient');
    expect(recipients).toHaveLength(2);
    expect(recipients[0]).toHaveTextContent('Utente Test Uno - TSTUTN00A07A001G');
    expect(recipients[1]).toHaveTextContent('Utente Test Due - TSTUTN00A07A002H');

    const legalFacts = getAllByTestId('download-legalfact-micro');
    expect(legalFacts).toHaveLength(2);

    expect(
      orderedTestIds(container, ['timeline-group-recipient', 'download-legalfact-micro'])
    ).toStrictEqual([
      'timeline-group-recipient',
      'download-legalfact-micro',
      'timeline-group-recipient',
      'download-legalfact-micro',
    ]);

    fireEvent.click(legalFacts[0]);
    fireEvent.click(legalFacts[1]);

    expect(clickHandler).toHaveBeenNthCalledWith(1, firstLegalFact);
    expect(clickHandler).toHaveBeenNthCalledWith(2, secondLegalFact);
  });

  it('embeds a single status legal fact in the status description without duplicating its event', () => {
    const statusWithEmbeddedLegalFact: NotificationTimelineStatusHistory = {
      status: NotificationStatus.VIEWED,
      activeFrom: '2026-08-06T09:14:58.508308Z',
      steps: [
        hiddenEventStepOfRecipient(
          0,
          TimelineCategory.NOTIFICATION_VIEWED,
          LegalFactType.RECIPIENT_ACCESS
        ),
      ],
    };

    const legalFact =
      statusWithEmbeddedLegalFact.steps[0].stepType === 'EVENT'
        ? statusWithEmbeddedLegalFact.steps[0].event.legalFactsIds![0]
        : undefined;

    const { getAllByRole, queryByTestId } = render(
      <NotificationEventsTimeline
        recipients={multiRecipients}
        statusHistory={[statusWithEmbeddedLegalFact]}
        clickHandler={clickHandler}
        isSenderTimeline
        isNewTimelineCopyEnabled
      />
    );

    const buttons = getAllByRole('button');

    expect(buttons).toHaveLength(1);
    expect(queryByTestId('timeline-event')).not.toBeInTheDocument();

    expect(queryByTestId('timeline-group-recipient')).not.toBeInTheDocument();

    fireEvent.click(buttons[0]);
    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(legalFact);
  });

  it('renders a hidden event when its category is not absorbed by the status', () => {
    const hiddenStep = hiddenEventStepOfRecipient(
      0,
      TimelineCategory.DELIVERED,
      LegalFactType.DIGITAL_DELIVERY
    );
    const visibleStep: NotificationTimelineStep = {
      stepType: 'EVENT',
      event: {
        elementId: 'VISIBLE_EVENT',
        timestamp: '2026-08-06T09:14:58.508308Z',
        category: TimelineCategory.DELIVERED,
        details: { recIndex: 0 },
        legalFactsIds: [],
        isHidden: false,
      },
    };

    const { getAllByTestId } = render(
      <NotificationEventsTimeline
        recipients={recipients}
        statusHistory={[
          {
            status: NotificationStatus.DELIVERED,
            activeFrom: '2026-08-06T09:14:58.508308Z',
            steps: [hiddenStep, visibleStep],
          },
        ]}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    const timelineEvents = getAllByTestId('timeline-event');
    expect(timelineEvents).toHaveLength(2);
  });

  it('keeps the correct recipient after removing an event embedded in the status description', () => {
    const inlineLegalFact = {
      key: 'safestorage://fictional-inline-legal-fact.pdf',
      category: LegalFactType.RECIPIENT_ACCESS,
    };

    const absorbedStep: NotificationTimelineStep = {
      stepType: 'EVENT',
      event: {
        elementId: 'VIEWED_RECIPIENT_0',
        timestamp: '2026-08-06T09:14:58.508308Z',
        category: TimelineCategory.NOTIFICATION_VIEWED,
        details: { recIndex: 0 },
        legalFactsIds: [inlineLegalFact],
        isHidden: true,
      },
    };

    const visibleStep: NotificationTimelineStep = {
      stepType: 'EVENT',
      event: {
        elementId: 'VISIBLE_EVENT_RECIPIENT_1',
        timestamp: '2026-08-06T09:15:58.508308Z',
        category: TimelineCategory.NOTIFICATION_VIEWED,
        details: { recIndex: 1 },
        legalFactsIds: [],
        isHidden: false,
      },
    };

    const { getByTestId, getAllByRole } = render(
      <NotificationEventsTimeline
        recipients={multiRecipients}
        statusHistory={[
          {
            status: NotificationStatus.VIEWED,
            activeFrom: '2026-08-06T09:14:58.508308Z',
            steps: [absorbedStep, visibleStep],
          },
        ]}
        clickHandler={clickHandler}
        isSenderTimeline
        isNewTimelineCopyEnabled
      />
    );

    expect(getByTestId('timeline-group-recipient')).toHaveTextContent(
      'Utente Test Due - TSTUTN00A07A002H'
    );
    expect(getByTestId('timeline-event')).toBeInTheDocument();

    fireEvent.click(getAllByRole('button')[0]);
    expect(clickHandler).toHaveBeenCalledWith(inlineLegalFact);
  });
});
