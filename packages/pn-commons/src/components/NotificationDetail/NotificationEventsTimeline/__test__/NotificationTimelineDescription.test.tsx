import { vi } from 'vitest';

import { LegalFactId, LegalFactType, TimelineCategory } from '../../../../models';
import { NotificationTimelineEvent } from '../../../../models/NotificationTimeline';
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

  it('renders the supplied legal fact inline', () => {
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

  it('does not list an inline legal fact a second time below the description', () => {
    const event = createEvent({
      legalFactsIds: [firstLegalFact],
    });

    const { getAllByRole } = render(
      <NotificationTimelineDescription
        description="Puoi scaricare l'<0>attestazione</0>."
        event={event}
        inlineLegalFact={{ event, lf: firstLegalFact }}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    expect(getAllByRole('button')).toHaveLength(1);
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
});
