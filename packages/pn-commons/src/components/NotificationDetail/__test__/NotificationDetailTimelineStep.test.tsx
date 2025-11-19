import { vi } from 'vitest';

import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { INotificationDetailTimeline, LegalFactId } from '../../../models/NotificationDetail';
import { NotificationStatus } from '../../../models/NotificationStatus';
import { fireEvent, render } from '../../../test-utils';
import { formatDay, formatMonthString, formatTime } from '../../../utility/date.utility';
import {
  getLegalFactLabel,
  getNotificationStatusInfos,
} from '../../../utility/notification.utility';
import NotificationDetailTimelineStep from '../NotificationDetailTimelineStep';

// Define mock data for testing
const mockTimelineStep = notificationDTO.notificationStatusHistory.find(
  (item) => item.status === NotificationStatus.DELIVERING
);
const mockRecipients = notificationDTO.recipients;
// Mock the clickHandler function
const mockClickHandler = vi.fn();

const getLegalFacts = (collapsed: boolean = true) =>
  mockTimelineStep!.steps!.reduce((arr, s) => {
    if (s.legalFactsIds && (collapsed || (!collapsed && s.hidden))) {
      return arr.concat(s.legalFactsIds.map((lf) => ({ file: lf, step: s })));
    }
    return arr;
  }, [] as Array<{ file: LegalFactId; step: INotificationDetailTimeline }>);

const checkDateItem = (index: number, dateItem: HTMLElement, date: string) => {
  if (index === 0) {
    expect(dateItem).toHaveTextContent(formatMonthString(date));
  }
  if (index === 1) {
    expect(dateItem).toHaveTextContent(formatDay(date));
  }
  if (index === 2) {
    expect(dateItem).toHaveTextContent(formatTime(date));
  }
};

