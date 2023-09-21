import React from 'react';
import { render, fireEvent } from '../../../test-utils';
import NotificationDetailTimelineStep from '../NotificationDetailTimelineStep';
import { notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { NotificationStatus } from '../../../types';

describe('NotificationDetailTimelineStep', () => {
    // Define mock data for testing
    const mockTimelineStep = notificationToFe.notificationStatusHistory.filter(item => item.status === NotificationStatus.DELIVERING)[0];

    const mockRecipients = notificationToFe.recipients;

    // Mock the clickHandler function
    const mockClickHandler = jest.fn();

    it('renders without crashing', () => {
        render(
            <NotificationDetailTimelineStep
                timelineStep={mockTimelineStep}
                recipients={mockRecipients}
                clickHandler={mockClickHandler}
            />
        );
    });

    it('renders the macro step correctly', () => {
        const { getAllByTestId } = render(
            <NotificationDetailTimelineStep
                timelineStep={mockTimelineStep}
                recipients={mockRecipients}
                clickHandler={mockClickHandler}
            />
        );

        // You can write assertions here to verify that the macro step is rendered correctly
        // if it's a macrosteps it has: 
        // - 3 dateItem elements, corresponding to day, month and date when the timeline event is occuring
        // - one itemStaus, corresponding to status chip
        expect(getAllByTestId('dateItem').length).toBe(3);
        expect(getAllByTestId('itemStatus').length).toBe(1);
    });

    it('expands and collapses additional steps when "Show More" and "Show Less" buttons are clicked', () => {
        const { getByTestId, queryByTestId, getAllByTestId } = render(
            <NotificationDetailTimelineStep
                timelineStep={mockTimelineStep}
                recipients={mockRecipients}
                clickHandler={mockClickHandler}
                showMoreButtonLabel="Show More"
                showLessButtonLabel="Show Less"
            />
        );

        // Initially, only macro step should be visible
        expect(getAllByTestId('dateItem').length).toBe(3);
        expect(getAllByTestId('itemStatus').length).toBe(1);
        expect(queryByTestId('moreLessButton')).toBeInTheDocument();
        // there is at least one legalfact
        const legalFacts = getAllByTestId('download-legalfact').length;
        expect(legalFacts).toBeGreaterThanOrEqual(1);

        // Click "Show More" button to expand
        fireEvent.click(getByTestId('more-less-timeline-step'));

        // After clicking "Show More", additional steps should be visible
        expect(getAllByTestId('download-legalfact').length).toBe(legalFacts);
        expect(getAllByTestId('dateItem').length).toBeGreaterThan(3);
        expect(getAllByTestId('itemStatus').length).toBe(1);
        // Click "Show Less" button to collapse
        fireEvent.click(getByTestId('more-less-timeline-step'));

        // After clicking "Show Less", additional steps should be hidden
        expect(getAllByTestId('download-legalfact').length).toBe(legalFacts);
        expect(getAllByTestId('dateItem').length).toBe(3);
        expect(getAllByTestId('itemStatus').length).toBe(1);
    });

    it('calls the clickHandler function when a download button is clicked', () => {
        const { getAllByTestId } = render(
            <NotificationDetailTimelineStep
                timelineStep={mockTimelineStep}
                recipients={mockRecipients}
                clickHandler={mockClickHandler}
            />
        );
        // Assuming there is at least one download button
        const downloadButtons = getAllByTestId('download-legalfact');

        // Simulate a click on the download button
        downloadButtons.forEach(btn => {
            fireEvent.click(btn);
        });
        // Verify that the clickHandler function is called with the expected arguments
        expect(mockClickHandler).toHaveBeenCalledTimes(downloadButtons.length);
    });

    it('doesnt render any step if there are no status history', () => {
        const mockTimelineNoStep = {
            status: NotificationStatus.EFFECTIVE_DATE,
            activeFrom: '2023-08-25T09:39:07.843258714Z',
            relatedTimelineElements: [],
        };
        const { getAllByTestId, queryByTestId } = render(
            <NotificationDetailTimelineStep
                timelineStep={mockTimelineNoStep}
                recipients={mockRecipients}
                clickHandler={mockClickHandler}
            />
        );
        expect(getAllByTestId('dateItem').length).toBe(3);
        expect(getAllByTestId('itemStatus').length).toBe(1);
        expect(queryByTestId('moreLessButton')).not.toBeInTheDocument();
    });
});
