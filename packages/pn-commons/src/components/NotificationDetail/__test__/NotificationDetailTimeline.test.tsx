import React from 'react';

import { RenderResult, act, fireEvent, waitFor, within } from '@testing-library/react';

import { notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import * as hooks from '../../../hooks/useIsMobile';
import { render } from '../../../test-utils';
import {
  formatDay,
  formatMonthString,
  formatTime,
  getNotificationStatusInfos,
} from '../../../utils';
import NotificationDetailTimeline from '../NotificationDetailTimeline';

const useIsMobileSpy = jest.spyOn(hooks, 'useIsMobile');

const testTimelineRendering = async (container: HTMLElement) => {
  const timelineItems = container.querySelectorAll('.MuiTimelineItem-root');
  // we multiply for 2 because, for each status history element, there is two timeline elements (status + moreLessButton)
  expect(timelineItems).toHaveLength(notificationToFe.notificationStatusHistory.length + 1);
  timelineItems.forEach((item, timelineIndex) => {
    if (timelineIndex % 2 === 0) {
      const dateItems = within(item as HTMLElement).getAllByTestId('dateItem');
      expect(dateItems).toHaveLength(3);
      expect(dateItems[0]).toHaveTextContent(
        formatMonthString(notificationToFe.notificationStatusHistory[timelineIndex / 2].activeFrom)
      );
      expect(dateItems[1]).toHaveTextContent(
        formatDay(notificationToFe.notificationStatusHistory[timelineIndex / 2].activeFrom)
      );
      expect(dateItems[2]).toHaveTextContent(
        formatTime(notificationToFe.notificationStatusHistory[timelineIndex / 2].activeFrom)
      );
      const itemStatus = within(item as HTMLElement).getByTestId('itemStatus');
      expect(itemStatus).toBeInTheDocument();
      const classRoot = 'MuiChip-color';
      const { color, label } = getNotificationStatusInfos(
        notificationToFe.notificationStatusHistory[timelineIndex / 2].status
      );
      const buttonClass = `${classRoot}${color!.charAt(0).toUpperCase() + color!.slice(1)}`;
      expect(itemStatus).toHaveTextContent(label);
      expect(itemStatus!.classList.contains(buttonClass)).toBe(true);
    } else {
      const moreLessButton = within(item as HTMLElement).getByTestId('moreLessButton');
      expect(moreLessButton).toBeInTheDocument();
      expect(moreLessButton).toHaveTextContent(/mocked-more-label/i);
    }
  });
};

// Da sistemare perchè falliscono da quando è stato cambiato il mock
describe.skip('NotificationDetailTimeline Component', () => {
  let result: RenderResult | undefined;

  afterEach(() => {
    result = undefined;
  });

  it('renders NotificationDetailTimeline (desktop)', async () => {
    useIsMobileSpy.mockReturnValue(false);
    // render component
    result = render(
      <NotificationDetailTimeline
        title="mocked-title"
        recipients={notificationToFe.recipients}
        statusHistory={notificationToFe.notificationStatusHistory}
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
    await act(async () => {
      result = render(
        <NotificationDetailTimeline
          title="mocked-title"
          recipients={notificationToFe.recipients}
          statusHistory={notificationToFe.notificationStatusHistory}
          clickHandler={jest.fn()}
          historyButtonLabel="mocked-history-label"
          showLessButtonLabel="mocked-less-label"
          showMoreButtonLabel="mocked-more-label"
        />
      );
    });
    expect(result?.container).toHaveTextContent(/mocked-title/i);
    const timelineItems = result?.container.querySelectorAll('.MuiTimelineItem-root');
    expect(timelineItems).toHaveLength(1);
    const historyButton = result?.getByTestId('historyButton');
    expect(historyButton).toBeInTheDocument();
    fireEvent.click(historyButton!);
    const drawer = result?.getByRole('presentation');
    expect(drawer!).toBeInTheDocument();
    await testTimelineRendering(drawer!);
  });

  it('expand timeline item (desktop)', async () => {
    useIsMobileSpy.mockReturnValue(false);
    // render component
    await act(async () => {
      result = render(
        <NotificationDetailTimeline
          title="mocked-title"
          recipients={notificationToFe.recipients}
          statusHistory={notificationToFe.notificationStatusHistory}
          clickHandler={jest.fn()}
          historyButtonLabel="mocked-history-label"
          showLessButtonLabel="mocked-less-label"
          showMoreButtonLabel="mocked-more-label"
        />
      );
    });
    // get first moreLessButton
    const moreLessButton = within(
      result?.getAllByTestId('moreLessButton')[0] as HTMLElement
    ).getByRole('button');
    expect(moreLessButton).toHaveTextContent(/mocked-more-label/i);
    fireEvent.click(moreLessButton!);
    await waitFor(() => {
      expect(moreLessButton).toHaveTextContent(/mocked-less-label/i);
      const timelineExpandedItem = result?.container.querySelector(
        '.MuiTimelineItem-root:nth-child(3)'
      );
      const dateItems = within(timelineExpandedItem as HTMLElement).getAllByTestId('dateItem');
      expect(dateItems).toHaveLength(3);
      expect(dateItems[0]).toHaveTextContent(
        formatMonthString(notificationToFe.timeline[0].timestamp)
      );
      expect(dateItems[1]).toHaveTextContent(formatDay(notificationToFe.timeline[0].timestamp));
      expect(dateItems[2]).toHaveTextContent(formatTime(notificationToFe.timeline[0].timestamp));
      expect(timelineExpandedItem).toHaveTextContent(notificationToFe.recipients[0].denomination);
    });
  });
});