describe('NotificationDetailTimelineStep', () => {
  it('renders the macro step correctly', () => {
    const { getAllByTestId, getByTestId } = render(
      <NotificationDetailTimelineStep
        timelineStep={mockTimelineStep!}
        recipients={mockRecipients}
        clickHandler={mockClickHandler}
      />
    );
    // if it's a macrosteps it has:
    // - 3 dateItem elements, corresponding to day, month and date when the timeline event is occuring
    // - one itemStaus, corresponding to status chip
    const dateItems = getAllByTestId('dateItem');
    expect(dateItems).toHaveLength(3);
    dateItems.forEach((dateItem, index) => {
      checkDateItem(index, dateItem, mockTimelineStep!.activeFrom);
    });
    const notificationStatusInfos = getNotificationStatusInfos(mockTimelineStep!, {
      recipients: mockRecipients,
    });
    const status = getByTestId('itemStatus');
    expect(status).toHaveTextContent(notificationStatusInfos.label);
    const mockLegalFacts = getLegalFacts();
    const legalFacts = getAllByTestId('download-legalfact');
    expect(legalFacts).toHaveLength(mockLegalFacts.length);
    legalFacts.forEach((el, index) => {
      expect(el).toHaveTextContent(
        getLegalFactLabel(
          mockLegalFacts[index].step,
          mockLegalFacts[index].file.category,
          mockLegalFacts[index].file.key || ''
        )
      );
      expect(el).toBeEnabled();
    });
  });

  it('expands and collapses additional steps when "Show More" and "Show Less" buttons are clicked', () => {
    const eventTrackingCallbackShowMore = vi.fn();
    const { getByTestId, getAllByTestId, queryAllByTestId } = render(
      <NotificationDetailTimelineStep
        timelineStep={mockTimelineStep!}
        recipients={mockRecipients}
        clickHandler={mockClickHandler}
        showMoreButtonLabel="Show More"
        showLessButtonLabel="Show Less"
        handleTrackShowMoreLess={eventTrackingCallbackShowMore}
      />
    );
    // Initially, only macro step should be visible
    const dateItems = getAllByTestId('dateItem');
    expect(dateItems).toHaveLength(3);
    const status = getByTestId('itemStatus');
    expect(status).toBeInTheDocument();
    let dateItemsMicro = queryAllByTestId('dateItemMicro');
    expect(dateItemsMicro).toHaveLength(0);
    // there is at least one legalfact
    let mockLegalFacts = getLegalFacts();
    let legalFacts = getAllByTestId('download-legalfact');
    expect(legalFacts).toHaveLength(mockLegalFacts.length);
    // Click "Show More" button to expand
    let moreLessButton = getByTestId('more-less-timeline-step');
    expect(moreLessButton).toHaveTextContent('Show More');
    fireEvent.click(moreLessButton);
    expect(eventTrackingCallbackShowMore).toBeCalledTimes(1);
    // After clicking "Show More", additional steps should be visible
    // some legal facts of the macro step can be hidden
    mockLegalFacts = getLegalFacts(false);
    legalFacts = queryAllByTestId('download-legalfact');
    expect(legalFacts).toHaveLength(mockLegalFacts.length);
    // check the appereance of the micro steps
    const notHiddenSteps = mockTimelineStep!.steps!.filter((s) => !s.hidden);
    dateItemsMicro = getAllByTestId('dateItemMicro');
    expect(dateItemsMicro).toHaveLength(3 * notHiddenSteps.length);
    const microLegalFacts = getAllByTestId('download-legalfact-micro');
    expect(microLegalFacts).toHaveLength(
      notHiddenSteps.reduce((count, item) => count + (item.legalFactsIds?.length || 0), 0)
    );
    let counter = 0;
    notHiddenSteps.forEach((step, index) => {
      checkDateItem(0, dateItemsMicro[3 * index], step.timestamp);
      checkDateItem(1, dateItemsMicro[3 * index + 1], step.timestamp);
      checkDateItem(2, dateItemsMicro[3 * index + 2], step.timestamp);
      if (step.legalFactsIds && step.legalFactsIds.length > 0) {
        for (const lf of step.legalFactsIds) {
          expect(microLegalFacts[counter]).toHaveTextContent(
            getLegalFactLabel(step, lf.category, lf.key || '')
          );
        }
        expect(microLegalFacts[counter]).toBeEnabled();
        counter++;
      }
    });
    // Click "Show Less" button to collapse
    moreLessButton = getByTestId('more-less-timeline-step');
    expect(moreLessButton).toHaveTextContent('Show Less');
    fireEvent.click(moreLessButton);
    expect(eventTrackingCallbackShowMore).toHaveBeenCalledTimes(2);
    // After clicking "Show Less", additional steps should be hidden
    dateItemsMicro = queryAllByTestId('dateItemMicro');
    expect(dateItemsMicro).toHaveLength(0);
    mockLegalFacts = getLegalFacts();
    legalFacts = getAllByTestId('download-legalfact');
    expect(legalFacts).toHaveLength(mockLegalFacts.length);
  });

  it('calls the clickHandler function when a download button is clicked', () => {
    const { getAllByTestId, getByTestId } = render(
      <NotificationDetailTimelineStep
        timelineStep={mockTimelineStep!}
        recipients={mockRecipients}
        clickHandler={mockClickHandler}
      />
    );
    // Assuming there is at least one download button
    const legalFacts = getLegalFacts();
    const downloadButtons = getAllByTestId('download-legalfact');
    // Simulate a click on the download button
    downloadButtons.forEach((btn, index) => {
      fireEvent.click(btn);
      // Verify that the clickHandler function is called with the expected arguments
      expect(mockClickHandler).toHaveBeenCalledTimes(index + 1);
      expect(mockClickHandler).toHaveBeenCalledWith(legalFacts[index].file);
    });
    // expand step
    const moreLessButton = getByTestId('more-less-timeline-step');
    fireEvent.click(moreLessButton);
    const notHiddenSteps = mockTimelineStep!.steps!.filter((s) => !s.hidden);
    const microLegalFacts = getAllByTestId('download-legalfact-micro');
    let counter = 0;
    notHiddenSteps.forEach((step) => {
      if (step.legalFactsIds && step.legalFactsIds.length > 0) {
        for (const lf of step.legalFactsIds) {
          fireEvent.click(microLegalFacts[counter]);
          // Verify that the clickHandler function is called with the expected arguments
          expect(mockClickHandler).toHaveBeenCalledTimes(legalFacts.length + counter + 1);
          expect(mockClickHandler).toHaveBeenCalledWith(lf);
        }
        counter++;
      }
    });
  });

  it('renders component with disabled downloads', () => {
    const { getAllByTestId, getByTestId } = render(
      <NotificationDetailTimelineStep
        timelineStep={mockTimelineStep!}
        recipients={mockRecipients}
        clickHandler={mockClickHandler}
        disableDownloads
      />
    );
    const downloadButtons = getAllByTestId('download-legalfact');
    downloadButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
    // expand step
    const moreLessButton = getByTestId('more-less-timeline-step');
    fireEvent.click(moreLessButton);
    const microLegalFacts = getAllByTestId('download-legalfact-micro');
    microLegalFacts.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('renders component when notification is CANCELLATION_IN_PROGRESS', () => {
    const { rerender, getByTestId } = render(
      <NotificationDetailTimelineStep
        timelineStep={{
          ...mockTimelineStep!,
          steps: [],
          status: NotificationStatus.CANCELLATION_IN_PROGRESS,
        }}
        recipients={mockRecipients}
        clickHandler={mockClickHandler}
        isParty
      />
    );
    let status = getByTestId('itemStatus');
    expect(status).toHaveStyle({
      opacity: '0.5',
    });
    // rerender component simulating no party user
    rerender(
      <NotificationDetailTimelineStep
        timelineStep={{
          ...mockTimelineStep!,
          steps: [],
          status: NotificationStatus.CANCELLATION_IN_PROGRESS,
        }}
        recipients={mockRecipients}
        clickHandler={mockClickHandler}
        isParty={false}
      />
    );
    status = getByTestId('itemStatus');
    expect(status).toHaveStyle({
      opacity: '1',
    });
  });

  it('doesnt render any step if there are no status history', () => {
    const { getAllByTestId, queryByTestId, getByTestId } = render(
      <NotificationDetailTimelineStep
        timelineStep={{ ...mockTimelineStep!, steps: [] }}
        recipients={mockRecipients}
        clickHandler={mockClickHandler}
      />
    );
    const dateItems = getAllByTestId('dateItem');
    expect(dateItems).toHaveLength(3);
    const status = getByTestId('itemStatus');
    expect(status).toBeInTheDocument();
    expect(queryByTestId('moreLessButton')).not.toBeInTheDocument();
  });
});
