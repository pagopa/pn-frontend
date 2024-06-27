import { vi } from 'vitest';

import {
  dailyTrendForwardedSeriesMock,
  trendDataMocked,
  weeklyTrendForwardedSeriesMock,
} from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import { Timeframe } from '../../../models/Statistics';
import TrendStackedStatistics from '../TrendStackedStatistics';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const mockInput = vi.fn();
vi.mock('@pagopa-pn/pn-data-viz', async () => {
  return {
    ...(await vi.importActual<any>('@pagopa-pn/pn-data-viz')),
    PnECharts: (props: any) => {
      mockInput(props.option.series);
      return 'mocked-chart';
    },
  };
});

describe('TrendStackedStatistics component tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the component using daily timeframe', () => {
    render(<TrendStackedStatistics {...trendDataMocked} timeframe={Timeframe.daily} />);
    expect(mockInput).toHaveBeenCalledTimes(1);
    expect(mockInput).toHaveBeenCalledWith(dailyTrendForwardedSeriesMock);
  });

  it('renders the component using weekly timeframe', () => {
    render(<TrendStackedStatistics {...trendDataMocked} timeframe={Timeframe.weekly} />);
    expect(mockInput).toHaveBeenCalledTimes(1);
    expect(mockInput).toHaveBeenCalledWith(weeklyTrendForwardedSeriesMock);
  });
});
