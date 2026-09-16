import { vi } from 'vitest';

import { notificationTimelineDTO } from '../../../../__mocks__/NotificationTimeline.mock';
import { TimelineCategory } from '../../../../models/NotificationDetail';
import { NotificationTimelineEvent } from '../../../../models/NotificationTimeline';
import { fireEvent, render, within } from '../../../../test-utils';
import {
  getLegalFactLabel,
  getNotificationTimelineStatusInfos,
} from '../../../../utility/notification.utility';
import {
  flattenTimelineSteps,
  formatTimelineDate,
} from '../../../../utility/notificationTimeline.utility';
import NotificationTimelineEventItem from '../NotificationTimelineEventItem';

const [viewedStatus, deliveringStatus] = notificationTimelineDTO.notificationStatusHistory;

const recipients = notificationTimelineDTO.recipients;
const allEvents = flattenTimelineSteps(deliveringStatus.steps);

const visibleEvent = allEvents[allEvents.length - 1];

const hiddenEvent = flattenTimelineSteps(viewedStatus.steps)[0];

const eventWithLegalFacts: NotificationTimelineEvent = {
  ...visibleEvent,
  legalFactsIds: hiddenEvent.legalFactsIds,
};

const clickHandler = vi.fn();

const renderEvent = (event: NotificationTimelineEvent, props?: Record<string, unknown>) =>
  render(
    <NotificationTimelineEventItem
      event={event}
      allEvents={allEvents}
      recipients={recipients}
      clickHandler={clickHandler}
      disableDownloads={false}
      language="it"
      {...props}
    />
  );

