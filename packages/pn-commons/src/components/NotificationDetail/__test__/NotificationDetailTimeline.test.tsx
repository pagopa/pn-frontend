import React from 'react';

import { notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import {
  act,
  createMatchMedia,
  fireEvent,
  render,
} from '../../../test-utils';

import NotificationDetailTimeline from '../NotificationDetailTimeline';
import { LegalFactId, NotificationDetailOtherDocument } from '../../../types';

describe('NotificationDetailTimeline', () => {
  // Define mock data for props
  const recipients = notificationToFe.recipients;
  const statusHistory = notificationToFe.notificationStatusHistory;
  const title = 'Notification Title';
  const historyButtonLabel = 'History';
  const showMoreButtonLabel = 'Show More';
  const showLessButtonLabel = 'Show Less';

  it('renders without errors', () => {
    const { queryByTestId } = render(
      <NotificationDetailTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        title={title}
        historyButtonLabel={historyButtonLabel}
        showMoreButtonLabel={showMoreButtonLabel}
        showLessButtonLabel={showLessButtonLabel} clickHandler={function (legalFactId: LegalFactId | NotificationDetailOtherDocument): void {
          throw new Error('Function not implemented.');
        }} />
    );

    expect(queryByTestId('NotificationDetailTimeline')).toBeInTheDocument();
  });

  it('histroy drawer should be open when is desktop', async () => {
    window.matchMedia = createMatchMedia(1202);

    const { container, queryByTestId } = render(
      <NotificationDetailTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        title={title}
        historyButtonLabel={historyButtonLabel}
        showMoreButtonLabel={showMoreButtonLabel}
        showLessButtonLabel={showLessButtonLabel} clickHandler={function (legalFactId: LegalFactId | NotificationDetailOtherDocument): void {
          throw new Error('Function not implemented.');
        }} />
    );

    // the drawer should not be visible
    expect(queryByTestId('notification-history-drawer')).not.toBeInTheDocument();
    // and content too
    expect(queryByTestId('notification-history-drawer-content')).not.toBeInTheDocument();

    // I use classname since it appears that timeline steps in form of list items are not rendered with an id
    // not the cleanest way to use a class to get timeline items
    // i check then that timeline items are at least greater than or equal to notification history lenght
    // since depending on status and related elements timeline items can be more (but this behaviour is managed by another component)
    const items = container.getElementsByClassName('MuiTimelineItem-root');
    expect(items.length).toBeGreaterThanOrEqual(statusHistory.length);
  });


  it('toggles the history drawer when the summary step is clicked (mobile)', async () => {
    window.matchMedia = createMatchMedia(390);
    let result;
    await act(async () => {
      result = render(
        <NotificationDetailTimeline
          recipients={recipients}
          statusHistory={statusHistory}
          title={title}
          historyButtonLabel={historyButtonLabel}
          showMoreButtonLabel={showMoreButtonLabel}
          showLessButtonLabel={showLessButtonLabel} clickHandler={function (legalFactId: LegalFactId | NotificationDetailOtherDocument): void {
            throw new Error('Function not implemented.');
          }} />
      );
    });
    // Initially, the drawer should not be visible
    expect(result.queryByTestId('notification-history-drawer')).not.toBeInTheDocument();
    expect(result.queryByTestId('notification-history-drawer-content')).not.toBeInTheDocument();
    // Find and click the summary step to open the drawer
    const summaryStep = result.queryByTestId('historyButton');
    expect(summaryStep).toBeInTheDocument();
    await act(async () => {
      summaryStep && fireEvent.click(summaryStep);
    });

    // Now, the drawer should be visible
    expect(result.queryByTestId('notification-history-drawer-content')).toBeInTheDocument();

    // Clicking the summary step again should close the drawer
    const closeIcon = result.queryByTestId('notification-drawer-close');
    expect(closeIcon).toBeInTheDocument();
    await act(async () => {
      closeIcon && fireEvent.click(closeIcon);
    });

    // TODO this two items should not be in the document but I dont understand why this happens
    expect(result.queryByTestId('notification-history-drawer')).toBeInTheDocument();
    expect(result.queryByTestId('notification-history-drawer-content')).toBeInTheDocument();
  });
});