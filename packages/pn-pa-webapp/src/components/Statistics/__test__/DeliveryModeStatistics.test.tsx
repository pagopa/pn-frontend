import { vi } from 'vitest';

import {
  deliveryModeDataForwardedMock,
  deliveryModeDataMock,
} from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import DeliveryModeStatistics from '../DeliveryModeStatistics';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const mockInput = vi.fn();
vi.mock('../AggregateAndTrendStatistics.tsx', async () => {
  return {
    ...(await vi.importActual<any>('../AggregateAndTrendStatistics.tsx')),
    default: (props: any) => {
      mockInput(props);
      return 'AggregateAndTrendStatisticsMockedComponent';
    },
  };
});

describe('DeliveryModeStatistics component tests', () => {
  it('renders the component', () => {
    const result = render(<DeliveryModeStatistics {...deliveryModeDataMock} />);
    expect(result.container).toHaveTextContent('delivery_mode.title');
    expect(result.container).toHaveTextContent('delivery_mode.description');

    expect(result.container).toHaveTextContent('AggregateAndTrendStatisticsMockedComponent');
    expect(mockInput).toHaveBeenCalledWith(deliveryModeDataForwardedMock);
  });
});