describe('NotificationTimelineEventItem', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders label, description, date and reworked tag of a visible event', () => {
    const { getByTestId } = renderEvent(visibleEvent);

    const statusInfo = getNotificationTimelineStatusInfos(visibleEvent, recipients, allEvents);
    const item = getByTestId('timeline-event');
    expect(item).toHaveTextContent(statusInfo!.label);
    expect(item).toHaveTextContent(statusInfo!.description as string);
    expect(getByTestId('dateItem')).toHaveTextContent(
      formatTimelineDate(visibleEvent.timestamp, 'it')
    );
    // l'evento del mock è rettificato come non valido
    expect(item).toHaveTextContent('status.reworked-status-not-valid');
  });

  it('downloads the legal facts of a visible event', () => {
    const { getAllByTestId } = renderEvent(eventWithLegalFacts);

    const legalFact = eventWithLegalFacts.legalFactsIds![0];
    const legalFactButtons = getAllByTestId('download-legalfact-micro');
    expect(legalFactButtons).toHaveLength(1);
    expect(legalFactButtons[0]).toHaveTextContent(
      getLegalFactLabel(eventWithLegalFacts, legalFact.category, legalFact.key)
    );

    fireEvent.click(legalFactButtons[0]);
    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(legalFact);
  });

  it('renders the legal fact inline and downloads it when the new copy is enabled', () => {
    const legalFact = eventWithLegalFacts.legalFactsIds![0];
    const statusInfo = getNotificationTimelineStatusInfos(
      eventWithLegalFacts,
      recipients,
      allEvents
    );

    const eventWithInlineCopy: NotificationTimelineEvent = {
      ...eventWithLegalFacts,
    };

    const { container, getByRole, queryByTestId } = renderEvent(eventWithInlineCopy, {
      isNewTimelineCopyEnabled: true,
    });

    const inlineButton = getByRole('button');

    expect(container).toHaveTextContent(statusInfo!.description as string);
    expect(inlineButton).toBeInTheDocument();
    expect(queryByTestId('download-legalfact-micro')).not.toBeInTheDocument();

    fireEvent.click(inlineButton);

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(legalFact);
  });

  it('uses the first legal fact for the inline download', () => {
    const secondLegalFact = {
      ...eventWithLegalFacts.legalFactsIds![0],
      key: 'safestorage://second-legal-fact.pdf',
    };
    const eventWithMultipleLegalFacts = {
      ...eventWithLegalFacts,
      legalFactsIds: [eventWithLegalFacts.legalFactsIds![0], secondLegalFact],
    };

    const { getByRole } = renderEvent(eventWithMultipleLegalFacts, {
      isNewTimelineCopyEnabled: true,
    });

    fireEvent.click(getByRole('button'));

    expect(clickHandler).toHaveBeenCalledWith(eventWithMultipleLegalFacts.legalFactsIds[0]);
  });

  it('does not render the legacy legal-fact list when the new copy is enabled', () => {
    const { queryByTestId } = renderEvent(eventWithLegalFacts, {
      isNewTimelineCopyEnabled: true,
    });

    expect(queryByTestId('download-legalfact-micro')).not.toBeInTheDocument();
    expect(queryByTestId('download-legalfact')).not.toBeInTheDocument();
  });

  it('preserves the legacy legal-fact rendering when the new copy is disabled', () => {
    const { getByTestId } = renderEvent(eventWithLegalFacts, {
      isNewTimelineCopyEnabled: false,
    });

    expect(getByTestId('download-legalfact-micro')).toBeInTheDocument();
  });

  it('does not render an event when all status events are hidden and the new copy is enabled', () => {
    const firstHiddenEvent = {
      ...hiddenEvent,
      elementId: 'FIRST_HIDDEN_EVENT',
    };
    const secondHiddenEvent = {
      ...hiddenEvent,
      elementId: 'SECOND_HIDDEN_EVENT',
    };

    const { container } = renderEvent(firstHiddenEvent, {
      allEvents: [firstHiddenEvent, secondHiddenEvent],
      isNewTimelineCopyEnabled: true,
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('still renders status events when at least one event is visible and the new copy is enabled', () => {
    const { getByTestId } = renderEvent(visibleEvent, {
      allEvents: [hiddenEvent, visibleEvent],
      isNewTimelineCopyEnabled: true,
    });

    expect(getByTestId('timeline-event')).toBeInTheDocument();
  });

  it('renders only the legal facts of a hidden event, nothing if it has none', () => {
    const { container } = renderEvent(hiddenEvent);
    expect(within(container).queryByTestId('timeline-event')).not.toBeInTheDocument();
    expect(within(container).getAllByTestId('download-legalfact')).toHaveLength(1);

    const { container: emptyContainer } = renderEvent({ ...hiddenEvent, legalFactsIds: [] });
    expect(emptyContainer).toBeEmptyDOMElement();
  });

  it('renders as a list item when asBullet is set', () => {
    const { container } = renderEvent(visibleEvent, { asBullet: true });

    const item = within(container).getByTestId('timeline-event');
    expect(item.tagName).toBe('LI');
    const statusInfo = getNotificationTimelineStatusInfos(visibleEvent, recipients, allEvents);
    expect(item).toHaveTextContent(`${statusInfo!.label} - ${statusInfo!.description}`);

    const { container: bulletContainer } = renderEvent(hiddenEvent, { asBullet: true });
    expect(within(bulletContainer).getAllByTestId('download-legalfact-micro')).toHaveLength(1);
  });

  it('wraps a hidden event in a <li> when rendered inside a bullet list', () => {
    const { container } = renderEvent(hiddenEvent, { asBullet: true });

    const legalFactButton = within(container).getByTestId('download-legalfact-micro');
    expect(legalFactButton.closest('li')).not.toBeNull();

    const { container: noListContainer } = renderEvent(hiddenEvent);
    const legalFactButtonNoList = within(noListContainer).getByTestId('download-legalfact');
    expect(legalFactButtonNoList.closest('li')).toBeNull();
  });

  it('disables the download when disableDownloads is set, except for the cancelled notification', () => {
    const { container } = renderEvent(eventWithLegalFacts, { disableDownloads: true });
    expect(within(container).getByTestId('download-legalfact-micro')).toBeDisabled();

    const cancelledEvent: NotificationTimelineEvent = {
      ...eventWithLegalFacts,
      category: TimelineCategory.NOTIFICATION_CANCELLED,
    };
    const { container: cancelledContainer } = renderEvent(cancelledEvent, {
      disableDownloads: true,
    });
    expect(within(cancelledContainer).getByTestId('download-legalfact-micro')).toBeEnabled();
  });
});
