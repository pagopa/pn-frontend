import React from 'react';
import { Suspense } from 'react';

import i18n from '../i18n';
import App from '../App';
import { render, screen } from './test-utils';

// mock SessionGuard and ToSGuard
jest.mock('../navigation/SessionGuard', () => () => <div>Session Guard</div>);
// jest.mock('../navigation/ToSGuard', () => () => <div>ToS Guard</div>);

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

// TODO: set initial state
/*const initialState = () => ({
  preloadedState: {
  },
});
*/

describe('App', () => {
  
    /*
    beforeEach(() => {

    });
  
    afterEach(() => {

    });
    */
  
  
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
    });
  
  
    /**
     * Tests che usano App e inizializzazione di i18n che include react.useSuspense = false.
     */
    // TODO: completare test
    /*
    describe("tests che analizzano dettagli di comportamento (mock alle chiamate)", () => {
      beforeEach(() => {
        void i18n.init({
          react: { 
            useSuspense: false
          }
        });
      });
  
      it('Dispatches proper actions when session token is not empty', async () => {
        await act(async () => void render(<App />, initialState('mocked-session-token')));
      });
    });
    */
    
  });
