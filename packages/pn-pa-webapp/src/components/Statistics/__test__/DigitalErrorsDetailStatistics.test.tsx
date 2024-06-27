import { vi } from 'vitest';

import {
  digitalErrorsDataForwardedMock,
  digitalErrorsDataMock,
  digitalErrorsEmptyDataMock,
} from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import DigitalErrorsDetailStatistics from '../DigitalErrorsDetailStatistics';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const mockInput = vi.fn();
vi.mock('../AggregateStatistics.tsx', async () => {
  return {
    ...(await vi.importActual<any>('../AggregateStatistics.tsx')),
    default: (props: any) => {
      mockInput(props);
      return 'AggregateStatisticsMockedComponent';
    },
  };
});

describe('DeliveryModeStatistics component tests', () => {
  it('renders the component when data is available', () => {
    const result = render(<DigitalErrorsDetailStatistics {...digitalErrorsDataMock} />);
    expect(result.container).toHaveTextContent('digital_errors_detail.title');
    expect(result.container).toHaveTextContent('digital_errors_detail.description');

    expect(result.container).toHaveTextContent('digital_errors_detail.delivery_title');
    expect(result.container).toHaveTextContent('digital_errors_detail.delivery_description');

    expect(result.container).toHaveTextContent('digital_errors_detail.pec_title');
    expect(result.container).toHaveTextContent('digital_errors_detail.pec_description');

    expect(result.container).toHaveTextContent('digital_errors_detail.rejected_title');
    expect(result.container).toHaveTextContent('digital_errors_detail.rejected_description');

    expect(result.container).toHaveTextContent('AggregateStatisticsMockedComponent');
    expect(mockInput).toHaveBeenCalledWith(digitalErrorsDataForwardedMock);
  });

  it('renders the empty state when data is not available', () => {
    const result = render(<DigitalErrorsDetailStatistics {...digitalErrorsEmptyDataMock} />);
    expect(result.container).toHaveTextContent('digital_errors_detail.title');
    expect(result.container).toHaveTextContent('digital_errors_detail.description');

    expect(result.container).toHaveTextContent('digital_errors_detail.delivery_title');
    expect(result.container).toHaveTextContent('digital_errors_detail.delivery_description');

    expect(result.container).toHaveTextContent('digital_errors_detail.pec_title');
    expect(result.container).toHaveTextContent('digital_errors_detail.pec_description');

    expect(result.container).toHaveTextContent('digital_errors_detail.rejected_title');
    expect(result.container).toHaveTextContent('digital_errors_detail.rejected_description');

    expect(result.container).toHaveTextContent('empty.component_description');

    const emptyImg = result.getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });
});
