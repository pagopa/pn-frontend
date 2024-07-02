import { vi } from 'vitest';

import {
  aggregateDataMock,
  aggregateForwardedSeriesMock,
} from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import AggregateStatistics from '../AggregateStatistics';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const mockInput = vi.fn();
vi.mock('@pagopa-pn/pn-data-viz', async () => {
  return {
    ...(await vi.importActual<any>('@pagopa-pn/pn-data-viz')),
    PnECharts: (props: any) => {
      mockInput(props.option.series[0]);
      return 'mocked-chart';
    },
  };
});

describe('AggregateStatistics component tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls PnECharts component with the right props', () => {
    render(<AggregateStatistics {...aggregateDataMock} />);
    expect(mockInput).toHaveBeenCalledTimes(1);
    expect(mockInput).toHaveBeenCalledWith(aggregateForwardedSeriesMock);
  });
});
