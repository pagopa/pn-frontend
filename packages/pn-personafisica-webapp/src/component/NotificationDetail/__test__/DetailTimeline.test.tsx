import { act, RenderResult, within } from '@testing-library/react';
import { notificationToFe, render } from '../../../__test__/test-utils';
import { getDay, getMonthString, getTime } from '@pagopa-pn/pn-commons';
import DetailTimeline from '../DetailTimeline';
import { NotificationDetailTimeline } from '@pagopa-pn/pn-commons/src/types/Notifications';

describe('Notification Detail Timeline Component', () => {
  let result: RenderResult | undefined;

  beforeEach(async () => {
    // render component
    await act(async () => {
      result = render(<DetailTimeline notification={notificationToFe}/>);
    });
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders detail timeline', async () => {
    expect(result?.container).toHaveTextContent(/Stato della notifica/i);
    // expect(result?.container).toHaveTextContent(/Scarica tutti gli allegati/i);
    const timelineItems = await result?.findAllByTestId('timelineItem');
    expect(timelineItems).toHaveLength(notificationToFe.timeline.length);
    // beacuse of await into loop, we need to use for loop and not forEach
    let timelineIndex = 0;
    for(const item of timelineItems!) {
      const dateItems = item.querySelectorAll('p');
      expect(dateItems).toHaveLength(3);
      expect(dateItems[0]).toHaveTextContent(getMonthString(notificationToFe.timeline[timelineIndex].timestamp));
      expect(dateItems[1]).toHaveTextContent(getDay(notificationToFe.timeline[timelineIndex].timestamp));
      expect(dateItems[2]).toHaveTextContent(getTime(notificationToFe.timeline[timelineIndex].timestamp));
      const itemStatus = await within(item).findByTestId('itemStatus');
      expect(itemStatus).toBeInTheDocument();
      const classRoot = 'MuiChip-color';
      const {color, label} = getNotificationStatusLabelAndColorFromTimelineCategory(
        notificationToFe.timeline[timelineIndex],
        notificationToFe.notificationStatusHistory
      );
      const buttonClass = `${classRoot}${color!.charAt(0).toUpperCase() + color!.slice(1)}`;
      expect(itemStatus).toHaveTextContent(label);
      expect(itemStatus.classList.contains(buttonClass)).toBe(true);
      timelineIndex++;
    }
  });

});

function getNotificationStatusLabelAndColorFromTimelineCategory(arg0: NotificationDetailTimeline, notificationStatusHistory: import("@pagopa-pn/pn-commons/src/types/Notifications").NotificationStatusHistory[]): { color: any; label: any; } {
  throw new Error('Function not implemented.' + arg0 + notificationStatusHistory);
}
