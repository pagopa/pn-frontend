import { vi } from 'vitest';

import { testSelect } from '@pagopa-pn/pn-commons/src/test-utils';

import { aggregateAndTrendDataMocked } from '../../../__mocks__/Statistics.mock';
import { RenderResult, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import AggregateAndTrendStatistics from '../AggregateAndTrendStatistics';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

vi.mock('../AggregateStatistics.tsx', async () => {
  return {
    ...(await vi.importActual<any>('../AggregateStatistics.tsx')),
    default: () => {
      return 'mocked-aggregate';
    },
  };
});
vi.mock('../TrendStackedStatistics.tsx', async () => {
  return {
    ...(await vi.importActual<any>('../TrendStackedStatistics.tsx')),
    default: () => {
      return 'mocked-trend';
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
  let result: RenderResult;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with default initial values', () => {
    result = render(<AggregateAndTrendStatistics {...aggregateAndTrendDataMocked} />);

    // form = result.container.querySelector('form') as HTMLFormElement;
    const graphTypeSelect = result.container.querySelector(`input[name="graph-type-select"]`);
    const aggregateComponent = result.getByText('mocked-aggregate');

    expect(graphTypeSelect).toBeInTheDocument();
    expect(graphTypeSelect).toHaveValue(graphSelectValues[0].value);
    expect(aggregateComponent).toBeInTheDocument();
  });

  it.only('switches through view modes and daily/weekly timeframes', async () => {
    result = render(<AggregateAndTrendStatistics {...aggregateAndTrendDataMocked} />);

    await testSelect(result.container, 'graph-type-select', graphSelectValues, 1);

    const trendComponent = result.getByText('mocked-trend');
    expect(trendComponent).toBeInTheDocument();

    await testSelect(result.container, 'graph-type-select', graphSelectValues, 0);

    const aggregateComponent = result.getByText('mocked-aggregate');
    expect(aggregateComponent).toBeInTheDocument();

    await testSelect(result.container, 'graph-type-select', graphSelectValues, 1);

    const dailyButton = result.container.querySelector(`button[data-testid="daily-view"`);
    const weeklyButton = result.container.querySelector(`button[data-testid="weekly-view"`);

    expect(dailyButton).toBeInTheDocument();
    expect(dailyButton).toBeEnabled();
    expect(weeklyButton).toBeInTheDocument();
    expect(weeklyButton).toBeDisabled();

    fireEvent.click(dailyButton!);

    await waitFor(() => {
      expect(dailyButton).toBeDisabled();
      expect(weeklyButton).toBeEnabled();
    });

    fireEvent.click(weeklyButton!);

    await waitFor(() => {
      expect(weeklyButton).toBeDisabled();
      expect(dailyButton).toBeEnabled();
    });
  });
});
