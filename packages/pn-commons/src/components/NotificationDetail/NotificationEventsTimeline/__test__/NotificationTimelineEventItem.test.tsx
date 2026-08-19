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
