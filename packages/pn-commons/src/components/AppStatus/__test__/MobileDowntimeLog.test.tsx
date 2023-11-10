import React from 'react';
import { vi } from 'vitest';

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
import MobileDowntimeLog from '../MobileDowntimeLog';

const fakePalette = { success: { light: '#00FF00' }, error: { light: '#FF0000' } };

vi.mock('@mui/material', async () => {
  const original = await vi.importActual('@mui/material') as any;
  return {
    ...original,
    useTheme: () => ({ palette: { ...original.useTheme().palette, ...fakePalette } }),
  };
});

const data = ['startDate', 'endDate', 'functionality', 'legalFactId'];

const checkStatusField = (status: DowntimeStatus, cardElem: HTMLElement) => {
  expect(cardElem).toHaveTextContent(`appStatus - legends.status.${status}`);
  const statusChip = within(cardElem).getByTestId('downtime-status');
  expect(statusChip).toHaveStyle({
    'background-color':
      status === DowntimeStatus.KO ? fakePalette.error.light : fakePalette.success.light,
  });
};

const checkDateField = (date: string, cardElem: HTMLElement) => {
  const text = date ? `${formatDate(date)}, ${formatTimeWithLegend(date)}` : '-';
  expect(cardElem).toHaveTextContent(text);
};

const checkFunctionalityField = (
  functionality: KnownFunctionality | undefined,
  rawFunctionality: string,
  cardElem: HTMLElement
) => {
  const text = functionality
    ? `appStatus - legends.knownFunctionality.${functionality}`
    : `appStatus - legends.unknownFunctionality - ${JSON.stringify({
        functionality: rawFunctionality,
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
          downtimeLog={exampleDowntimeLogPage}
          getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
        />
      );
    });
    const itemCards = result.getAllByTestId('itemCard');
    expect(itemCards).toHaveLength(exampleDowntimeLogPage.downtimes.length);
    itemCards.forEach((card, index) => {
      const currentLog = exampleDowntimeLogPage.downtimes[index];
      // check header
      const cardHeaderLeft = within(card).getByTestId('cardHeaderLeft');
      checkStatusField(currentLog.status, cardHeaderLeft);
      // check body
      const cardBodyLabel = within(card).getAllByTestId('cardBodyLabel');
      const cardBodyValue = within(card).getAllByTestId('cardBodyValue');
      cardBodyLabel.forEach((label, jindex) => {
        expect(label).toHaveTextContent(`appStatus - downtimeList.columnHeader.${data[jindex]}`);
        if (data[jindex] === 'startDate' || data[jindex] === 'endDate') {
          checkDateField(currentLog[data[jindex]], cardBodyValue[jindex]);
        }
        if (data[jindex] === 'functionality') {
          checkFunctionalityField(
            currentLog.knownFunctionality,
            currentLog.rawFunctionality,
            cardBodyValue[jindex]
          );
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
          downtimeLog={exampleDowntimeLogPage}
          getDowntimeLegalFactDocumentDetails={getLegalFactDetailsMock}
        />
      );
    });
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(0);
    const itemCards = result.getAllByTestId('itemCard');
    const logWithFile = exampleDowntimeLogPage.downtimes.findIndex((log) => log.fileAvailable);
    const button = within(itemCards[logWithFile]).getByRole('button');
    fireEvent.click(button);
    expect(getLegalFactDetailsMock).toHaveBeenCalledTimes(1);
    expect(getLegalFactDetailsMock).toHaveBeenCalledWith(
      exampleDowntimeLogPage.downtimes[logWithFile].legalFactId
    );
  });
});
