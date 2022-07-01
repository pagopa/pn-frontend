import * as redux from 'react-redux';
import { RenderResult } from '@testing-library/react';

import * as actions from '../../redux/notification/actions';
import * as hooks from '../../redux/hooks';
import { notificationToFe } from '../../redux/notification/__test__/test-utils';
import { axe, render } from '../../__test__/test-utils';
import NotificationDetail from '../NotificationDetail.page';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'mocked-id' }),
}));

jest.mock('@pagopa-pn/pn-commons', () => ({
  ...jest.requireActual('@pagopa-pn/pn-commons'),
  NotificationDetailTable: () => <div>Table</div>,
  NotificationDetailDocuments: () => <div>Documents</div>,
  NotificationDetailTimeline: () => <div>Timeline</div>,
}));

jest.mock('../../component/Notifications/NotificationPayment', () => () => <div>Payment</div>);

describe('NotificationDetail Page', () => {
  let result: RenderResult | undefined;
  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();

  beforeEach(async () => {
    // mock app selector
    const spy = jest.spyOn(hooks, 'useAppSelector');
    spy
      .mockReturnValueOnce(notificationToFe)
      .mockReturnValueOnce('mocked-sender')
      .mockReturnValueOnce('mocked-download-url')
      .mockReturnValueOnce('mocked-legal-fact-url')
      .mockReturnValueOnce({ legalDomicile: [] });
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // mock action
    const actionSpy = jest.spyOn(actions, 'getReceivedNotification');
    actionSpy.mockImplementation(mockActionFn);
    // render component
    result = render(<NotificationDetail />);
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockDispatchFn.mockClear();
    mockDispatchFn.mockReset();
    mockActionFn.mockClear();
    mockActionFn.mockReset();
  });

  test('renders NotificationDetail page', async() => {
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent(/Documents/i);
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({iun: 'mocked-id', madateId: undefined});
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
  });
});
