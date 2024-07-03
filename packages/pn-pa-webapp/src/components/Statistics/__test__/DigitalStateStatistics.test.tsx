import { vi } from 'vitest';

import {
  digitalStateDataMock,
  digitalStateEmptyDataMock,
} from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import { GraphColors, ResponseStatus } from '../../../models/Statistics';
import DigitalStateStatistics from '../DigitalStateStatistics';

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

describe('DigitaStateStatistics component tests', () => {
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
    const { container, getByTestId } = render(<DigitalStateStatistics {...digitalStateDataMock} />);
    expect(container).toHaveTextContent('digital_state.title');
    expect(container).toHaveTextContent('digital_state.description');

    const graph = getByTestId('digitalState');
    expect(graph).toBeInTheDocument();

    expect(mockInput).toHaveBeenCalledWith([
      {
        value: digitalStateDataMock.data[ResponseStatus.OK],
        itemStyle: { color: GraphColors.blue },
      },
      {
        value: digitalStateDataMock.data[ResponseStatus.KO],
        itemStyle: { color: GraphColors.azure },
      },
      {
        value: digitalStateDataMock.data[ResponseStatus.PROGRESS],
        itemStyle: { color: GraphColors.lightGrey },
      },
    ]);
  });

  it('renders the empty state when data is not available', () => {
    const { container, getByTestId } = render(
      <DigitalStateStatistics {...digitalStateEmptyDataMock} />
    );
    expect(container).toHaveTextContent('digital_state.title');
    expect(container).toHaveTextContent('digital_state.description');
    expect(container).toHaveTextContent('empty.no_data_found');

    const emptyImg = getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });
});
