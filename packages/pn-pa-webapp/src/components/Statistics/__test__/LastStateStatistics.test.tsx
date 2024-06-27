import { vi } from 'vitest';

import {
  lastStateDataForwardedMock,
  lastStateDataMock,
  lastStateEmptyDataMock,
} from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import LastStateStatistics from '../LastStateStatistics';

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
      mockInput(props.option.series[0].data);
      return 'mocked-chart';
    },
  };
});

describe('DigitalMeanTimeStatistics component tests', () => {
  it('renders the component when data is available', () => {
    const result = render(<LastStateStatistics data={lastStateDataMock} />);
    expect(result.container).toHaveTextContent('last_state.title');
    expect(result.container).toHaveTextContent('last_state.description');

    expect(result.container).toHaveTextContent('mocked-chart');
    expect(mockInput).toHaveBeenCalledWith(lastStateDataForwardedMock);
  });

  it('renders the empty state when data is not available', () => {
    const result = render(<LastStateStatistics data={lastStateEmptyDataMock} />);
    expect(result.container).toHaveTextContent('last_state.title');
    expect(result.container).toHaveTextContent('last_state.description');

    expect(result.container).toHaveTextContent('empty.component_description');

    const emptyImg = result.getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });
});
