import { vi } from 'vitest';

import { beDowntimeHistoryWithIncidents } from '../../../__mocks__/AppStatus.mock';
import { KnownFunctionality } from '../../../models/AppStatus';
import { fireEvent, render } from '../../../test-utils';
import { formatDate, formatDateTime, formatTimeWithLegend } from '../../../utility/date.utility';
import { initLocalization } from '../../../utility/localization.utility';
import DowntimeLogDataSwitch from '../DowntimeLogDataSwitch';

describe('DowntimeLogDataSwitch Component', () => {
  beforeAll(() => {
    // custom implementation
    const mockedTranslationFn = (
      namespace: string | Array<string>,
      path: string,
      data?: { [key: string]: any }
    ) => {
      if (
        path.includes('knownFunctionality') &&
        !path.includes('unknownFunctionality') &&
        Object.values(KnownFunctionality).findIndex((functionality) =>
          path.includes(functionality)
        ) === -1
      ) {
        return path;
      }
      return data ? `${namespace} - ${path} - ${JSON.stringify(data)}` : `${namespace} - ${path}`;
    };
    initLocalization(mockedTranslationFn);
  });

  it('renders component - startDate', () => {
    const data = {
      id: '0',
      ...beDowntimeHistoryWithIncidents.result[0],
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
      ...beDowntimeHistoryWithIncidents.result[0],
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
      ...beDowntimeHistoryWithIncidents.result.find((d) => d.endDate)!,
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

  it('renders component - known functionality', () => {
    const data = {
      id: '0',
      ...beDowntimeHistoryWithIncidents.result.find((d) => d.functionality)!,
    };
    const { container } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="functionality"
        inTwoLines={false}
        getDowntimeLegalFactDocumentDetails={() => {}}
      />
    );
    const regexp = new RegExp(
      `^appStatus - legends.knownFunctionality.${data.functionality}$`,
      'ig'
    );
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - unknown functionality', () => {
    const data = {
      id: '0',
      ...beDowntimeHistoryWithIncidents.result.find(
        (d) => !Object.values(KnownFunctionality).includes(d.functionality)
      )!,
    };
    const { container } = render(
      <DowntimeLogDataSwitch
        data={data}
        type="functionality"
        inTwoLines={false}
        getDowntimeLegalFactDocumentDetails={() => {}}
      />
    );
    const regexp = new RegExp(
      `^appStatus - legends.unknownFunctionality - ${JSON.stringify({
        functionality: data.functionality,
      })}$`,
      'ig'
    );
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - legalFactId', () => {
    const data = {
      id: '0',
      ...beDowntimeHistoryWithIncidents.result.find((d) => d.fileAvailable)!,
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
      ...beDowntimeHistoryWithIncidents.result.find((d) => !d.fileAvailable)!,
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
      ...beDowntimeHistoryWithIncidents.result[0],
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
