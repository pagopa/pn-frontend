/* eslint-disable functional/no-let */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { screen } from '@testing-library/react';
import { Suspense } from 'react';
import * as redux from 'react-redux';
import { axe, render } from './test-utils';
import App from '../App';
import i18n from '../i18n';
import * as sidemenuActions from '../redux/sidemenu/actions';
import * as authActions from '../redux/auth/actions';

/**
 * Componente che mette App all'interno di un Suspense, 
 * necessario per il test che fa solo un render, 
 * usato anche nel automatic accessibility test. 
 */
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


/**
 * Questo test suite si separa in due describe diversi, di tests che hanno una differenza
 * nella inizializzazione di i18n.
 * - per il test che analizza dettagli di comportamento serve settare react.useSuspense = false
 *   per evitare messaggi di ECONNREFUSED, cfr. PN-2038.
 *   Cfr. https://stackoverflow.com/questions/54432861/a-react-component-suspended-while-rendering-but-no-fallback-ui-was-specified .
 * - per i altri test, serve non passare nessun parametro. Se si fa lo stesso setting che per il
 *   caso precedente, appaiono messaggi "A future version of React will block javascript: URLs..."
 *   e "An update to ForwardRef inside a test was not wrapped in act(...)."
 * 
 * Lascio la inizializzazione comune nel describe principale.
 * ---------------------------------
 * Carlos, 2022.08.10
 */
describe('App', () => {
  // let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  let mockSidemenuInformationActionFn: jest.Mock;
  let mockDomicileInfoActionFn: jest.Mock;
  let mockToSApprovalActionFn: jest.Mock;
  let axiosMock: MockAdapter;

  beforeEach(() => {
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


  /**
   * Tests che usano Component e inizializzazione "semplice" di i18n.
   */
  describe("tests che non analizzano dettagli (test solo di accessibilità e renderizzazione)", () => {
    beforeEach(() => {
      void i18n.init();
    });

    it('Renders Piattaforma notifiche', () => {
      render(<Component />);
      const loading = screen.getByText(/loading.../i);
      expect(loading).toBeInTheDocument();
    });
  
    it('Test if automatic accessibility tests passes', async () => {
      const { container } = render(<Component />);
      const result = await axe(container);
      expect(result).toHaveNoViolations();
    });
    
  });


  /**
   * Tests che usano App e inizializzazione di i18n che include react.useSuspense = false.
   */
   describe("tests che analizzano dettagli di comportamento (mock alle chiamate)", () => {
    beforeEach(() => {
      void i18n.init({
        react: { 
          useSuspense: false
        }
      });
    });

    it('Dispatches proper actions when session token is not empty', async () => {
      render(<App />, initialState('mocked-session-token'));

      expect(mockDispatchFn).toBeCalledTimes(3);
      expect(mockSidemenuInformationActionFn).toBeCalledTimes(1);
      expect(mockDomicileInfoActionFn).toBeCalledTimes(1);
      expect(mockToSApprovalActionFn).toBeCalledTimes(1);
    });
  });
  
});
