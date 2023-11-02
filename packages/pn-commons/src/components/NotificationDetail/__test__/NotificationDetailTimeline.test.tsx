import React from 'react';

import { notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { createMatchMedia, fireEvent, render, waitFor } from '../../../test-utils';
import NotificationDetailTimeline from '../NotificationDetailTimeline';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    i18n: { language: 'it' },
  }),
}));

describe('NotificationDetailTimeline', () => {
  // Define mock data for props
  const recipients = notificationToFe.recipients;
  const statusHistory = notificationToFe.notificationStatusHistory;
  const title = 'Notification Title';
  const historyButtonLabel = 'History';
  const showMoreButtonLabel = 'Show More';
  const showLessButtonLabel = 'Show Less';

  it('renders component', () => {
    const { container, queryByTestId } = render(
      <NotificationDetailTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        title={title}
        historyButtonLabel={historyButtonLabel}
        showMoreButtonLabel={showMoreButtonLabel}
        showLessButtonLabel={showLessButtonLabel}
        clickHandler={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(container).toHaveTextContent(title);
    expect(queryByTestId('NotificationDetailTimeline')).toBeInTheDocument();
  });

  it('histroy drawer should not rendered when is desktop', async () => {
    window.matchMedia = createMatchMedia(1202);
    const { container, queryByTestId } = render(
      <NotificationDetailTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        title={title}
        historyButtonLabel={historyButtonLabel}
        showMoreButtonLabel={showMoreButtonLabel}
        showLessButtonLabel={showLessButtonLabel}
        clickHandler={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
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
    const { queryByTestId, getByTestId } = render(
      <NotificationDetailTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        title={title}
        historyButtonLabel={historyButtonLabel}
        showMoreButtonLabel={showMoreButtonLabel}
        showLessButtonLabel={showLessButtonLabel}
        clickHandler={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    // Initially, the drawer should not be visible
    expect(queryByTestId('notification-history-drawer')).not.toBeInTheDocument();
    expect(queryByTestId('notification-history-drawer-content')).not.toBeInTheDocument();
    // Find and click the summary step to open the drawer
    const summaryStep = getByTestId('historyButton');
    expect(summaryStep).toBeInTheDocument();
    fireEvent.click(summaryStep);
    await waitFor(() => {
      // Now, the drawer should be visible
      expect(getByTestId('notification-history-drawer-content')).toBeInTheDocument();
    });
    // Clicking the summary step again should close the drawer
    const closeIcon = getByTestId('notification-drawer-close');
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
    await waitFor(() => {
      // Now, the drawer should be hidden
      expect(queryByTestId('notification-history-drawer')).not.toBeInTheDocument();
      expect(queryByTestId('notification-history-drawer-content')).not.toBeInTheDocument();
    });
  });
});
