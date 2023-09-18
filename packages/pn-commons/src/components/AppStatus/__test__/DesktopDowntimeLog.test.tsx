import React from 'react';

import { exampleDowntimeLogPage, incidentTimestamps } from '../../../__mocks__/AppStatus.mock';
import { DowntimeStatus, KnownFunctionality } from '../../../models';
import {
  RenderResult,
  act,
  fireEvent,
  initLocalizationForTest,
  render,
  screen,
  within,
} from '../../../test-utils';
import { formatDate, formatTime } from '../../../utils';
import DesktopDowntimeLog from '../DesktopDowntimeLog';

const fakePalette = { success: { light: '#00FF00' }, error: { light: '#FF0000' } };

jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    useTheme: () => ({ palette: { ...original.useTheme().palette, ...fakePalette } }),
  };
});

describe('DesktopDowntimeLog component - with data', () => {
  let result: RenderResult;
  let rowComponents: Array<HTMLElement>;
  let headerRow: HTMLElement;
  let headerRowColumns: Array<HTMLElement>;
  let getLegalFactDetailsMock: jest.Mock<any, any>;

  beforeAll(() => {
    initLocalizationForTest();
  });

  beforeEach(async () => {
    getLegalFactDetailsMock = jest.fn();
    await act(async () => {
      result = render(
        <DesktopDowntimeLog
          downtimeLog={exampleDowntimeLogPage}
          getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
        />
      );
    });
    rowComponents = screen.getAllByRole('row');
    headerRow = rowComponents[0];
    headerRowColumns = within(headerRow).getAllByRole('columnheader');
  });

  it('header row', async () => {
    // endDate should be immediately after startDate
    const startDateIndex = headerRowColumns.findIndex((elem) =>
      within(elem).queryByText(/downtimeList.columnHeader.startDate/i)
    );
    const endDateIndex = headerRowColumns.findIndex((elem) =>
      within(elem).queryByText(/downtimeList.columnHeader.endDate/i)
    );
    expect(startDateIndex).toBeGreaterThan(-1);
    expect(endDateIndex).toBeGreaterThan(-1);
    expect(endDateIndex).toEqual(startDateIndex + 1);

    // legalFactId and status must be present
    const legalFactIdHeader = within(headerRow).getByText(/downtimeList.columnHeader.legalFactId/i);
    const statusHeader = within(headerRow).getByText(/downtimeList.columnHeader.status/i);
    expect(legalFactIdHeader).toBeInTheDocument();
    expect(statusHeader).toBeInTheDocument();
  });

  // expect 4, one for the header, one for each of the three downtimes included
  it('row count', async () => {
    expect(rowComponents).toHaveLength(4);
  });

  it('date values', async () => {
    const startDateIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText(/downtimeList.columnHeader.startDate/i)
    );
    const endDateIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText(/downtimeList.columnHeader.endDate/i)
    );

    // first row - start date - date and time in different elements
    const firstDataRow = rowComponents[1];
    const firstRowColumns = within(firstDataRow).queryAllByRole('cell');
    const firstRowStartDate = firstRowColumns[startDateIndex];
    const startDateComponent1 = within(firstRowStartDate).getByText(
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
    const slashComponent = within(firstRowEndDate).getByText('-');
    expect(slashComponent).toBeInTheDocument();

    // third row - start date - date and time in different elements
    const thirdDataRow = rowComponents[3];
    const thirdRowColumns = within(thirdDataRow).getAllByRole('cell');
    const thirdRowEndDate = thirdRowColumns[endDateIndex];
    const endDateComponent3 = within(thirdRowEndDate).getByText(
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
      within(elem).queryByText(/downtimeList.columnHeader.functionality/i)
    );

    // first row - known functionality
    const firstDataRow = rowComponents[1];
    const firstRowColumns = within(firstDataRow).getAllByRole('cell');
    const firstRowFunctionality = firstRowColumns[functionalityIndex];
    const description1 = within(firstRowFunctionality).getByText(
      new RegExp(`legends.knownFunctionality.${KnownFunctionality.NotificationWorkflow}`, 'i')
    );
    expect(description1).toBeInTheDocument();

    // second row - unknown functionality
    const secondDataRow = rowComponents[2];
    const secondRowColumns = within(secondDataRow).getAllByRole('cell');
    const secondRowFunctionality = secondRowColumns[functionalityIndex];
    const description2 = within(secondRowFunctionality).getByText(/legends.unknownFunctionality/i);
    expect(description2).toBeInTheDocument();

    // third row - different known functionality
    const thirdDataRow = rowComponents[3];
    const thirdRowColumns = within(thirdDataRow).getAllByRole('cell');
    const thirdRowFunctionality = thirdRowColumns[functionalityIndex];
    const description3 = within(thirdRowFunctionality).getByText(
      new RegExp(`legends.knownFunctionality.${KnownFunctionality.NotificationCreate}`, 'i')
    );
    expect(description3).toBeInTheDocument();
  });

  it('legalFactId values', async () => {
    const legalFactIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText(/downtimeList.columnHeader.legalFactId/i)
    );

    // first row - open downtime
    const firstDataRow = rowComponents[1];
    const firstRowColumns = within(firstDataRow).getAllByRole('cell');
    const firstRowLegalFact = firstRowColumns[legalFactIndex];
    const button1 = within(firstRowLegalFact).queryByRole('button');
    expect(button1).not.toBeInTheDocument();
    const description1 = within(firstRowLegalFact).getByText(
      new RegExp(`legends.noFileAvailableByStatus.${DowntimeStatus.KO}`, 'i')
    );
    expect(description1).toBeInTheDocument();

    // second row - closed downtime no file available
    const secondDataRow = rowComponents[2];
    const secondRowColumns = within(secondDataRow).getAllByRole('cell');
    const secondRowLegalFact = secondRowColumns[legalFactIndex];
    const button2 = within(secondRowLegalFact).queryByRole('button');
    expect(button2).not.toBeInTheDocument();
    const description2 = within(secondRowLegalFact).getByText(
      new RegExp(`legends.noFileAvailableByStatus.${DowntimeStatus.OK}`, 'i')
    );
    expect(description2).toBeInTheDocument();

    // third row - file available
    const thirdDataRow = rowComponents[3];
    const thirdRowColumns = within(thirdDataRow).getAllByRole('cell');
    const thirdRowLegalFact = thirdRowColumns[legalFactIndex];
    const button3 = within(thirdRowLegalFact).getByRole('button');
    expect(button3).toBeInTheDocument();
    const description3 = button3 && within(button3).getByText(/legends.legalFactDownload/i);
    expect(description3).toBeInTheDocument();
  });

  it('status values', async () => {
    const statusIndex = Array.from(headerRowColumns).findIndex((elem) =>
      within(elem).queryByText(/downtimeList.columnHeader.status/i)
    );

    // first row - open downtime
    const firstDataRow = rowComponents[1];
    const firstRowColumns = within(firstDataRow).getAllByRole('cell');
    const firstRowStatus = firstRowColumns[statusIndex];
    const statusChip1 = within(firstRowStatus).getByTestId('downtime-status');
    expect(statusChip1).toHaveStyle({ 'background-color': fakePalette.error.light });
    const description1 =
      statusChip1 &&
      within(statusChip1).getByText(new RegExp(`legends.status.${DowntimeStatus.KO}`, 'i'));
    expect(description1).toBeInTheDocument();

    // third row - closed downtime
    const thirdDataRow = rowComponents[3];
    const thirdRowColumns = within(thirdDataRow).getAllByRole('cell');
    const thirdRowStatus = thirdRowColumns[statusIndex];
    const statusChip3 = within(thirdRowStatus).getByTestId('downtime-status');
    expect(statusChip3).toHaveStyle({ 'background-color': fakePalette.success.light });
    const description3 =
      statusChip3 &&
      within(statusChip3).getByText(new RegExp(`legends.status.${DowntimeStatus.OK}`, 'i'));
    expect(description3).toBeInTheDocument();
  });

  it('download action', async () => {
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(0);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(1);
    expect(getLegalFactDetailsMock).toHaveBeenCalledWith('some-legal-fact-id');
  });
});
