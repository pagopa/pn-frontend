import { fireEvent, waitFor, within, screen } from '@testing-library/react';

import { render } from '../../../test-utils';
import { getNotificationStatusLabelAndColorFromTimelineCategory } from '../../../utils/status.utility';
import { getDay, getMonthString, getTime } from '../../../utils/date.utility';
import {
  INotificationDetailTimeline,
  NotificationStatusHistory,
  TimelineCategory,
} from '../../../types/Notifications';
import { NotificationStatus } from '../../../types/NotificationStatus';
import * as hooks from "../../../hooks/IsMobile.hook";
import NotificationDetailTimeline from '../NotificationDetailTimeline';

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'mocked-id-1',
    timestamp: '2022-03-21T08:56:50.177Z',
    category: TimelineCategory.ANALOG_FAILURE_WORKFLOW,
    details: {
      category: TimelineCategory.ANALOG_FAILURE_WORKFLOW,
      taxdId: '',
    },
  },
  {
    elementId: 'mocked-id-2',
    timestamp: '2022-01-15T08:56:50.177Z',
    category: TimelineCategory.END_OF_ANALOG_DELIVERY_WORKFLOW,
    details: {
      category: TimelineCategory.END_OF_ANALOG_DELIVERY_WORKFLOW,
      taxdId: '',
    },
  }
];

const statusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-1'],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '',
    relatedTimelineElements: ['mocked-timeline-id-2'],
  }
];

const useIsMobileSpy = jest.spyOn(hooks, 'useIsMobile');

const testTimelineRendering = async (container: HTMLElement) => {
  const timelineItems = container.querySelectorAll('[data-testid="timelineItem"]');
    expect(timelineItems).toHaveLength(timeline.length);
    // beacuse of await into loop, we need to use for loop and not forEach
    let timelineIndex = 0;
    for (const item of timelineItems) {
      const dateItems = item.querySelectorAll('p');
      expect(dateItems).toHaveLength(3);
      expect(dateItems[0]).toHaveTextContent(getMonthString(timeline[timelineIndex].timestamp));
      expect(dateItems[1]).toHaveTextContent(getDay(timeline[timelineIndex].timestamp));
      expect(dateItems[2]).toHaveTextContent(getTime(timeline[timelineIndex].timestamp));
      const itemStatus = await within(item).findByTestId('itemStatus');
      expect(itemStatus).toBeInTheDocument();
      const classRoot = 'MuiChip-color';
      const { color, label } = getNotificationStatusLabelAndColorFromTimelineCategory(
        timeline[timelineIndex],
        statusHistory
      );
      const buttonClass = `${classRoot}${color!.charAt(0).toUpperCase() + color!.slice(1)}`;
      expect(itemStatus).toHaveTextContent(label);
      expect(itemStatus.classList.contains(buttonClass)).toBe(true);
      timelineIndex++;
    }
}

describe('NotificationDetailTimeline Component', () => {
  it('renders NotificationDetailTimeline (desktop)', async () => {
    useIsMobileSpy.mockReturnValue(false);
    // render component
    const result = render(
      <NotificationDetailTimeline
        title="mocked-title"
        timeline={timeline}
        statusHistory={statusHistory}
        clickHandler={jest.fn()}
        legalFactLabel="mocked-legalFact-label"
        historyButtonLabel='mocked-history-label'
      />
    );
    expect(result?.container).toHaveTextContent(/mocked-title/i);
    // expect(result?.container).toHaveTextContent(/Scarica tutti gli allegati/i);
    await testTimelineRendering(result?.container);
  });

  it('renders NotificationDetailTimeline (mobile)', async () => {
    useIsMobileSpy.mockReturnValue(true);
    // render component
    const result = render(
      <NotificationDetailTimeline
        title="mocked-title"
        timeline={timeline}
        statusHistory={statusHistory}
        clickHandler={jest.fn()}
        legalFactLabel="mocked-legalFact-label"
        historyButtonLabel='mocked-history-label'
      />
    );
    expect(result?.container).toHaveTextContent(/mocked-title/i);
    const timelineItems = await result?.findAllByTestId('timelineItem');
    expect(timelineItems).toHaveLength(1);
    const historyButton = await result?.findByTestId('historyButton');
    expect(historyButton!).toBeInTheDocument();
    fireEvent.click(historyButton!);
    const drawer = await waitFor(() => {
      return screen.queryByRole('presentation');
    });
    expect(drawer!).toBeInTheDocument();
    await testTimelineRendering(drawer!);
  });
});
