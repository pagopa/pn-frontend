import { vi } from 'vitest';

import { NotificationStatus } from '@pagopa-pn/pn-commons';

import { lastStateDataMock, lastStateEmptyDataMock } from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import { GraphColors } from '../../../models/Statistics';
import LastStateStatistics from '../LastStateStatistics';

const mockInput = vi.fn();

vi.mock('@pagopa-pn/pn-data-viz', async () => {
  const original = await vi.importActual<any>('@pagopa-pn/pn-data-viz');
  return {
    ...original,
    PnECharts: (props: any) => {
      mockInput(props.option.series[0].data);
      return original.PnECharts(props);
    },
  };
});

describe('DigitalMeanTimeStatistics component tests', () => {
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

  it('renders the component when data is available', () => {
    const { container, getByTestId } = render(<LastStateStatistics data={lastStateDataMock} />);
    expect(container).toHaveTextContent('last_state.title');
    expect(container).toHaveTextContent('last_state.description');

    const graph = getByTestId('lastState');
    expect(graph).toBeInTheDocument();

    expect(mockInput).toHaveBeenCalledWith([
      {
        value: lastStateDataMock[NotificationStatus.DELIVERING],
        itemStyle: { color: GraphColors.lightGrey },
      },
      {
        value: lastStateDataMock[NotificationStatus.DELIVERED],
        itemStyle: { color: GraphColors.lightBlue },
      },
      {
        value: lastStateDataMock[NotificationStatus.VIEWED],
        itemStyle: { color: GraphColors.lightGreen },
      },
      {
        value: lastStateDataMock[NotificationStatus.EFFECTIVE_DATE],
        itemStyle: { color: GraphColors.darkGreen },
      },
      {
        value: lastStateDataMock[NotificationStatus.CANCELLED],
        itemStyle: { color: GraphColors.gold },
      },
      {
        value: lastStateDataMock[NotificationStatus.UNREACHABLE],
        itemStyle: { color: GraphColors.lightRed },
      },
      {
        value: lastStateDataMock[NotificationStatus.RETURNED_TO_SENDER],
        itemStyle: { color: GraphColors.pink },
      },
    ]);
  });

  it('renders the empty state when data is not available', () => {
    const { container, getByTestId } = render(
      <LastStateStatistics data={lastStateEmptyDataMock} />
    );
    expect(container).toHaveTextContent('last_state.title');
    expect(container).toHaveTextContent('last_state.description');

    expect(container).toHaveTextContent('empty.no_data_found');

    const emptyImg = getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });
});
