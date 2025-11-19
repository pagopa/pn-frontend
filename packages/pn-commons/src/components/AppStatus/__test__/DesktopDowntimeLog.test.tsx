import { vi } from 'vitest';

import { beDowntimeHistoryWithIncidents } from '../../../__mocks__/AppStatus.mock';
import { DowntimeStatus, KnownFunctionality } from '../../../models/AppStatus';
import {
  RenderResult,
  act,
  fireEvent,
  initLocalizationForTest,
  render,
  theme,
  within,
} from '../../../test-utils';
import { formatDate, formatTimeWithLegend } from '../../../utility/date.utility';
import DesktopDowntimeLog from '../DesktopDowntimeLog';

const columns = ['startDate', 'endDate', 'functionality', 'legalFactId', 'status'];

const checkDateField = (date: string | undefined, column: HTMLElement) => {
  const text = date ? `${formatDate(date)},${formatTimeWithLegend(date)}` : '-';
  expect(column).toHaveTextContent(text);
};

const checkFunctionalityField = (functionality: KnownFunctionality, column: HTMLElement) => {
  const text = functionality
    ? `appStatus - legends.knownFunctionality.${functionality}`
    : `appStatus - legends.unknownFunctionality - ${JSON.stringify({
        functionality: functionality,
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
      status === DowntimeStatus.KO ? theme.palette.error.main : theme.palette.success.main,
  });
};

describe('DesktopDowntimeLog component', () => {
  let result: RenderResult;
  const getLegalFactDetailsMock = vi.fn();

  beforeAll(() => {
    initLocalizationForTest();
  });

  it('renders component', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopDowntimeLog
          downtimeLog={beDowntimeHistoryWithIncidents}
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
    const rows = result.getAllByTestId('tableDowntimeLog.row');
    expect(rows).toHaveLength(beDowntimeHistoryWithIncidents.result.length);
    rows.forEach((row, index) => {
      const dataColumns = within(row).getAllByTestId('tableDowntimeLog.row.cell');
      const currentLog = beDowntimeHistoryWithIncidents.result[index];
      dataColumns.forEach((column, jindex) => {
        if (columns[jindex] === 'startDate' || columns[jindex] === 'endDate') {
          checkDateField(currentLog[columns[jindex] as 'startDate' | 'endDate'], column);
        }
        if (columns[jindex] === 'functionality') {
          checkFunctionalityField(currentLog.functionality, column);
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
          downtimeLog={beDowntimeHistoryWithIncidents}
          getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
        />
      );
    });
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(0);
    const rows = result.getAllByTestId('tableDowntimeLog.row');
    const logWithFile = beDowntimeHistoryWithIncidents.result.findIndex((log) => log.fileAvailable);
    const button = within(rows[logWithFile]).getByRole('button');
    fireEvent.click(button);
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(1);
    expect(getLegalFactDetailsMock).toHaveBeenCalledWith(
      beDowntimeHistoryWithIncidents.result[logWithFile].legalFactId
    );
  });
});
