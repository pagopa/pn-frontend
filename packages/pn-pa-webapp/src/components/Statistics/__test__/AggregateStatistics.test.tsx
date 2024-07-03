import { vi } from 'vitest';

import { aggregateDataMock } from '../../../__mocks__/Statistics.mock';
import { render, within } from '../../../__test__/test-utils';
import AggregateStatistics from '../AggregateStatistics';

const mockInput = vi.fn();

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

vi.mock('@pagopa-pn/pn-data-viz', async () => {
  const original = await vi.importActual<any>('@pagopa-pn/pn-data-viz');
  return {
    ...original,
    PnECharts: (props: any) => {
      mockInput(props.option.series[0]);
      return original.PnECharts(props);
    },
  };
});

describe('AggregateStatistics component tests', () => {
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

  it('renders the component - no legend', () => {
    const { getByTestId, queryByTestId } = render(<AggregateStatistics {...aggregateDataMock} />);
    const graph = getByTestId('Aggregate');
    const legendContainer = queryByTestId('legendContainer');
    expect(graph).toBeInTheDocument();
    expect(legendContainer).not.toBeInTheDocument();
    expect(mockInput).toHaveBeenCalledWith({
      type: 'pie',
      radius: aggregateDataMock.radius,
      center: aggregateDataMock.center,
      startAngle: aggregateDataMock.startAngle,
      endAngle: aggregateDataMock.endAngle,
      data: aggregateDataMock.values.map((item) => ({
        value: item.value,
        name: item.title,
      })),
    });
  });

  it('renders the component - legend', () => {
    const { getByTestId } = render(<AggregateStatistics {...aggregateDataMock} legend />);
    const graph = getByTestId('Aggregate');
    const legendContainer = getByTestId('legendContainer');
    const legendItems = within(legendContainer).getAllByTestId('legendItem');
    const legend = aggregateDataMock.values.map((item) => item.title);
    expect(graph).toBeInTheDocument();
    expect(legendContainer).toBeInTheDocument();
    expect(legendItems).toHaveLength(legend.length);
    for (let i = 0; i < legend.length; i++) {
      expect(legendItems[i]).toHaveTextContent(legend[i]);
    }
    expect(mockInput).toHaveBeenCalledWith({
      type: 'pie',
      radius: aggregateDataMock.radius,
      center: aggregateDataMock.center,
      startAngle: aggregateDataMock.startAngle,
      endAngle: aggregateDataMock.endAngle,
      data: aggregateDataMock.values.map((item) => ({
        value: item.value,
        name: item.title,
      })),
    });
  });
});
