import { NotificationDetail as INotificationDetail } from '@pagopa-pn/pn-commons';
import { notificationToFe, overrideNotificationMock } from '../../redux/notification/__test__/test-utils';
import { axe } from '../../__test__/test-utils';
import { renderComponentBase } from './NotificationDetail.page.test-utils';

/* eslint-disable-next-line functional/no-let */
let mockUseParamsFn;

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
      t: (str: string) => str,
    }),
}));

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useParams: () => mockUseParamsFn(),
  };
});

describe('NotificationDetail Page - accessibility tests', () => {
  /* eslint-disable-next-line functional/no-let */
  let mockDispatchFn: jest.Mock;
  /* eslint-disable-next-line functional/no-let */
  let mockActionFn: jest.Mock;

  const mockedUserInStore = { fiscal_number: 'mocked-user' };

  const renderComponent = async (notification: INotificationDetail) => 
    renderComponentBase({ mockedUserInStore, mockDispatchFn, mockActionFn, mockUseParamsFn}, notification);
  

  beforeEach(() => {
    mockDispatchFn = jest.fn(() => ({
      then: () => Promise.resolve(),
      unwrap: () => Promise.resolve(),
    }));
    mockActionFn = jest.fn();
    mockUseParamsFn = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders NotificationDetail page with payment box', async () => {
    const result = await renderComponent(notificationToFe);
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result.container).toHaveTextContent(/Payment/i);
    expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  }, 15000);

  test('renders NotificationDetail page without payment box', async () => {
    const result = await renderComponent(overrideNotificationMock({recipients: [{payment: { noticeCode: '' }}]}));
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container).not.toHaveTextContent(/Payment/i);
    expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  }, 15000);

});
