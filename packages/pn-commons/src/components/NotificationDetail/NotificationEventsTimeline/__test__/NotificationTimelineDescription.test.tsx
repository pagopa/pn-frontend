import { vi } from 'vitest';

import {
  INotificationDetailTimeline,
  LegalFactId,
  LegalFactType,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
  RecipientType,
  TimelineCategory,
} from '../../../../models';
import {
  NotificationTimelineEvent,
  NotificationTimelineLegacyStatusHistory,
} from '../../../../models/NotificationTimeline';
import { fireEvent, initLocalizationForTest, render } from '../../../../test-utils';
import { formatTimelineDate } from '../../../../utility/notificationTimeline.utility';
import NotificationTimelineDescription from '../NotificationTimelineDescription';

const firstLegalFact: LegalFactId = {
  key: 'safestorage://first-legal-fact.pdf',
  category: LegalFactType.DIGITAL_DELIVERY,
};

const secondLegalFact: LegalFactId = {
  key: 'safestorage://second-legal-fact.pdf',
  category: LegalFactType.PEC_RECEIPT,
};

const createEvent = (
  overrides: Partial<NotificationTimelineEvent> = {}
): NotificationTimelineEvent => ({
  elementId: 'DIGITAL_SUCCESS_WORKFLOW',
  timestamp: '2026-09-17T10:30:00Z',
  category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
  details: {},
  legalFactsIds: [],
  isHidden: false,
  ...overrides,
});

const createStatus = (
  steps: Array<NotificationTimelineEvent>
): NotificationTimelineLegacyStatusHistory => ({
  status: NotificationStatus.VIEWED,
  activeFrom: '2026-09-17T10:30:00Z',
  relatedTimelineElements: [],
  steps,
});

const createLegacyEvent = (
  overrides: Partial<INotificationDetailTimeline> = {}
): INotificationDetailTimeline => ({
  elementId: 'NOTIFICATION_VIEWED',
  timestamp: '2026-09-17T10:30:00Z',
  category: TimelineCategory.NOTIFICATION_VIEWED,
  details: {},
  legalFactsIds: [],
  hidden: true,
  ...overrides,
});

const createLegacyStatus = (
  steps: Array<INotificationDetailTimeline>
): NotificationStatusHistory => ({
  status: NotificationStatus.VIEWED,
  activeFrom: '2026-09-17T10:30:00Z',
  relatedTimelineElements: [],
  steps,
});

