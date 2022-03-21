import * as redux from 'react-redux';

import * as actions from '../../redux/notification/actions';
import * as hooks from '../../redux/hooks';
import { notificationToFe } from '../../redux/notification/__test__/test-utils';
import { render } from '../../__test__/test-utils';
import NotificationDetail from '../NotificationDetail.page';

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({id: 'mocked-id'})
}));
jest.mock('../components/NotificationDetail/DetailTable', () => () => <div>Table</div>);
jest.mock('../components/NotificationDetail/DetailTimeline', () => () => <div>Documents</div>);
jest.mock('../components/NotificationDetail/DetailDocuments', () => () => <div>Timeline</div>);

describe('Notification Detail Page', () => {

  test('renders notification detail page', () => {
    // mock app selector
    const spy = jest.spyOn(hooks, 'useAppSelector');
    spy.mockReturnValueOnce(notificationToFe)
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // mock action
    const actionSpy = jest.spyOn(actions, 'getSentNotification');
    const mockActionFn = jest.fn();
    actionSpy.mockImplementation(mockActionFn);
    // render component
    const result = render(<NotificationDetail />);
    expect(result.getByRole('link')).toHaveTextContent(/Notifiche/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result.container).toHaveTextContent(/Table/i);
    expect(result.container).toHaveTextContent(/Documents/i);
    expect(result.container).toHaveTextContent(/Timeline/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith('mocked-id');
  });
});