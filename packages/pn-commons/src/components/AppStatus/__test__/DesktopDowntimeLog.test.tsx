import React from 'react';
import { act, screen, within } from '@testing-library/react';
import { render } from '../../../test-utils';
import { DowntimeLogPage, DowntimeStatus, KnownFunctionality } from '../../../models';
import DesktopDowntimeLog from '../DesktopDowntimeLog';

const incidentTimestamps = [
  '2022-10-23T15:50:04Z',
  '2022-10-23T15:51:12Z',
  '2022-10-24T08:15:21Z',
  '2022-10-24T08:15:29Z',
  '2022-10-28T10:11:09Z',
]

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
      rawFunctionality: "NEW_FUNCTIONALITY",
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
      legalFactId: "some-legal-fact-id",
      fileAvailable: true,    
    },
  ],
};


jest.mock('../../../services/localization.service', () => {
  const original = jest.requireActual('../../../services/localization.service');
  return {
    ...original,
    getLocalizedOrDefaultLabel: (_: string, key: string) => key,
  };
});

describe('DesktopDowntimeLog component', () => {
  it("header row", async () => {
    await act(async () => void render(
      <DesktopDowntimeLog downtimeLog={exampleDowntimeLogPage} getDowntimeLegalFactDocumentDetails={() => {}} />
    ));
    const rowComponents = screen.queryAllByRole('row');
    const headerRow = rowComponents[0];
    const headerRowColumns = within(headerRow).queryAllByRole("columnheader");
    // const allCells = screen.queryAllByRole("cell");
    // console.log({ headerRow: headerRowColumns.length, allDocument: allCells.length });

    // endDate should be immediately after startDate
    const startDateIndex = Array.from(headerRowColumns).findIndex(elem => within(elem).queryByText("downtimeList.columnHeader.startDate"));
    const endDateIndex = Array.from(headerRowColumns).findIndex(elem => within(elem).queryByText("downtimeList.columnHeader.endDate"));
    expect(startDateIndex).toBeGreaterThan(-1);
    expect(endDateIndex).toBeGreaterThan(-1);
    expect(endDateIndex).toEqual(startDateIndex + 1);

    // legalFactId and status must be present
    const startDateHeader = within(headerRow).queryByText("downtimeList.columnHeader.legalFactId");
    const statusHeader = within(headerRow).queryByText("downtimeList.columnHeader.status");
    expect(startDateHeader).toBeInTheDocument();
    expect(statusHeader).toBeInTheDocument();
  });
});