describe('NotificationTimelineDescription', () => {
  const clickHandler = vi.fn();

  beforeAll(() => {
    initLocalizationForTest();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the description without legal-fact buttons', () => {
    const event = createEvent();

    const { getByText, queryByRole } = render(
      <NotificationTimelineDescription
        description="Descrizione senza documenti."
        event={event}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    expect(getByText('Descrizione senza documenti.')).toBeInTheDocument();
    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the event legal fact inline when the new copy is enabled', () => {
    const event = createEvent({
      legalFactsIds: [firstLegalFact],
    });

    const { getByRole } = render(
      <NotificationTimelineDescription
        description="Puoi scaricare l'<0>attestazione</0>."
        event={event}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(firstLegalFact);
  });

  it('renders a single legal fact below the description when the new copy is disabled', () => {
    const event = createEvent({
      legalFactsIds: [firstLegalFact],
    });

    const { getByRole, container } = render(
      <NotificationTimelineDescription
        description="Descrizione legacy."
        event={event}
        clickHandler={clickHandler}
      />
    );

    const button = getByRole('button');

    expect(container).toHaveTextContent('Descrizione legacy.');
    expect(button).toHaveTextContent(
      'notifiche - detail.legalfact: notifiche - detail.timeline.legalfact.digital-delivery-success'
    );

    fireEvent.click(button);
    expect(clickHandler).toHaveBeenCalledWith(firstLegalFact);
  });

  it('renders multiple legal facts below the description even when the new copy is enabled', () => {
    const event = createEvent({
      legalFactsIds: [firstLegalFact, secondLegalFact],
    });

    const { getAllByRole } = render(
      <NotificationTimelineDescription
        description="Descrizione con più documenti."
        event={event}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    const buttons = getAllByRole('button');

    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    expect(clickHandler).toHaveBeenNthCalledWith(1, firstLegalFact);
    expect(clickHandler).toHaveBeenNthCalledWith(2, secondLegalFact);
  });

  it('shows the recipient next to status legal facts for a multi-recipient sender timeline', () => {
    const recipients: Array<NotificationDetailRecipient> = [
      {
        recipientType: RecipientType.PF,
        denomination: 'Destinatario Test Uno',
        taxId: 'TSTTNO00A00A000A',
      },
      {
        recipientType: RecipientType.PF,
        denomination: 'Destinatario Test Due',
        taxId: 'TSTTDU00A00A000B',
      },
    ];
    const firstEvent = createEvent({
      elementId: 'FIRST_HIDDEN_EVENT',
      details: { recIndex: 0 },
      isHidden: true,
      legalFactsIds: [firstLegalFact],
    });
    const secondEvent = createEvent({
      elementId: 'SECOND_HIDDEN_EVENT',
      details: { recIndex: 1 },
      isHidden: true,
      legalFactsIds: [secondLegalFact],
    });

    const { getAllByTestId } = render(
      <NotificationTimelineDescription
        description="Descrizione con attestazioni."
        status={createStatus([firstEvent, secondEvent])}
        recipients={recipients}
        isSenderTimeline
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    const legalFactsLabel = getAllByTestId('download-legalfact');
    expect(legalFactsLabel).toHaveLength(2);
    expect(legalFactsLabel[0]).toHaveTextContent('Destinatario Test Uno (TSTTNO00A00A000A)');
    expect(legalFactsLabel[1]).toHaveTextContent('Destinatario Test Due (TSTTDU00A00A000B)');
  });

  it('does not show the recipient next to legal facts outside the sender timeline and with only one recipient', () => {
    const recipients: Array<NotificationDetailRecipient> = [
      {
        recipientType: RecipientType.PF,
        denomination: 'Destinatario Test Uno',
        taxId: 'TSTTNO00A00A000A',
      },
    ];
    const event = createEvent({
      details: { recIndex: 0 },
      isHidden: true,
      legalFactsIds: [firstLegalFact, secondLegalFact],
    });

    const { getAllByTestId } = render(
      <NotificationTimelineDescription
        description="Descrizione con attestazioni."
        status={createStatus([event])}
        recipients={recipients}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    const legalFactsLabel = getAllByTestId('download-legalfact');
    expect(legalFactsLabel).toHaveLength(2);
    expect(legalFactsLabel[0]).not.toHaveTextContent('Destinatario Test Uno (TSTTNO00A00A000A)');
    expect(legalFactsLabel[1]).not.toHaveTextContent('Destinatario Test Uno (TSTTNO00A00A000A)');
  });

  it('extracts legal facts from a status only when all its events are hidden', () => {
    const hiddenEvent = createEvent({
      isHidden: true,
      legalFactsIds: [firstLegalFact],
    });

    const { getByRole } = render(
      <NotificationTimelineDescription
        description="Scarica l'<0>attestazione</0>."
        status={createStatus([hiddenEvent])}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    fireEvent.click(getByRole('button'));

    expect(clickHandler).toHaveBeenCalledWith(firstLegalFact);
  });

  it('does not extract status legal facts when at least one event is visible', () => {
    const hiddenEvent = createEvent({
      elementId: 'HIDDEN_EVENT',
      isHidden: true,
      legalFactsIds: [firstLegalFact],
    });
    const visibleEvent = createEvent({
      elementId: 'VISIBLE_EVENT',
      isHidden: false,
    });

    const { queryByRole } = render(
      <NotificationTimelineDescription
        description="Descrizione senza link inline."
        status={createStatus([hiddenEvent, visibleEvent])}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('supports legacy statuses', () => {
    const event = createLegacyEvent({
      hidden: true,
      legalFactsIds: [firstLegalFact],
    });

    const { getByRole } = render(
      <NotificationTimelineDescription
        description="Scarica l'<0>attestazione</0>."
        legacyStatus={createLegacyStatus([event])}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    fireEvent.click(getByRole('button'));

    expect(clickHandler).toHaveBeenCalledWith(firstLegalFact);
  });

  it('renders title, description and date', () => {
    const event = createEvent();
    const { getByTestId, container } = render(
      <NotificationTimelineDescription
        title="Evento digitale"
        description="Descrizione evento."
        date={event.timestamp}
        language="it"
        event={event}
        clickHandler={clickHandler}
      />
    );

    expect(container).toHaveTextContent('Evento digitale - Descrizione evento.');
    expect(getByTestId('dateItem')).toHaveTextContent(formatTimelineDate(event.timestamp, 'it'));
  });

  it('renders the perfection link next to a legal fact, addressed by name', () => {
    const event = createEvent({
      legalFactsIds: [firstLegalFact],
    });

    const { getByTestId } = render(
      <NotificationTimelineDescription
        description="Scarica l'<0>avviso</0>. Consulta le <PerfectionLink>modalità di perfezionamento</PerfectionLink>."
        event={event}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
        perfectionLink="https://fake.perfezionamento.it"
      />
    );

    expect(getByTestId('download-legalfact-micro')).toBeInTheDocument();

    const link = getByTestId('perfection-link');
    expect(link).toHaveAttribute('href', 'https://fake.perfezionamento.it');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders the perfection link when the event carries no legal fact', () => {
    const event = createEvent();

    const { getByTestId, queryByTestId } = render(
      <NotificationTimelineDescription
        description="Consulta le <PerfectionLink>modalità di perfezionamento</PerfectionLink>."
        event={event}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
        perfectionLink="https://fake.perfezionamento.it"
      />
    );

    expect(queryByTestId('download-legalfact-micro')).not.toBeInTheDocument();
    expect(getByTestId('perfection-link')).toHaveAttribute(
      'href',
      'https://fake.perfezionamento.it'
    );
  });

  it('renders the perfection link also when several legal facts push the description to the other branch', () => {
    const event = createEvent({
      legalFactsIds: [firstLegalFact, secondLegalFact],
    });

    const { getByTestId } = render(
      <NotificationTimelineDescription
        description="Consulta le <PerfectionLink>modalità di perfezionamento</PerfectionLink>."
        event={event}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
        perfectionLink="https://fake.perfezionamento.it"
      />
    );

    expect(getByTestId('perfection-link')).toHaveAttribute(
      'href',
      'https://fake.perfezionamento.it'
    );
  });

  it('renders no perfection link when the prop is not given', () => {
    const event = createEvent();

    const { queryByTestId } = render(
      <NotificationTimelineDescription
        description="Consulta le <PerfectionLink>modalità di perfezionamento</PerfectionLink>."
        event={event}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    expect(queryByTestId('perfection-link')).not.toBeInTheDocument();
  });
});
