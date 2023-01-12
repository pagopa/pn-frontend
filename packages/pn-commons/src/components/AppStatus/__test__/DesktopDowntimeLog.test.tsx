import React from 'react';
import { act, fireEvent, screen, within } from '@testing-library/react';
import { render } from '../../../test-utils';
import { DowntimeLogPage, DowntimeStatus, KnownFunctionality } from '../../../models';
import DesktopDowntimeLog from '../DesktopDowntimeLog';
import { formatDate, formatTime } from '../../../utils';
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
  /* eslint-disable functional/no-let */
  let rowComponents: Array<HTMLElement>;
  let headerRow: HTMLElement;
  let headerRowColumns: Array<HTMLElement>;
  let getLegalFactDetailsMock: jest.Mock<any, any>;
  /* eslint-enable functional/no-let */

  beforeEach(async () => {
    getLegalFactDetailsMock = jest.fn();
    await act(
      async () =>
        void render(
          <DesktopDowntimeLog
            downtimeLog={exampleDowntimeLogPage}
            getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
          />
        )
    );
    rowComponents = screen.queryAllByRole('row');
    headerRow = rowComponents[0];
    headerRowColumns = within(headerRow).queryAllByRole('columnheader');
  });

  it('header row', async () => {
    // endDate should be immediately after startDate
    const startDateIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.startDate')
    );
    const endDateIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.endDate')
    );
    expect(startDateIndex).toBeGreaterThan(-1);
    expect(endDateIndex).toBeGreaterThan(-1);
    expect(endDateIndex).toEqual(startDateIndex + 1);

    // legalFactId and status must be present
    const legalFactIdHeader = within(headerRow).queryByText(
      'downtimeList.columnHeader.legalFactId'
    );
    const statusHeader = within(headerRow).queryByText('downtimeList.columnHeader.status');
    expect(legalFactIdHeader).toBeInTheDocument();
    expect(statusHeader).toBeInTheDocument();
  });

  // expect 4, one for the header, one for each of the three downtimes included
  it('row count', async () => {
    expect(rowComponents).toHaveLength(4);
  });

  it('date values', async () => {
    const startDateIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.startDate')
    );
    const endDateIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.endDate')
    );

    // first row - start date - date and time in different elements
    const firstDataRow = rowComponents[1];
    const firstRowColumns = within(firstDataRow).queryAllByRole('cell');
    const firstRowStartDate = firstRowColumns[startDateIndex];
    const startDateComponent1 = within(firstRowStartDate).queryByText(
      new RegExp(formatDate(incidentTimestamps[4]))
    );
    const startHourComponent1 = within(firstRowStartDate).queryByText(
      new RegExp(formatTime(incidentTimestamps[4]))
    );
    expect(startDateComponent1).toBeInTheDocument();
    expect(startHourComponent1).toBeInTheDocument();
    expect(startHourComponent1).not.toBe(startDateComponent1);

    // first row - end date - should be just a dash
    const firstRowEndDate = firstRowColumns[endDateIndex];
    const slashComponent = within(firstRowEndDate).queryByText('-');
    expect(slashComponent).toBeInTheDocument();

    // third row - start date - date and time in different elements
    const thirdDataRow = rowComponents[3];
    const thirdRowColumns = within(thirdDataRow).queryAllByRole('cell');
    const thirdRowEndDate = thirdRowColumns[endDateIndex];
    const endDateComponent3 = within(thirdRowEndDate).queryByText(
      new RegExp(formatDate(incidentTimestamps[1]))
    );
    const endHourComponent3 = within(thirdRowEndDate).queryByText(
      new RegExp(formatTime(incidentTimestamps[1]))
    );
    expect(endDateComponent3).toBeInTheDocument();
    expect(endHourComponent3).toBeInTheDocument();
    expect(endHourComponent3).not.toBe(endDateComponent3);
  });

  it('functionality values', async () => {
    const functionalityIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.functionality')
    );

    // first row - known functionality
    const firstDataRow = rowComponents[1];
    const firstRowColumns = within(firstDataRow).queryAllByRole('cell');
    const firstRowFunctionality = firstRowColumns[functionalityIndex];
    const description1 = within(firstRowFunctionality).queryByText(
      `legends.knownFunctionality.${KnownFunctionality.NotificationWorkflow}`
    );
    expect(description1).toBeInTheDocument();

    // second row - unknown functionality
    const secondDataRow = rowComponents[2];
    const secondRowColumns = within(secondDataRow).queryAllByRole('cell');
    const secondRowFunctionality = secondRowColumns[functionalityIndex];
    const description2 = within(secondRowFunctionality).queryByText(
      new RegExp('legends.unknownFunctionality')
    );
    expect(description2).toBeInTheDocument();

    // third row - different known functionality
    const thirdDataRow = rowComponents[3];
    const thirdRowColumns = within(thirdDataRow).queryAllByRole('cell');
    const thirdRowFunctionality = thirdRowColumns[functionalityIndex];
    const description3 = within(thirdRowFunctionality).queryByText(
      `legends.knownFunctionality.${KnownFunctionality.NotificationCreate}`
    );
    expect(description3).toBeInTheDocument();
  });

  it('legalFactId values', async () => {
    const legalFactIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.legalFactId')
    );

    // first row - open downtime
    const firstDataRow = rowComponents[1];
    const firstRowColumns = within(firstDataRow).queryAllByRole('cell');
    const firstRowLegalFact = firstRowColumns[legalFactIndex];
    const button1 = within(firstRowLegalFact).queryByRole('button');
    expect(button1).not.toBeInTheDocument();
    const description1 = within(firstRowLegalFact).queryByText(
      `legends.noFileAvailableByStatus.${DowntimeStatus.KO}`
    );
    expect(description1).toBeInTheDocument();

    // second row - closed downtime no file available
    const secondDataRow = rowComponents[2];
    const secondRowColumns = within(secondDataRow).queryAllByRole('cell');
    const secondRowLegalFact = secondRowColumns[legalFactIndex];
    const button2 = within(secondRowLegalFact).queryByRole('button');
    expect(button2).not.toBeInTheDocument();
    const description2 = within(secondRowLegalFact).queryByText(
      `legends.noFileAvailableByStatus.${DowntimeStatus.OK}`
    );
    expect(description2).toBeInTheDocument();

    // third row - file available
    const thirdDataRow = rowComponents[3];
    const thirdRowColumns = within(thirdDataRow).queryAllByRole('cell');
    const thirdRowLegalFact = thirdRowColumns[legalFactIndex];
    const button3 = within(thirdRowLegalFact).queryByRole('button');
    expect(button3).toBeInTheDocument();
    const description3 = button3 && within(button3).queryByText('legends.legalFactDownload');
    expect(description3).toBeInTheDocument();
  });

  it('status values', async () => {
    const statusIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText('downtimeList.columnHeader.status')
    );

    // first row - open downtime
    const firstDataRow = rowComponents[1];
    const firstRowColumns = within(firstDataRow).queryAllByRole('cell');
    const firstRowStatus = firstRowColumns[statusIndex];
    const statusChip1 = within(firstRowStatus).queryByTestId('downtime-status');
    expect(statusChip1).toHaveStyle({ 'background-color': fakePalette.error.light });
    const description1 =
      statusChip1 && within(statusChip1).queryByText(`legends.status.${DowntimeStatus.KO}`);
    expect(description1).toBeInTheDocument();

    // third row - closed downtime
    const thirdDataRow = rowComponents[3];
    const thirdRowColumns = within(thirdDataRow).queryAllByRole('cell');
    const thirdRowStatus = thirdRowColumns[statusIndex];
    const statusChip3 = within(thirdRowStatus).queryByTestId('downtime-status');
    expect(statusChip3).toHaveStyle({ 'background-color': fakePalette.success.light });
    const description3 =
      statusChip3 && within(statusChip3).queryByText(`legends.status.${DowntimeStatus.OK}`);
    expect(description3).toBeInTheDocument();
  });

  it('download action', async () => {
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(0);
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(1);
    expect(getLegalFactDetailsMock).toHaveBeenCalledWith('some-legal-fact-id');
  });
});
