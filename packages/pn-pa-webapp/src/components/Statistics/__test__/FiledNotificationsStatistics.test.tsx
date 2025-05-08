import { vi } from 'vitest';

import { NotificationStatus } from '@pagopa-pn/pn-commons';

import { filedNotificationsDataMock } from '../../../__mocks__/Statistics.mock';
import { render } from '../../../__test__/test-utils';
import { GraphColors } from '../../../models/Statistics';
import FiledNotificationsStatistics from '../FiledNotificationsStatistics';

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

describe('FiledNotificationsStatistics component tests', () => {
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
    const { container, getByTestId } = render(
      <FiledNotificationsStatistics {...filedNotificationsDataMock} />
    );
    expect(container).toHaveTextContent('filed.title');
    expect(container).toHaveTextContent('filed.description');
    expect(container).toHaveTextContent('filed.description2');

    const graph = getByTestId('Aggregate');
    expect(graph).toBeInTheDocument();

    expect(mockInput).toHaveBeenCalledWith({
      ...filedNotificationsDataMock,
      data: [
        {
          title: 'filed.accepted',
          total: filedNotificationsDataMock.data[NotificationStatus.ACCEPTED].count,
          details: filedNotificationsDataMock.data[NotificationStatus.ACCEPTED].details,
        },
        {
          title: 'filed.refused',
          total: filedNotificationsDataMock.data[NotificationStatus.REFUSED].count,
          details: filedNotificationsDataMock.data[NotificationStatus.REFUSED].details,
        },
      ],
      options: { color: [GraphColors.blue, GraphColors.gold] },
    });
  });
});
