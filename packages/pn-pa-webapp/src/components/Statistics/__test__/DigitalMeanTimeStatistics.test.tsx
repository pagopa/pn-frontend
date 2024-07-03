import { vi } from 'vitest';

import { convertHoursToIntDays } from '@pagopa-pn/pn-commons';

import {
  digitalMeanTimeDataMock,
  digitalMeanTimeEmptyDataMock,
} from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import { GraphColors } from '../../../models/Statistics';
import DigitalMeanTimeStatistics from '../DigitalMeanTimeStatistics';

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
    const { container, getByTestId } = render(
      <DigitalMeanTimeStatistics {...digitalMeanTimeDataMock} />
    );
    expect(container).toHaveTextContent('digital_mean_time.title');
    expect(container).toHaveTextContent('digital_mean_time.description');

    const graph = getByTestId('digitalMeanTime');
    expect(graph).toBeInTheDocument();

    expect(mockInput).toHaveBeenCalledWith([
      {
        value: convertHoursToIntDays(
          digitalMeanTimeDataMock.data.delivered.time / digitalMeanTimeDataMock.data.delivered.count
        ),
        itemStyle: { color: GraphColors.lightBlue },
      },
      {
        value: convertHoursToIntDays(
          digitalMeanTimeDataMock.data.viewed.time / digitalMeanTimeDataMock.data.viewed.count
        ),
        itemStyle: { color: GraphColors.lightGreen },
      },
      {
        value: convertHoursToIntDays(
          digitalMeanTimeDataMock.data.refined.time / digitalMeanTimeDataMock.data.refined.count
        ),
        itemStyle: { color: GraphColors.darkGreen },
      },
    ]);
  });

  it('renders the empty state when data is not available', () => {
    const { container, getByTestId } = render(
      <DigitalMeanTimeStatistics {...digitalMeanTimeEmptyDataMock} />
    );
    expect(container).toHaveTextContent('digital_mean_time.title');
    expect(container).toHaveTextContent('digital_mean_time.description');

    expect(container).toHaveTextContent('empty.no_data_found');

    const emptyImg = getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });
});
