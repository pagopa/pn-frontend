/* eslint-disable functional/no-let */
import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Suspense } from 'react';
import * as redux from 'react-redux';

/* eslint-disable import/order */
import { render, act, screen } from './test-utils';
import App from '../App';
import i18n from '../i18n';
import * as sidemenuActions from '../redux/sidemenu/actions';
import { PartyRole, PNRole } from '../redux/auth/types';

// mocko SessionGuard perché fa dispatch che fanno variare il totale di chiamate al dispatch;
// questo totale viene verificato in un test
jest.mock('../navigation/SessionGuard', () => () => <div>Session Guard</div>);
jest.mock('../navigation/ToSGuard', () => () => <div>ToS Guard</div>);

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
        organization: {
          id: 'mocked-id',
          name: 'mocked-organizzation',
          roles: [
            {
              partyRole: PartyRole.MANAGER,
              role: PNRole.ADMIN,
            },
          ],
        },
      },
      tos: true,
    },
    generalInfoState: {
      pendingDelegators: 0,
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
  let mockUseDispatchFn: jest.Mock;
  let mockSidemenuInformationActionFn: jest.Mock;
  let mockDomicileInfoActionFn: jest.Mock;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    axiosMock.onAny().reply(200);

    mockSidemenuInformationActionFn = jest.fn();
    mockDomicileInfoActionFn = jest.fn();
    mockUseDispatchFn = jest.fn(() => (action: any, state: any) => {
      console.log({ action, state });
    });

    // mock actions
    const getSidemenuInfoActionSpy = jest.spyOn(sidemenuActions, 'getSidemenuInformation');
    getSidemenuInfoActionSpy.mockImplementation(mockSidemenuInformationActionFn as any);
    const getDomicileInfoActionSpy = jest.spyOn(sidemenuActions, 'getDomicileInfo');
    getDomicileInfoActionSpy.mockImplementation(mockDomicileInfoActionFn as any);
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockUseDispatchFn as any);
  });

  afterEach(() => {
    axiosMock.reset();
    jest.restoreAllMocks();
  });

  /**
   * Tests che usano Component e inizializzazione "semplice" di i18n.
   */
  describe('tests che non analizzano dettagli (test solo di renderizzazione)', () => {
    beforeEach(() => {
      void i18n.init();
    });

    it('Renders SEND', () => {
      render(<Component />);
      const loading = screen.getByText(/loading.../i);
      expect(loading).toBeInTheDocument();
    });
  });

  /**
   * Tests che usano App e inizializzazione di i18n che include react.useSuspense = false.
   */
  describe('tests che analizzano dettagli di comportamento (mock alle chiamate)', () => {
    beforeEach(() => {
      void i18n.init({
        react: {
          useSuspense: false,
        },
      });
    });

    it('Dispatches proper actions when session token is not empty', async () => {
      await act(async () => void render(<App />, initialState('mocked-session-token')));
      expect(mockUseDispatchFn).toBeCalledTimes(3);
      expect(mockSidemenuInformationActionFn).toBeCalledTimes(1);
      expect(mockDomicileInfoActionFn).toBeCalledTimes(1);
    });
  });
});
