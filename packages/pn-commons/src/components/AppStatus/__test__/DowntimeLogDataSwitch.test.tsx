import React from 'react';
import { vi } from 'vitest';

import { exampleDowntimeLogPage } from '../../../__mocks__/AppStatus.mock';
import { fireEvent, initLocalizationForTest, render } from '../../../test-utils';
import { formatDate, formatDateTime } from '../../../utility';
import { formatTimeWithLegend } from '../../../utility/date.utility';
import DowntimeLogDataSwitch from '../DowntimeLogDataSwitch';

describe('DowntimeLogDataSwitch Component', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('renders component - startDate', () => {
    const data = {
      id: '0',
      ...exampleDowntimeLogPage.downtimes[0],
    };
    const { container } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="startDate"
        inTwoLines={false}
        getDowntimeLegalFactDocumentDetails={() => {}}
      />
    );
    const regexp = new RegExp(`^${formatDateTime(data.startDate)}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - startDate - two lines', () => {
    const data = {
      id: '0',
      ...exampleDowntimeLogPage.downtimes[0],
    };
    const { container } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="startDate"
        inTwoLines
        getDowntimeLegalFactDocumentDetails={() => {}}
      />
    );
    const regexp = new RegExp(
      `^${formatDate(data.startDate)},${formatTimeWithLegend(data.startDate)}$`,
      'ig'
    );
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - endDate', () => {
    const data = {
      id: '0',
      ...exampleDowntimeLogPage.downtimes.find((d) => d.endDate)!,
    };
    const { container } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="endDate"
        inTwoLines={false}
        getDowntimeLegalFactDocumentDetails={() => {}}
      />
    );
    const regexp = new RegExp(`^${formatDateTime(data.endDate ?? '')}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - knownFunctionality', () => {
    const data = {
      id: '0',
      ...exampleDowntimeLogPage.downtimes.find((d) => d.knownFunctionality)!,
    };
    const { container } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="knownFunctionality"
        inTwoLines={false}
        getDowntimeLegalFactDocumentDetails={() => {}}
      />
    );
    const regexp = new RegExp(
      `^appStatus - legends.knownFunctionality.${data.knownFunctionality}$`,
      'ig'
    );
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - knownFunctionality undefined', () => {
    const data = {
      id: '0',
      ...exampleDowntimeLogPage.downtimes.find((d) => !d.knownFunctionality)!,
    };
    const { container } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="knownFunctionality"
        inTwoLines={false}
        getDowntimeLegalFactDocumentDetails={() => {}}
      />
    );
    const regexp = new RegExp(
      `^appStatus - legends.unknownFunctionality - ${JSON.stringify({
        functionality: data.rawFunctionality,
      })}$`,
      'ig'
    );
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - legalFactId', () => {
    const data = {
      id: '0',
      ...exampleDowntimeLogPage.downtimes.find((d) => d.fileAvailable)!,
    };
    const getDowntimeLegalFactDocumentDetailsMock = vi.fn();
    const { container, getByTestId } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="legalFactId"
        inTwoLines={false}
        getDowntimeLegalFactDocumentDetails={getDowntimeLegalFactDocumentDetailsMock}
      />
    );
    expect(container).toHaveTextContent(/^appStatus - legends.legalFactDownload$/gi);
    const button = getByTestId('download-legal-fact');
    fireEvent.click(button);
    expect(getDowntimeLegalFactDocumentDetailsMock).toBeCalledTimes(1);
    expect(getDowntimeLegalFactDocumentDetailsMock).toBeCalledWith(data.legalFactId);
  });

  it('renders component - legalFactId - no file available', () => {
    const data = {
      id: '0',
      ...exampleDowntimeLogPage.downtimes.find((d) => !d.fileAvailable)!,
    };
    const { container, queryByTestId } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="legalFactId"
        inTwoLines={false}
        getDowntimeLegalFactDocumentDetails={() => {}}
      />
    );
    const regexp = new RegExp(`^appStatus - legends.noFileAvailableByStatus.${data.status}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const button = queryByTestId('download-legal-fact');
    expect(button).not.toBeInTheDocument();
  });

  it('renders component - status', () => {
    const data = {
      id: '0',
      ...exampleDowntimeLogPage.downtimes[0],
    };
    const { container } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="status"
        inTwoLines={false}
        getDowntimeLegalFactDocumentDetails={() => {}}
      />
    );
    const regexp = new RegExp(`^appStatus - legends.status.${data.status}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });
});
