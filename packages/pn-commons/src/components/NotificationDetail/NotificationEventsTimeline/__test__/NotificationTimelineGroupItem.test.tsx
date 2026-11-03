import { vi } from 'vitest';

import { notificationTimelineDTO } from '../../../../__mocks__/NotificationTimeline.mock';
import { TimelineCategory } from '../../../../models';
import {
  NotificationTimelineEvent,
  NotificationTimelineGroup,
  NotificationTimelineGroupCategory,
  TimelineEventsChannel,
} from '../../../../models/NotificationTimeline';
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

const createPecEvent = (
  id: string,
  category: TimelineCategory,
  address?: string,
  source?: string
): NotificationTimelineEvent =>
  ({
    elementId: `${id}${source ? `.SOURCE_${source}` : ''}`,
    timestamp: '2026-10-22T10:00:00Z',
    category,
    details: {
      recIndex: 0,
      ...(address
        ? {
            digitalAddress: {
              type: 'PEC',
              address,
            },
          }
        : {}),
      ...(source ? { digitalAddressSource: source } : {}),
    },
    legalFactsIds: [],
    isHidden: false,
  } as NotificationTimelineEvent);

const createPecGroup = (events: Array<NotificationTimelineEvent>): NotificationTimelineGroup => ({
  ...analogGroup,
  groupId: 'pec-group-test',
  category: NotificationTimelineGroupCategory.DIGITAL,
  channel: TimelineEventsChannel.PEC,
  registeredLetterCode: undefined,
  events,
});

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

  describe('General behavior', () => {
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
      expect(
        within(reworkedContainer).getByText('status.reworked-status-group')
      ).toBeInTheDocument();
    });
  });

  describe('PEC timeline sections', () => {
    it('renders events with the same PEC address and source in one group', () => {
      const first = createPecEvent(
        'SEND_DIGITAL_DOMICILE',
        TimelineCategory.SEND_DIGITAL_DOMICILE,
        'recipient@example.test',
        'SPECIAL'
      );
      const second = createPecEvent(
        'SEND_DIGITAL_FEEDBACK',
        TimelineCategory.SEND_DIGITAL_FEEDBACK,
        'recipient@example.test',
        'SPECIAL'
      );

      const { getByTestId, getAllByTestId } = renderGroup(createPecGroup([first, second]));

      fireEvent.click(getByTestId('timeline-group-header'));

      const addressGroup = getByTestId('timeline-pec-address-group');

      expect(addressGroup).toHaveTextContent('recipient@example.test');
      expect(within(addressGroup).getAllByTestId('timeline-event')).toHaveLength(2);
      expect(getAllByTestId('timeline-pec-address-group')).toHaveLength(1);
    });

    it('renders separate PEC groups for the same address with different sources', () => {
      const address = 'recipient@example.test';

      const specialFeedback = createPecEvent(
        'SPECIAL_FEEDBACK',
        TimelineCategory.SEND_DIGITAL_FEEDBACK,
        address,
        'SPECIAL'
      );
      const specialProgress = createPecEvent(
        'SPECIAL_PROGRESS',
        TimelineCategory.SEND_DIGITAL_PROGRESS,
        address,
        'SPECIAL'
      );
      const specialDomicile = createPecEvent(
        'SPECIAL_DOMICILE',
        TimelineCategory.SEND_DIGITAL_DOMICILE,
        address,
        'SPECIAL'
      );

      const platformFeedback = createPecEvent(
        'PLATFORM_FEEDBACK',
        TimelineCategory.SEND_DIGITAL_FEEDBACK,
        address,
        'PLATFORM'
      );
      const platformProgress = createPecEvent(
        'PLATFORM_PROGRESS',
        TimelineCategory.SEND_DIGITAL_PROGRESS,
        address,
        'PLATFORM'
      );
      const platformDomicile = createPecEvent(
        'PLATFORM_DOMICILE',
        TimelineCategory.SEND_DIGITAL_DOMICILE,
        address,
        'PLATFORM'
      );

      const { getByTestId, getAllByTestId } = renderGroup(
        createPecGroup([
          specialFeedback,
          specialProgress,
          specialDomicile,
          platformFeedback,
          platformProgress,
          platformDomicile,
        ])
      );

      fireEvent.click(getByTestId('timeline-group-header'));

      const addressGroups = getAllByTestId('timeline-pec-address-group');

      expect(addressGroups).toHaveLength(2);

      expect(addressGroups[0]).toHaveTextContent(address);
      expect(addressGroups[1]).toHaveTextContent(address);

      expect(within(addressGroups[0]).getAllByTestId('timeline-event')).toHaveLength(2);
      expect(within(addressGroups[1]).getAllByTestId('timeline-event')).toHaveLength(2);

      expect(
        within(addressGroups[0]).getByTestId('timeline-pec-source-description')
      ).toHaveTextContent('detail.timeline.pec-address-source-special');
      expect(
        within(addressGroups[1]).getByTestId('timeline-pec-source-description')
      ).toHaveTextContent('detail.timeline.pec-address-source-platform');
    });

    it('renders different PEC addresses in separate groups', () => {
      const first = createPecEvent(
        'FIRST',
        TimelineCategory.SEND_DIGITAL_DOMICILE,
        'first@pec.it',
        'SPECIAL'
      );
      const second = createPecEvent(
        'SECOND',
        TimelineCategory.SEND_DIGITAL_DOMICILE,
        'second@pec.it',
        'PLATFORM'
      );

      const { getByTestId, getAllByTestId } = renderGroup(createPecGroup([first, second]));

      fireEvent.click(getByTestId('timeline-group-header'));

      const addressGroups = getAllByTestId('timeline-pec-address-group');

      expect(addressGroups).toHaveLength(2);
      expect(addressGroups[0]).toHaveTextContent('first@pec.it');
      expect(addressGroups[1]).toHaveTextContent('second@pec.it');

      expect(within(addressGroups[0]).getAllByTestId('timeline-event')).toHaveLength(1);
      expect(within(addressGroups[1]).getAllByTestId('timeline-event')).toHaveLength(1);
    });

    it.each([
      ['SPECIAL', 'detail.timeline.pec-address-source-special'],
      ['PLATFORM', 'detail.timeline.pec-address-source-platform'],
      ['GENERAL', 'detail.timeline.pec-address-source-general'],
    ])('renders the correct description for PEC source %s', (source, labelKey) => {
      const event = createPecEvent(
        'SEND_DIGITAL_DOMICILE',
        TimelineCategory.SEND_DIGITAL_DOMICILE,
        'source@pec.it',
        source
      );

      const { getByTestId } = renderGroup(createPecGroup([event]));

      fireEvent.click(getByTestId('timeline-group-header'));

      expect(getByTestId('timeline-pec-source-description')).toHaveTextContent(labelKey);
    });

    it('does not render a source description when the PEC source is unknown', () => {
      const event = createPecEvent(
        'SEND_DIGITAL_DOMICILE',
        TimelineCategory.SEND_DIGITAL_DOMICILE,
        'unknown@pec.it'
      );

      const { getByTestId, queryByTestId } = renderGroup(createPecGroup([event]));

      fireEvent.click(getByTestId('timeline-group-header'));

      expect(getByTestId('timeline-pec-address-group')).toHaveTextContent('unknown@pec.it');
      expect(queryByTestId('timeline-pec-source-description')).not.toBeInTheDocument();
    });

    it('keeps general workflow events outside PEC address groups', () => {
      const pecEvent = createPecEvent(
        'SEND_DIGITAL_DOMICILE',
        TimelineCategory.SEND_DIGITAL_DOMICILE,
        'first@pec.it',
        'SPECIAL'
      );
      const workflowEvent = createPecEvent(
        'DIGITAL_SUCCESS_WORKFLOW',
        TimelineCategory.DIGITAL_SUCCESS_WORKFLOW
      );

      const { getByTestId, getAllByTestId } = renderGroup(
        createPecGroup([pecEvent, workflowEvent])
      );

      fireEvent.click(getByTestId('timeline-group-header'));

      const addressGroup = getByTestId('timeline-pec-address-group');
      const body = getByTestId('timeline-group-body');

      expect(within(addressGroup).getAllByTestId('timeline-event')).toHaveLength(1);
      expect(within(body).getAllByTestId('timeline-event')).toHaveLength(2);

      const directListItems = Array.from(body.children).filter(
        (element) => element.tagName === 'LI'
      );

      expect(directListItems).toHaveLength(2);
      expect(getAllByTestId('timeline-pec-address-group')).toHaveLength(1);
    });

    it('does not introduce PEC address groups for non-PEC channels', () => {
      const event = createPecEvent(
        'SEND_DIGITAL_DOMICILE',
        TimelineCategory.SEND_DIGITAL_DOMICILE,
        'first@pec.it',
        'SPECIAL'
      );

      const nonPecGroup: NotificationTimelineGroup = {
        ...createPecGroup([event]),
        channel: TimelineEventsChannel.SERCQ,
      };

      const { getByTestId, queryByTestId } = renderGroup(nonPecGroup);

      fireEvent.click(getByTestId('timeline-group-header'));

      expect(queryByTestId('timeline-pec-address-group')).not.toBeInTheDocument();
      expect(
        within(getByTestId('timeline-group-body')).getAllByTestId('timeline-event')
      ).toHaveLength(1);
    });
  });
});
