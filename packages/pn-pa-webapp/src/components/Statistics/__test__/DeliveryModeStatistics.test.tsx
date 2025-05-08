import { vi } from 'vitest';

import { deliveryModeDataMock } from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import { GraphColors, StatisticsDeliveryMode } from '../../../models/Statistics';
import DeliveryModeStatistics from '../DeliveryModeStatistics';

const mockInput = vi.fn();

vi.mock('../AggregateAndTrendStatistics.tsx', async () => {
  const original = await vi.importActual<any>('../AggregateAndTrendStatistics.tsx');
  return {
    ...original,
    default: (props: any) => {
      mockInput(props);
      return original.default(props);
    },
  };
});

describe('DeliveryModeStatistics component tests', () => {
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

  it('renders the component', () => {
    const { container, getByTestId } = render(<DeliveryModeStatistics {...deliveryModeDataMock} />);
    expect(container).toHaveTextContent('delivery_mode.title');
    expect(container).toHaveTextContent('delivery_mode.description');

    const graph = getByTestId('Aggregate');
    expect(graph).toBeInTheDocument();

    expect(mockInput).toHaveBeenCalledWith({
      ...deliveryModeDataMock,
      data: [
        {
          title: 'delivery_mode.digital',
          total: deliveryModeDataMock.data[StatisticsDeliveryMode.DIGITAL].count,
          details: deliveryModeDataMock.data[StatisticsDeliveryMode.DIGITAL].details,
        },
        {
          title: 'delivery_mode.analog',
          total: deliveryModeDataMock.data[StatisticsDeliveryMode.ANALOG].count,
          details: deliveryModeDataMock.data[StatisticsDeliveryMode.ANALOG].details,
        },
      ],
      options: { color: [GraphColors.blue, GraphColors.turquoise] },
    });
  });
});
