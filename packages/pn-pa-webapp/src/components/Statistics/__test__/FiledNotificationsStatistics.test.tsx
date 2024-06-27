import { vi } from 'vitest';

import {
  filedNotificationsDataForwardedMock,
  filedNotificationsDataMock,
} from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import FiledNotificationsStatistics from '../FiledNotificationsStatistics';

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
      return 'mocked-chart';
    },
  };
});

describe('FiledNotificationsStatistics component tests', () => {
  it('renders the component', () => {
    const result = render(<FiledNotificationsStatistics {...filedNotificationsDataMock} />);
    expect(result.container).toHaveTextContent('filed.title');
    expect(result.container).toHaveTextContent('filed.description');
    expect(result.container).toHaveTextContent('filed.description2');

    expect(result.container).toHaveTextContent('mocked-chart');
    expect(mockInput).toHaveBeenCalledWith(filedNotificationsDataForwardedMock);
  });
});
