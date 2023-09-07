import React from 'react';

import { RenderResult, act, screen, within } from '@testing-library/react';

import { DowntimeLogPage, DowntimeStatus, KnownFunctionality } from '../../../models';
import { render } from '../../../test-utils';
import { formatDate, formatTime } from '../../../utils';
import MobileDowntimeLog from '../MobileDowntimeLog';

const incidentTimestamps = [
  '2022-10-23T15:50:04Z',
  '2022-10-23T15:51:12Z',
  '2022-10-24T08:15:21Z',
  '2022-10-24T08:15:29Z',
  '2022-10-28T10:11:09Z',
];

const exampleDowntimeLogPage: DowntimeLogPage = {
  downtimes: [
    {
      rawFunctionality: KnownFunctionality.NotificationWorkflow,
      knownFunctionality: KnownFunctionality.NotificationWorkflow,
      status: DowntimeStatus.KO,
      startDate: incidentTimestamps[4],
      fileAvailable: false,
    },
    {
      rawFunctionality: 'NEW_FUNCTIONALITY',
      status: DowntimeStatus.OK,
      startDate: incidentTimestamps[2],
      endDate: incidentTimestamps[3],
      fileAvailable: false,
    },
    {
      rawFunctionality: KnownFunctionality.NotificationCreate,
      knownFunctionality: KnownFunctionality.NotificationCreate,
      status: DowntimeStatus.OK,
      startDate: incidentTimestamps[0],
      endDate: incidentTimestamps[1],
      legalFactId: 'some-legal-fact-id',
      fileAvailable: true,
    },
  ],
};

const fakePalette = { success: { light: '#00FF00' }, error: { light: '#FF0000' } };

jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    useTheme: () => ({ palette: { ...original.useTheme().palette, ...fakePalette } }),
  };
});

jest.mock('../../../services/localization.service', () => {
  const original = jest.requireActual('../../../services/localization.service');
  return {
    ...original,
    getLocalizedOrDefaultLabel: (_: string, key: string) => key,
  };
});

