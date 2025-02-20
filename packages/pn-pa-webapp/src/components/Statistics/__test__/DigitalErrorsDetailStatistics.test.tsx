import { vi } from 'vitest';

import {
  digitalErrorsDataMock,
  digitalErrorsEmptyDataMock,
} from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import { DigitaErrorTypes, GraphColors } from '../../../models/Statistics';
import DigitalErrorsDetailStatistics from '../DigitalErrorsDetailStatistics';

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

  it('renders the component when data is available', () => {
    const { container, getByTestId } = render(
      <DigitalErrorsDetailStatistics {...digitalErrorsDataMock} />
    );
    expect(container).toHaveTextContent('digital_errors_detail.title');
    expect(container).toHaveTextContent('digital_errors_detail.description');
    expect(container).toHaveTextContent('digital_errors_detail.delivery_title');
    expect(container).toHaveTextContent('digital_errors_detail.delivery_description');
    expect(container).toHaveTextContent('digital_errors_detail.pec_title');
    expect(container).toHaveTextContent('digital_errors_detail.pec_description');

    const graph = getByTestId('Aggregate');
    expect(graph).toBeInTheDocument();

    expect(mockInput).toHaveBeenCalledWith({
      values: [
        {
          title: 'digital_errors_detail.delivery_title',
          description: 'digital_errors_detail.delivery_description',
          value: digitalErrorsDataMock.data[DigitaErrorTypes.DELIVERY_ERROR].count,
          color: GraphColors.lightRed,
        },
        {
          title: 'digital_errors_detail.pec_title',
          description: 'digital_errors_detail.pec_description',
          value: digitalErrorsDataMock.data[DigitaErrorTypes.INVALID_PEC].count,
          color: GraphColors.darkRed,
        },
      ],
      options: { color: [GraphColors.lightRed, GraphColors.darkRed] },
      startAngle: 180,
      endAngle: -180,
      radius: ['30%', '90%'],
      center: ['50%', '50%'],
    });
  });

  it('renders the empty state when data is not available', () => {
    const { container, getByTestId } = render(
      <DigitalErrorsDetailStatistics {...digitalErrorsEmptyDataMock} />
    );
    expect(container).toHaveTextContent('digital_errors_detail.title');
    expect(container).toHaveTextContent('empty.no_data_found');

    const emptyImg = getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });
});
