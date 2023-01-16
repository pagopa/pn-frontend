import React from 'react';

import { fireEvent, waitFor, screen } from '@testing-library/react';

import { render } from '../../../test-utils';
import * as hooks from '../../../hooks/useIsMobile';
import {
  formatDay,
  formatMonthString,
  formatTime,
  getNotificationStatusInfos,
} from '../../../utils';
import { parsedNotification } from '../../../utils/__test__/test-utils';
import NotificationDetailTimeline from '../NotificationDetailTimeline';

const useIsMobileSpy = jest.spyOn(hooks, 'useIsMobile');

const testTimelineRendering = async (container: HTMLElement) => {
  const timelineItems = container.querySelectorAll('.MuiTimelineItem-root');
  // we multiply for 2 because, for each status history element, there is two timeline elements (status + moreLessButton)
  expect(timelineItems).toHaveLength(parsedNotification.notificationStatusHistory.length * 2);
  timelineItems.forEach((item, timelineIndex) => {
    if (timelineIndex % 2 === 0) {
      const dateItems = item.querySelectorAll('[data-testid="dateItem"]');
      expect(dateItems).toHaveLength(3);
      expect(dateItems[0]).toHaveTextContent(
        formatMonthString(
          parsedNotification.notificationStatusHistory[timelineIndex / 2].activeFrom
        )
      );
      expect(dateItems[1]).toHaveTextContent(
        formatDay(parsedNotification.notificationStatusHistory[timelineIndex / 2].activeFrom)
      );
      expect(dateItems[2]).toHaveTextContent(
        formatTime(parsedNotification.notificationStatusHistory[timelineIndex / 2].activeFrom)
      );
      const itemStatus = item.querySelector('[data-testid="itemStatus"]');
      expect(itemStatus).toBeInTheDocument();
      const classRoot = 'MuiChip-color';
      const { color, label } = getNotificationStatusInfos(
        parsedNotification.notificationStatusHistory[timelineIndex / 2].status
      );
      const buttonClass = `${classRoot}${color!.charAt(0).toUpperCase() + color!.slice(1)}`;
      expect(itemStatus).toHaveTextContent(label);
      expect(itemStatus!.classList.contains(buttonClass)).toBe(true);
    } else {
      const moreLessButton = item.querySelector('[data-testid="moreLessButton"]');
      expect(moreLessButton).toBeInTheDocument();
      expect(moreLessButton).toHaveTextContent(/mocked-more-label/i);
    }
  });
};

describe('NotificationDetailTimeline Component', () => {
  it('renders NotificationDetailTimeline (desktop)', async () => {
    useIsMobileSpy.mockReturnValue(false);
    // render component
    const result = render(
      <NotificationDetailTimeline
        title="mocked-title"
        recipients={parsedNotification.recipients}
        statusHistory={parsedNotification.notificationStatusHistory}
        clickHandler={jest.fn()}
        historyButtonLabel="mocked-history-label"
        showLessButtonLabel="mocked-less-label"
        showMoreButtonLabel="mocked-more-label"
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
        recipients={parsedNotification.recipients}
        statusHistory={parsedNotification.notificationStatusHistory}
        clickHandler={jest.fn()}
        historyButtonLabel="mocked-history-label"
        showLessButtonLabel="mocked-less-label"
        showMoreButtonLabel="mocked-more-label"
      />
    );
    expect(result?.container).toHaveTextContent(/mocked-title/i);
    const timelineItems = result?.container.querySelectorAll('.MuiTimelineItem-root');
    expect(timelineItems).toHaveLength(1);
    const historyButton = await result?.findByTestId('historyButton');
    expect(historyButton).toBeInTheDocument();
    fireEvent.click(historyButton);
    const drawer = await waitFor(() => {
      return screen.queryByRole('presentation');
    });
    expect(drawer!).toBeInTheDocument();
    await testTimelineRendering(drawer!);
  });

  it('expand timeline item (desktop)', async () => {
    useIsMobileSpy.mockReturnValue(false);
    // render component
    const result = render(
      <NotificationDetailTimeline
        title="mocked-title"
        recipients={parsedNotification.recipients}
        statusHistory={parsedNotification.notificationStatusHistory}
        clickHandler={jest.fn()}
        historyButtonLabel="mocked-history-label"
        showLessButtonLabel="mocked-less-label"
        showMoreButtonLabel="mocked-more-label"
      />
    );
    // get first moreLessButton
    const moreLessButton = result?.container.querySelector('[data-testid="moreLessButton"] button');
    fireEvent.click(moreLessButton!);
    await waitFor(() => {
      expect(moreLessButton).toHaveTextContent(/mocked-less-label/i);
      const timelineExpandedItem = result?.container.querySelector(
        '.MuiTimelineItem-root:nth-child(3)'
      );
      const dateItems = timelineExpandedItem!.querySelectorAll('[data-testid="dateItem"]');
      expect(dateItems).toHaveLength(3);
      expect(dateItems[0]).toHaveTextContent(
        formatMonthString(parsedNotification.timeline[0].timestamp)
      );
      expect(dateItems[1]).toHaveTextContent(formatDay(parsedNotification.timeline[0].timestamp));
      expect(dateItems[2]).toHaveTextContent(formatTime(parsedNotification.timeline[0].timestamp));
      expect(timelineExpandedItem).toHaveTextContent(parsedNotification.recipients[0].denomination);
    });
  });
});
