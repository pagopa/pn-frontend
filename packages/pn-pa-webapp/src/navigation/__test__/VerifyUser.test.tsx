import { waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';

import * as actions from '../../redux/auth/actions';
import { PartyRole } from '../../models/user';
import { render, axe } from '../../__test__/test-utils';
import VerifyUser from '../VerifyUser';

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    hash: '#selfCareToken=mocked-hash',
    state: '',
    key: '',
    pathname: '',
    search: '',
  }),
  useNavigate: () => mockNavigateFn,
}));

describe('VerifyUser Component', () => {
  beforeEach(() => {
    // useSelector mock
    const useSelectorSpy = jest.spyOn(redux, 'useSelector');
    useSelectorSpy.mockReturnValue('mocked-token').mockReturnValue(PartyRole.MANAGER);
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
    const { container } = render(<VerifyUser />);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith('mocked-hash');
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
