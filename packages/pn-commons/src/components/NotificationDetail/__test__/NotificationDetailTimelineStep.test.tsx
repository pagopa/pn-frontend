import { beforeEach, vi } from 'vitest';

import { MITimeline, MITimelineItem } from '@pagopa/mui-italia';

import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { INotificationDetailTimeline, ReworkedStatus } from '../../../models/NotificationDetail';
import { NotificationStatus } from '../../../models/NotificationStatus';
import { fireEvent, render } from '../../../test-utils';
import {
  getLegalFactLabel,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
} from '../../../utility/notification.utility';
import getNotificationDetailTimelineItems, {
  NotificationDetailTimelineItem,
} from '../NotificationDetailTimelineStep';

const mockTimelineStep = notificationDTO.notificationStatusHistory.find(
  (item) => item.status === NotificationStatus.DELIVERING
)!;
const mockRecipients = notificationDTO.recipients;
const mockClickHandler = vi.fn();

type BuilderOverrides = Partial<Parameters<typeof getNotificationDetailTimelineItems>[0]>;

const buildItems = (overrides: BuilderOverrides = {}) =>
  getNotificationDetailTimelineItems({
    timelineStep: mockTimelineStep,
    statusHistory: [],
    recipients: mockRecipients,
    clickHandler: mockClickHandler,
    ...overrides,
  });

const renderItems = (items: Array<NotificationDetailTimelineItem>) =>
  render(
    <MITimeline>
      {items.map(({ key, content, ...itemProps }) => (
        <MITimelineItem key={key} {...itemProps}>
          {content}
        </MITimelineItem>
      ))}
    </MITimeline>
  );

const visibleSteps = (steps: Array<INotificationDetailTimeline> = []) =>
  steps.filter(
    (step) => !step.hidden && getNotificationTimelineStatusInfos(step, mockRecipients, steps)
  );

const renderedMicroSteps = (steps: Array<INotificationDetailTimeline> = []) =>
  steps.filter((step) =>
    step.hidden
      ? Boolean(step.legalFactsIds?.length)
      : Boolean(getNotificationTimelineStatusInfos(step, mockRecipients, steps))
  );

describe('NotificationDetailTimelineStep', () => {
  beforeEach(() => {
    mockClickHandler.mockClear();
  });

  describe('Basic functionality', () => {
    it('renders the macro step correctly', () => {
      const { container } = renderItems(buildItems());
      const notificationStatusInfos = getNotificationStatusInfos(mockTimelineStep, {
        recipients: mockRecipients,
      });

      expect(container).toHaveTextContent(notificationStatusInfos.label);
    });

    it('calls the clickHandler function when a download button is clicked', () => {
      const expectedLegalFacts = renderedMicroSteps(mockTimelineStep.steps).flatMap(
        (step) => step.legalFactsIds ?? []
      );
      const { queryAllByTestId } = renderItems(buildItems());

      queryAllByTestId('download-legalfact-micro').forEach((button) => fireEvent.click(button));

      expect(mockClickHandler).toHaveBeenCalledTimes(expectedLegalFacts.length);
      expectedLegalFacts.forEach((legalFact, index) => {
        expect(mockClickHandler).toHaveBeenNthCalledWith(index + 1, legalFact);
      });
    });

    it('renders component with disabled downloads', () => {
      const { queryAllByTestId } = renderItems(buildItems({ disableDownloads: true }));

      queryAllByTestId('download-legalfact-micro').forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('builds only the macro item when the status has no steps', () => {
      const items = buildItems({ timelineStep: { ...mockTimelineStep, steps: [] } });
      const { getByText, queryByTestId } = renderItems(items);
      const notificationStatusInfos = getNotificationStatusInfos(mockTimelineStep, {
        recipients: mockRecipients,
      });

      expect(items).toHaveLength(1);
      expect(getByText(notificationStatusInfos.label)).toBeInTheDocument();
      expect(queryByTestId('download-legalfact-micro')).not.toBeInTheDocument();
    });
  });

  describe('MITimeline behavior', () => {
    it('builds the macro step and all renderable micro-steps in order', () => {
      const items = buildItems({ isFirst: true });
      const expectedMicroSteps = renderedMicroSteps(mockTimelineStep.steps);
      const excludedHiddenSteps = mockTimelineStep.steps!.filter(
        (step) => step.hidden && !step.legalFactsIds?.length
      );

      expect(items).toHaveLength(1 + expectedMicroSteps.length);
      expect(items[0].variant).toBe('normal');
      expect(items.slice(1).every((item) => item.variant === 'normal')).toBe(true);
      expect(items.slice(1).map((item) => item.key)).toEqual(
        expectedMicroSteps.map((step) => step.elementId)
      );
      excludedHiddenSteps.forEach((step) => {
        expect(items.some((item) => item.key === step.elementId)).toBe(false);
      });
    });

    it.each([
      [NotificationStatus.UNREACHABLE, 'error'],
      [NotificationStatus.EFFECTIVE_DATE, 'info'],
      [NotificationStatus.PAID, 'success'],
      [NotificationStatus.CANCELLED, 'warning'],
      [NotificationStatus.DELIVERING, 'normal'],
    ] as const)(
      'maps the first macro-step color for status %s to variant %s',
      (status, variant) => {
        const items = buildItems({
          isFirst: true,
          timelineStep: { ...mockTimelineStep, status },
        });

        expect(items[0].variant).toBe(variant);
      }
    );

    it('uses the normal variant for a non-current standard macro-step', () => {
      expect(buildItems({ isFirst: false })[0].variant).toBe('normal');
    });

    it('keeps the warning variant for a non-current reworked macro-step', () => {
      const items = buildItems({
        isFirst: false,
        timelineStep: {
          ...mockTimelineStep,
          status: NotificationStatus.NOTIFICATION_TIMELINE_REWORKED,
        },
      });

      expect(items[0].variant).toBe('warning');
    });

    it('renders the reworked tag from the corresponding micro-step in its title', () => {
      const reworkedStep = visibleSteps(mockTimelineStep.steps)[0];
      const timelineStep = {
        ...mockTimelineStep,
        steps: mockTimelineStep.steps!.map((step) =>
          step.elementId === reworkedStep.elementId
            ? { ...step, reworkedStatus: ReworkedStatus.VALID }
            : step
        ),
      };
      const { getByText } = renderItems(buildItems({ timelineStep }));

      expect(getByText('status.reworked-status-valid')).toBeInTheDocument();
    });
  });

  describe('Hidden steps with legal facts', () => {
    it('renders a hidden step as a title-only micro-step containing its download links', () => {
      const stepWithLegalFacts = mockTimelineStep.steps!.find(
        (step) => step.legalFactsIds?.length
      )!;
      const hiddenStep = { ...stepWithLegalFacts, hidden: true };
      const items = buildItems({
        timelineStep: { ...mockTimelineStep, steps: [hiddenStep] },
      });
      const { getAllByTestId } = renderItems(items);

      expect(items).toHaveLength(2);
      expect(items[1].key).toBe(hiddenStep.elementId);
      expect(items[1].content).toBeUndefined();

      const downloadButtons = getAllByTestId('download-legalfact-micro');
      expect(downloadButtons).toHaveLength(hiddenStep.legalFactsIds!.length);
      downloadButtons.forEach((button, index) => {
        const legalFact = hiddenStep.legalFactsIds![index];
        expect(button).toHaveTextContent(
          getLegalFactLabel(hiddenStep, legalFact.category, legalFact.key || '')
        );
      });
    });
  });
});
