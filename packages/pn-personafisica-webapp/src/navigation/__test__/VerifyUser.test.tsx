import * as redux from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { render } from '../../__test__/test-utils';
import * as actions from '../../redux/auth/actions';
import VerifyUser from '../VerifyUser';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    hash: '#token=mocked-hash',
    state: '',
    key: '',
    pathname: '',
    search: '',
  }),
}));

describe('VerifyUser Component', () => {
  beforeEach(() => {
    // useSelector mock
    const useSelectorSpy = jest.spyOn(redux, 'useSelector');
    useSelectorSpy.mockReturnValue('mocked-token');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('checks token and navigation (valid)', async () => {
    // mock action
    const actionSpy = jest.spyOn(actions, 'exchangeToken');
    const mockActionFn = jest.fn();
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatchFn = jest.fn(() => Promise.resolve()) as Dispatch<any>;
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // render component
    render(<VerifyUser />);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith('mocked-hash');
  });
});
