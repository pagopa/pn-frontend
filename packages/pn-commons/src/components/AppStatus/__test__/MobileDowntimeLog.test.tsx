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
import MobileDowntimeLog from '../MobileDowntimeLog';

const data = ['startDate', 'endDate', 'functionality', 'legalFactId'];

const checkStatusField = (status: DowntimeStatus, cardElem: HTMLElement) => {
  expect(cardElem).toHaveTextContent(`appStatus - legends.status.${status}`);
  const statusChip = within(cardElem).getByTestId('downtime-status');
  expect(statusChip).toHaveStyle({
    'background-color':
      status === DowntimeStatus.KO ? theme.palette.error.main : theme.palette.success.main,
  });
};

const checkDateField = (date: string | undefined, cardElem: HTMLElement) => {
  const text = date ? `${formatDate(date)}, ${formatTimeWithLegend(date)}` : '-';
  expect(cardElem).toHaveTextContent(text);
};

const checkFunctionalityField = (functionality: KnownFunctionality, cardElem: HTMLElement) => {
  const text = functionality
    ? `appStatus - legends.knownFunctionality.${functionality}`
    : `appStatus - legends.unknownFunctionality - ${JSON.stringify({
        functionality,
      })}`;
  expect(cardElem).toHaveTextContent(text);
};

const checkLegalFactField = (
  fileAvailable: boolean | undefined,
  status: DowntimeStatus,
  cardElem: HTMLElement
) => {
  const text = fileAvailable
    ? `appStatus - legends.legalFactDownload`
    : `appStatus - legends.noFileAvailableByStatus.${status}`;
  expect(cardElem).toHaveTextContent(text);
  const button = within(cardElem).queryByRole('button');
  fileAvailable ? expect(button).toBeInTheDocument() : expect(button).not.toBeInTheDocument();
};

describe('MobileDowntimeLog component', () => {
  let result: RenderResult;
  const getLegalFactDetailsMock = vi.fn();

  beforeAll(() => {
    initLocalizationForTest();
  });

  it('renders component', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileDowntimeLog
          downtimeLog={beDowntimeHistoryWithIncidents}
          getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
        />
      );
    });
    const itemCards = result.getAllByTestId('mobileTableDowntimeLog.cards');
    expect(itemCards).toHaveLength(beDowntimeHistoryWithIncidents.result.length);
    itemCards.forEach((card, index) => {
      const currentLog = beDowntimeHistoryWithIncidents.result[index];
      // check header
      const cardHeaderLeft = within(card).getByTestId('cardHeaderLeft');
      checkStatusField(currentLog.status, cardHeaderLeft);
      // check body
      const cardBodyLabel = within(card).getAllByTestId('cardBodyLabel');
      const cardBodyValue = within(card).getAllByTestId('cardBodyValue');
      cardBodyLabel.forEach((label, jindex) => {
        expect(label).toHaveTextContent(`appStatus - downtimeList.columnHeader.${data[jindex]}`);
        if (data[jindex] === 'startDate' || data[jindex] === 'endDate') {
          checkDateField(
            currentLog[data[jindex] as 'startDate' | 'endDate'],
            cardBodyValue[jindex]
          );
        }
        if (data[jindex] === 'functionality') {
          checkFunctionalityField(currentLog.functionality, cardBodyValue[jindex]);
        }
        if (data[jindex] === 'legalFactId') {
          checkLegalFactField(currentLog.fileAvailable, currentLog.status, cardBodyValue[jindex]);
        }
      });
    });
  });

  it('download action', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileDowntimeLog
          downtimeLog={beDowntimeHistoryWithIncidents}
          getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
        />
      );
    });
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(0);
    const itemCards = result.getAllByTestId('mobileTableDowntimeLog.cards');
    const logWithFile = beDowntimeHistoryWithIncidents.result.findIndex((log) => log.fileAvailable);
    const button = within(itemCards[logWithFile]).getByRole('button');
    fireEvent.click(button);
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(1);
    expect(getLegalFactDetailsMock).toHaveBeenCalledWith(
      beDowntimeHistoryWithIncidents.result[logWithFile].legalFactId
    );
  });
});
