import React from 'react';

import { exampleDowntimeLogPage } from '../../../__mocks__/AppStatus.mock';
import { DowntimeStatus, KnownFunctionality } from '../../../models';
import {
  RenderResult,
  act,
  fireEvent,
  initLocalizationForTest,
  render,
  within,
} from '../../../test-utils';
import { formatDate } from '../../../utility';
import { formatTimeWithLegend } from '../../../utility/date.utility';
import DesktopDowntimeLog from '../DesktopDowntimeLog';

const fakePalette = { success: { light: '#00FF00' }, error: { light: '#FF0000' } };
const columns = ['startDate', 'endDate', 'functionality', 'legalFactId', 'status'];

jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    useTheme: () => ({ palette: { ...original.useTheme().palette, ...fakePalette } }),
  };
});

const checkDateField = (date: string, column: HTMLElement) => {
  const text = date ? `${formatDate(date)},${formatTimeWithLegend(date)}` : '-';
  expect(column).toHaveTextContent(text);
};

const checkFunctionalityField = (
  functionality: KnownFunctionality | undefined,
  rawFunctionality: string,
  column: HTMLElement
) => {
  const text = functionality
    ? `appStatus - legends.knownFunctionality.${functionality}`
    : `appStatus - legends.unknownFunctionality - ${JSON.stringify({
        functionality: rawFunctionality,
      })}`;
  expect(column).toHaveTextContent(text);
};

const checkLegalFactField = (
  fileAvailable: boolean | undefined,
  status: DowntimeStatus,
  column: HTMLElement
) => {
  const text = fileAvailable
    ? `appStatus - legends.legalFactDownload`
    : `appStatus - legends.noFileAvailableByStatus.${status}`;
  expect(column).toHaveTextContent(text);
  const button = within(column).queryByRole('button');
  fileAvailable ? expect(button).toBeInTheDocument() : expect(button).not.toBeInTheDocument();
};

const checkStatusField = (status: DowntimeStatus, column: HTMLElement) => {
  expect(column).toHaveTextContent(`appStatus - legends.status.${status}`);
  const statusChip = within(column).getByTestId('downtime-status');
  expect(statusChip).toHaveStyle({
    'background-color':
      status === DowntimeStatus.KO ? fakePalette.error.light : fakePalette.success.light,
  });
};

describe('DesktopDowntimeLog component', () => {
  let result: RenderResult;
  const getLegalFactDetailsMock = jest.fn();

  beforeAll(() => {
    initLocalizationForTest();
  });

  it('renders component', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopDowntimeLog
          downtimeLog={exampleDowntimeLogPage}
          getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
        />
      );
    });
    // check header
    const headerRowColumns = result.getAllByTestId('tableDowntimeLog.header.cell');
    headerRowColumns.forEach((column, index) => {
      expect(column).toHaveTextContent(`appStatus - downtimeList.columnHeader.${columns[index]}`);
    });
    // check body
    const rows = result.getAllByTestId('tableDowntimeLog.body.row');
    expect(rows).toHaveLength(exampleDowntimeLogPage.downtimes.length);
    rows.forEach((row, index) => {
      const dataColumns = within(row).getAllByTestId('tableDowntimeLog.body.row.cell');
      const currentLog = exampleDowntimeLogPage.downtimes[index];
      dataColumns.forEach((column, jindex) => {
        if (columns[jindex] === 'startDate' || columns[jindex] === 'endDate') {
          checkDateField(currentLog[columns[jindex]], column);
        }
        if (columns[jindex] === 'functionality') {
          checkFunctionalityField(
            currentLog.knownFunctionality,
            currentLog.rawFunctionality,
            column
          );
        }
        if (columns[jindex] === 'legalFactId') {
          checkLegalFactField(currentLog.fileAvailable, currentLog.status, column);
        }
        if (columns[jindex] === 'status') {
          checkStatusField(currentLog.status, column);
        }
      });
    });
  });

  it('download action', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopDowntimeLog
          downtimeLog={exampleDowntimeLogPage}
          getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
        />
      );
    });
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(0);
    const rows = result.getAllByTestId('tableDowntimeLog.body.row');
    const logWithFile = exampleDowntimeLogPage.downtimes.findIndex((log) => log.fileAvailable);
    const button = within(rows[logWithFile]).getByRole('button');
    fireEvent.click(button);
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(1);
    expect(getLegalFactDetailsMock).toHaveBeenCalledWith(
      exampleDowntimeLogPage.downtimes[logWithFile].legalFactId
    );
  });
});
