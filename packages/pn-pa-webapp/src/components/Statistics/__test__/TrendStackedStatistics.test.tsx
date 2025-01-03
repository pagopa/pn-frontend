import { vi } from 'vitest';

import { getDaysFromDateRange, getWeeksFromDateRange } from '@pagopa-pn/pn-commons';

import { trendDataMocked } from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import { Timeframe } from '../../../models/Statistics';
import TrendStackedStatistics from '../TrendStackedStatistics';

const mockInput = vi.fn();

vi.mock('@pagopa-pn/pn-data-viz', async () => {
  const original = await vi.importActual<any>('@pagopa-pn/pn-data-viz');
  return {
    ...original,
    PnECharts: (props: any) => {
      mockInput(props.option.series);
      return original.PnECharts(props);
    },
  };
});

describe('TrendStackedStatistics component tests', () => {
  const originalClientHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'clientHeight'
  );
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

  beforeAll(() => {
    // we need this, because the element taken with useRef doesn't have height and width
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 200,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      value: originalClientHeight,
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      value: originalClientWidth,
      configurable: true,
    });
  });

  it('renders the component using daily timeframe - no legend', () => {
    render(<TrendStackedStatistics {...trendDataMocked} timeframe={Timeframe.daily} />);
    expect(mockInput).toHaveBeenCalledWith(
      trendDataMocked.lines.map((line) => ({
        name: line.title,
        type: 'line',
        data: getDaysFromDateRange(trendDataMocked.startDate, trendDataMocked.endDate).map(
          (day) => {
            const elem = line.values?.find((item) => item.send_date === day);
            return elem ? elem.count : 0;
          }
        ),
      }))
    );
  });

  it('renders the component using weekly timeframe - no legend', () => {
    render(<TrendStackedStatistics {...trendDataMocked} timeframe={Timeframe.weekly} />);
    expect(mockInput).toHaveBeenCalledWith(
      trendDataMocked.lines.map((line) => ({
        name: line.title,
        type: 'line',
        data: getWeeksFromDateRange(trendDataMocked.startDate, trendDataMocked.endDate, 0).map(
          (week) =>
            line.values
              ?.map((item) =>
                item.send_date >= week.start && item.send_date <= week.end ? item.count : 0
              )
              .reduce((total, current) => total + current, 0)
        ),
      }))
    );
  });
});
