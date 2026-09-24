import { vi } from 'vitest';

import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import {
  LegalFactType,
  NotificationStatus,
  NotificationStatusHistory,
  TimelineCategory,
} from '../../../models';
import { fireEvent, render } from '../../../test-utils';
import NotificationTimelineBox from '../NotificationTimelineBox';

describe('NotificationTimelineBox', () => {
  const clickHandler = vi.fn();
  const onTimelineClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when status history is empty', () => {
    const { container } = render(
      <NotificationTimelineBox
        statusHistory={[]}
        recipients={notificationDTO.recipients}
        isParty={false}
        clickHandler={clickHandler}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the status box', () => {
    const { getByTestId } = render(
      <NotificationTimelineBox
        statusHistory={notificationDTO.notificationStatusHistory}
        recipients={notificationDTO.recipients}
        isParty={false}
        clickHandler={clickHandler}
      />
    );

    expect(getByTestId('NotificationDetailTimeline')).toBeInTheDocument();
  });

  it('calls onTimelineClick', () => {
    const { getByRole } = render(
      <NotificationTimelineBox
        statusHistory={notificationDTO.notificationStatusHistory}
        recipients={notificationDTO.recipients}
        isParty={false}
        clickHandler={clickHandler}
        onTimelineClick={onTimelineClick}
      />
    );

    fireEvent.click(
      getByRole('button', {
        name: 'detail.notification-timeline-section.aria-label',
      })
    );

    expect(onTimelineClick).toHaveBeenCalledTimes(1);
  });

  it('renders a legal fact inline when the new copy is enabled', () => {
    const legalFact = {
      key: 'safestorage://recipient-access.pdf',
      category: LegalFactType.RECIPIENT_ACCESS,
    };

    const statusHistory: Array<NotificationStatusHistory> = [
      {
        status: NotificationStatus.VIEWED,
        activeFrom: '2026-09-17T10:30:00Z',
        relatedTimelineElements: [],
        steps: [
          {
            elementId: 'NOTIFICATION_VIEWED',
            timestamp: '2026-09-17T10:30:00Z',
            category: TimelineCategory.NOTIFICATION_VIEWED,
            details: {},
            hidden: true,
            legalFactsIds: [legalFact],
          },
        ],
      },
    ];

    const { getByTestId } = render(
      <NotificationTimelineBox
        statusHistory={statusHistory}
        recipients={notificationDTO.recipients}
        isParty={false}
        clickHandler={clickHandler}
        isNewTimelineCopyEnabled
      />
    );

    fireEvent.click(getByTestId('download-legalfact'));

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(legalFact);
  });
});