describe('DesktopDowntimeLog component - with data', () => {
  let result: RenderResult;
  let cardComponents: Array<HTMLElement>;
  let labelComponents: Array<HTMLElement>;
  let getLegalFactDetailsMock: jest.Mock<any, any>;

  beforeEach(async () => {
    getLegalFactDetailsMock = jest.fn();
    await act(async () => {
      result = render(
        <MobileDowntimeLog
          downtimeLog={exampleDowntimeLogPage}
          getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
        />
      );
    });
    cardComponents = result.getAllByTestId('itemCard');
    labelComponents = within(cardComponents[0]).getAllByTestId('cardBodyLabel');
  });

  // one card for each downtime included
  it('card count', async () => {
    expect(cardComponents).toHaveLength(3);
  });

  it('headers - in first card', async () => {
    // endDate should be immediately after startDate
    const startDateIndex = labelComponents.findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.startDate')
    );
    const endDateIndex = labelComponents.findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.endDate')
    );
    expect(startDateIndex).toBeGreaterThan(-1);
    expect(endDateIndex).toBeGreaterThan(-1);
    expect(endDateIndex).toEqual(startDateIndex + 1);

    // legalFactId and functionality must be present,
    // status must not (since the status is in the header with no label)
    const legalFactIdIndex = labelComponents.findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.legalFactId')
    );
    const functionalityIndex = labelComponents.findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.functionality')
    );
    const statusIndex = labelComponents.findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.status')
    );
    expect(legalFactIdIndex).toBeGreaterThan(-1);
    expect(functionalityIndex).toBeGreaterThan(-1);
    expect(statusIndex).toBe(-1);
  });

  it('date values', async () => {
    const startDateIndex = labelComponents.findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.startDate')
    );
    const endDateIndex = labelComponents.findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.endDate')
    );

    // first card - start date - date and time in the same element
    const firstCard = cardComponents[0];
    const firstCardValues = within(firstCard).getAllByTestId('cardBodyValue');
    const firstCardStartDate = firstCardValues[startDateIndex];
    const startDateComponent1 = within(firstCardStartDate).getByText(
      new RegExp(formatDate(incidentTimestamps[4]))
    );
    const startHourComponent1 = within(firstCardStartDate).getByText(
      new RegExp(formatTime(incidentTimestamps[4]))
    );
    expect(startDateComponent1).toBeInTheDocument();
    expect(startHourComponent1).toBeInTheDocument();
    expect(startHourComponent1).toBe(startDateComponent1);

    // first card - end date - should be just a dash
    const firstCardEndDate = firstCardValues[endDateIndex];
    const slashComponent = within(firstCardEndDate).getByText('-');
    expect(slashComponent).toBeInTheDocument();

    // third card - start date - date and time in the same element
    const thirdCard = cardComponents[2];
    const thirdCardValues = within(thirdCard).getAllByTestId('cardBodyValue');
    const thirdCardEndDate = thirdCardValues[endDateIndex];
    const endDateComponent3 = within(thirdCardEndDate).getByText(
      new RegExp(formatDate(incidentTimestamps[1]))
    );
    const endHourComponent3 = within(thirdCardEndDate).getByText(
      new RegExp(formatTime(incidentTimestamps[1]))
    );
    expect(endDateComponent3).toBeInTheDocument();
    expect(endHourComponent3).toBeInTheDocument();
    expect(endHourComponent3).toBe(endDateComponent3);
  });

  it('functionality values', async () => {
    const functionalityIndex = labelComponents.findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.functionality')
    );

    // first card - known functionality
    const firstCard = cardComponents[0];
    const firstCardValues = within(firstCard).getAllByTestId('cardBodyValue');
    const firstCardFunctionality = firstCardValues[functionalityIndex];
    const description1 = within(firstCardFunctionality).getByText(
      `legends.knownFunctionality.${KnownFunctionality.NotificationWorkflow}`
    );
    expect(description1).toBeInTheDocument();

    // second card - unknown functionality
    const secondCard = cardComponents[1];
    const secondCardValues = within(secondCard).getAllByTestId('cardBodyValue');
    const secondCardFunctionality = secondCardValues[functionalityIndex];
    const description2 = within(secondCardFunctionality).getByText(
      new RegExp('legends.unknownFunctionality')
    );
    expect(description2).toBeInTheDocument();

    // third row - different known functionality
    const thirdCard = cardComponents[2];
    const thirdCardValues = within(thirdCard).getAllByTestId('cardBodyValue');
    const thirdCardFunctionality = thirdCardValues[functionalityIndex];
    const description3 = within(thirdCardFunctionality).getByText(
      `legends.knownFunctionality.${KnownFunctionality.NotificationCreate}`
    );
    expect(description3).toBeInTheDocument();
  });

  it('legalFactId values', async () => {
    const legalFactIdIndex = labelComponents.findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.legalFactId')
    );

    // first row - open downtime
    const firstCard = cardComponents[0];
    const firstCardValues = within(firstCard).getAllByTestId('cardBodyValue');
    const firstCardLegalFactId = firstCardValues[legalFactIdIndex];
    const button1 = within(firstCardLegalFactId).queryByRole('button');
    expect(button1).not.toBeInTheDocument();
    const description1 = within(firstCardLegalFactId).getByText(
      `legends.noFileAvailableByStatus.${DowntimeStatus.KO}`
    );
    expect(description1).toBeInTheDocument();

    // second row - closed downtime no file available
    const secondCard = cardComponents[1];
    const secondCardValues = within(secondCard).getAllByTestId('cardBodyValue');
    const secondCardLegalFactId = secondCardValues[legalFactIdIndex];
    const button2 = within(secondCardLegalFactId).queryByRole('button');
    expect(button2).not.toBeInTheDocument();
    const description2 = within(secondCardLegalFactId).getByText(
      `legends.noFileAvailableByStatus.${DowntimeStatus.OK}`
    );
    expect(description2).toBeInTheDocument();

    // third row - file available
    const thirdCard = cardComponents[2];
    const thirdCardValues = within(thirdCard).getAllByTestId('cardBodyValue');
    const thirdCardLegalFactId = thirdCardValues[legalFactIdIndex];
    const button3 = within(thirdCardLegalFactId).getByRole('button');
    expect(button3).toBeInTheDocument();
    const description3 = button3 && within(button3).getByText('legends.legalFactDownload');
    expect(description3).toBeInTheDocument();
  });

  it('status values', async () => {
    // first row - open downtime
    const firstCard = cardComponents[0];
    const statusChips1 = within(firstCard).getAllByTestId('downtime-status');
    expect(statusChips1).toHaveLength(1);
    const statusChip1 = statusChips1[0];
    expect(statusChip1).toHaveStyle({ 'background-color': fakePalette.error.light });
    const description1 =
      statusChip1 && within(statusChip1).getByText(`legends.status.${DowntimeStatus.KO}`);
    expect(description1).toBeInTheDocument();

    // third row - closed downtime
    const thirdCard = cardComponents[2];
    const statusChips3 = within(thirdCard).getAllByTestId('downtime-status');
    expect(statusChips3).toHaveLength(1);
    const statusChip3 = statusChips3[0];
    expect(statusChip3).toHaveStyle({ 'background-color': fakePalette.success.light });
    const description3 =
      statusChip3 && within(statusChip3).getByText(`legends.status.${DowntimeStatus.OK}`);
    expect(description3).toBeInTheDocument();
  });

  // don't include a download test because it's exactly the same behavior as DesktopDowntimeLog,
  // and moreover such behavior is implemented by exactly the same code
});
