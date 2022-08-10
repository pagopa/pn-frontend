/* eslint-disable functional/no-let */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import * as redux from 'react-redux';
import { axe, render } from './test-utils';
import App from '../App';
import i18n from '../i18n';
import * as sidemenuActions from '../redux/sidemenu/actions';
import * as authActions from '../redux/auth/actions';
// import { apiClient } from '../api/axios';

const Component = () => (
  <Suspense fallback="loading...">
    <App />
  </Suspense>
);

const initialState = (token: string) => ({
  preloadedState: {
    userState: {
      user: {
        fiscal_number: 'mocked-fiscal-number',
        name: 'mocked-name',
        family_name: 'mocked-family-name',
        email: 'mocked-user@mocked-domain.com',
        sessionToken: token,
      },
      fetchedTos: true,
      tos: true,
    },
    generalInfoState: {
      pendingDelegators: 0,
      delegators: [],
    },
  },
});

describe('App', () => {
  // let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  let mockSidemenuInformationActionFn: jest.Mock;
  let mockDomicileInfoActionFn: jest.Mock;
  let mockToSApprovalActionFn: jest.Mock;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    void i18n.init();

    axiosMock = new MockAdapter(axios);
    axiosMock.onAny().reply(200);

    mockSidemenuInformationActionFn = jest.fn();
    mockDomicileInfoActionFn = jest.fn();
    mockToSApprovalActionFn = jest.fn();
    mockDispatchFn = jest.fn();

    // mock actions
    const getSidemenuInfoActionSpy = jest.spyOn(sidemenuActions, 'getSidemenuInformation');
    getSidemenuInfoActionSpy.mockImplementation(mockSidemenuInformationActionFn as any);
    const getDomicileInfoActionSpy = jest.spyOn(sidemenuActions, 'getDomicileInfo');
    getDomicileInfoActionSpy.mockImplementation(mockDomicileInfoActionFn as any);
    const getToSApprovalActionSpy = jest.spyOn(authActions, 'getToSApproval');
    getToSApprovalActionSpy.mockImplementation(mockToSApprovalActionFn as any);
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
  });

  afterEach(() => {
    axiosMock.reset();
    jest.restoreAllMocks();
  });

  it('Renders Piattaforma notifiche', () => {
    render(<Component />);
    const loading = screen.getByText(/loading.../i);
    expect(loading).toBeInTheDocument();
  });

  it('Dispatches proper actions when session token is not empty', async () => {
    render(<Component />, initialState('mocked-session-token'));

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(3);
      expect(mockSidemenuInformationActionFn).toBeCalledTimes(1);
      expect(mockDomicileInfoActionFn).toBeCalledTimes(1);
      expect(mockToSApprovalActionFn).toBeCalledTimes(1);
    });
  });

  it('Test if automatic accessibility tests passes', async () => {
    const { container } = render(<Component />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
