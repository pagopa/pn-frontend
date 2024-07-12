import { vi } from 'vitest';

import { testSelect } from '@pagopa-pn/pn-commons/src/test-utils';

import {
  aggregateAndTrendDataMocked,
  aggregateDataMock,
  trendDataMocked,
} from '../../../__mocks__/Statistics.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { Timeframe } from '../../../models/Statistics';
import AggregateAndTrendStatistics from '../AggregateAndTrendStatistics';

const mockInput = vi.fn();

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

vi.mock('../AggregateStatistics.tsx', async () => {
  const original = await vi.importActual<any>('../AggregateStatistics.tsx');
  return {
    ...original,
    default: (props: any) => {
      mockInput(props.values);
      return original.default(props);
    },
  };
});

vi.mock('../TrendStackedStatistics.tsx', async () => {
  const original = await vi.importActual<any>('../TrendStackedStatistics.tsx');
  return {
    ...original,
    default: (props: any) => {
      mockInput(props.startDate, props.endDate, props.lines, props.timeframe);
      return original.default(props);
    },
  };
});

const graphSelectValues = [
  {
    value: 'aggregate_graph',
    label: 'aggregate_graph',
  },
  {
    value: 'trend_graph',
    label: 'trend_graph',
  },
];

describe('AggregateAndTrendStatistics component tests', () => {
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

  it('renders the component with default initial values', () => {
    const { container, getByTestId } = render(
      <AggregateAndTrendStatistics {...aggregateAndTrendDataMocked} />
    );

    const graphTypeSelect = container.querySelector(`input[name="graph-type-select"]`);
    const aggregateComponent = getByTestId('Aggregate');

    expect(graphTypeSelect).toBeInTheDocument();
    expect(graphTypeSelect).toHaveValue(graphSelectValues[0].value);
    expect(aggregateComponent).toBeInTheDocument();
    expect(mockInput).toHaveBeenCalledWith(aggregateDataMock.values);
  });

  it('switches through view modes and daily/weekly timeframes', async () => {
    const { container, getByTestId } = render(
      <AggregateAndTrendStatistics {...aggregateAndTrendDataMocked} />
    );

    await testSelect(container, 'graph-type-select', graphSelectValues, 1);
    const trendComponent = getByTestId('Trend');
    expect(trendComponent).toBeInTheDocument();
    expect(mockInput).toHaveBeenCalledWith(
      trendDataMocked.startDate,
      trendDataMocked.endDate,
      trendDataMocked.lines,
      Timeframe.weekly
    );

    await testSelect(container, 'graph-type-select', graphSelectValues, 0);
    const aggregateComponent = getByTestId('Aggregate');
    expect(aggregateComponent).toBeInTheDocument();
    expect(mockInput).toHaveBeenCalledWith(aggregateDataMock.values);

    await testSelect(container, 'graph-type-select', graphSelectValues, 1);
    expect(mockInput).toHaveBeenCalledWith(
      trendDataMocked.startDate,
      trendDataMocked.endDate,
      trendDataMocked.lines,
      Timeframe.weekly
    );
    const dailyButton = getByTestId('daily-view');
    const weeklyButton = getByTestId('weekly-view');
    expect(dailyButton).toBeInTheDocument();
    expect(dailyButton).toBeEnabled();
    expect(weeklyButton).toBeInTheDocument();
    expect(weeklyButton).toBeDisabled();

    fireEvent.click(dailyButton);
    await waitFor(() => {
      expect(dailyButton).toBeDisabled();
      expect(weeklyButton).toBeEnabled();
      expect(mockInput).toHaveBeenCalledWith(
        trendDataMocked.startDate,
        trendDataMocked.endDate,
        trendDataMocked.lines,
        Timeframe.daily
      );
    });

    fireEvent.click(weeklyButton);
    await waitFor(() => {
      expect(weeklyButton).toBeDisabled();
      expect(dailyButton).toBeEnabled();
      expect(mockInput).toHaveBeenCalledWith(
        trendDataMocked.startDate,
        trendDataMocked.endDate,
        trendDataMocked.lines,
        Timeframe.weekly
      );
    });
  });
});
