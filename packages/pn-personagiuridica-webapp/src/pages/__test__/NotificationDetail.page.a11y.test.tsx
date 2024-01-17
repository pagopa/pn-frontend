import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { DOWNTIME_HISTORY } from '@pagopa-pn/pn-commons';

import { downtimesDTO } from '../../__mocks__/AppStatus.mock';
import { userResponse } from '../../__mocks__/Auth.mock';
import { arrayOfDelegators } from '../../__mocks__/Delegations.mock';
import { paymentInfo } from '../../__mocks__/ExternalRegistry.mock';
import { notificationDTO } from '../../__mocks__/NotificationDetail.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_PAYMENT_INFO,
} from '../../api/notifications/notifications.routes';
import NotificationDetail from '../NotificationDetail.page';

let mockIsDelegate = false;

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useParams: () =>
    mockIsDelegate
      ? { id: 'DAPQ-LWQV-DKQH-202308-A-1', mandateId: '5' }
      : { id: 'DAPQ-LWQV-DKQH-202308-A-1' },
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const delegator = arrayOfDelegators.find(
  (delegator) => delegator.delegator?.fiscalCode === notificationDTO.recipients[1].taxId
);

const paymentInfoRequest = paymentInfo.map((payment) => ({
  creditorTaxId: payment.creditorTaxId,
  noticeCode: payment.noticeCode,
}));

describe('NotificationDetail Page - accessibility tests', async () => {
  let result: RenderResult;
  let mock: MockAdapter;
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../../api/apiClients');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    mock.reset();
    mockIsDelegate = false;
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders NotificationDetail page', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: {
            user: userResponse,
          },
        },
      });
    });
    expect(await axe(result.container!)).toHaveNoViolations();
  }, 15000);

  it('renders NotificationDetail page with delegator logged', async () => {
    mockIsDelegate = true;
    mock
      .onGet(NOTIFICATION_DETAIL(notificationDTO.iun, delegator?.mandateId))
      .reply(200, notificationDTO);
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: userResponse },
        },
      });
    });
    expect(await axe(result.container!)).toHaveNoViolations(); // Accesibility test
  }, 15000);
});
