import React from 'react';
import { ApiErrorWrapperGeneral } from "../components/ApiError/ApiErrorWrapper";
import { IAppMessage } from '../types';

/**
 * Per testare un componente che usa ApiErrorWrapper, penso che non serve moccare ApiErrorWrapper al completo,
 * perché la logica di renderizzare sia il componente "normale" sia ApiError serve.
 * Penso che invece sia meglio moccare i componenti "normale" e di errore.
 * 
 * Perciò ho creato questa funzione mockApiErrorWrapper, che riceve in parametro appunto questi componenti.
 * - Il componente "normale" l'ho lasciato come funzione, perché a seconda di quello che si vuol testare potrebbe
 *   essere diverso in ogni test. Definito come funzione, si esegue ad ogni volta che viene invocato il mock 
 *   di ApiErrorWrapper. Se non viene passato, o la funzione ritorna undefined, allora si usa lo stesso
 *   componente "normale" del componente/page che si sta testando.
 * - Il componente di errore l'ho lasciato fisso, se non viene passato si usa <div>Api Error</div>
 */
export function mockApiErrorWrapper(
  mockNormalComponentFn?: () => (JSX.Element | undefined),
  mockApiErrorComponent?: JSX.Element,
) { 
  return ({ apiId, children }: { apiId: string, children: React.ReactNode }) => <ApiErrorWrapperGeneral 
      apiId={apiId} 
      errorComponent={mockApiErrorComponent || <div>Api Error</div>} 
    >
      {(mockNormalComponentFn && mockNormalComponentFn()) || children } 
    </ApiErrorWrapperGeneral>;
}

let mockComponent: JSX.Element | undefined;

/**
 * simpleMockForApiErrorWrapper è un mock per ApiErrorWrapper che permette, insieme al apiOutcomeTestHelper,
 * di scrivere in modo più semplice test sul comportamento basico di un componente 
 * a seconda del risultato (OK oppure errore)
 * di un'API che viene chiamata, dove questo risultato si controlla tramite ApiErrorWrapper.
 * 
 * È stata pensata per un schema con due tests, in uno si simula che l'API chiamata va in errore 
 * e si verifica che si fa vedere il componente di errore API, nell'altro test si simula che l'API
 * va a buon fine, e si verifica che si fa vedere il componente vero e proprio.
 * Per semplificare questa struttura di test, i componenti di errore e "vero e proprio" che sono passati 
 * ad ApiErrorWrapper sono moccati per semplici <div>.
 * 
 * Per implementare questo schema, si deve fare jest.mock di pn-commons, includendo questa impostazione
 *     ApiErrorWrapper: original.simpleMockForApiErrorWrapper,
 * 
 * Poi si definisce un describe separato (per avere before/after specifici) con questa struttura
 * 
    describe('<...componente...> - different contact API behaviors', () => {
      beforeEach(() => {
        apiOutcomeTestHelper.setStandardMock();
      });

      afterEach(() => {
        apiOutcomeTestHelper.clearMock();
        jest.restoreAllMocks();
      });

      it('API error', async () => {
        // ... simuliamo che la chiamata API va in errore
        await act(async () => void render(... il componente ...));
        apiOutcomeTestHelper.expectApiErrorComponent(screen);
      });

      it('API OK', async () => {
        // ... simuliamo che la chiamata API va a buon fine
        await act(async () => void render(... il componente ...));
        apiOutcomeTestHelper.expectApiOKComponent(screen);
      });
    });
 * 
 * La funzione apiOutcomeTestHelper.setStandardMock() setta il mock di "componente vero e proprio" 
 * con un <div> specifico, che dopo è verificato da apiOutcomeTestHelper.expectApiOKComponent.
 * Il mock per il componente di errore è già moccato da simpleMockForApiErrorWrapper con un valore
 * fisso, che questa volta è verificato da apiOutcomeTestHelper.expectApiErrorComponent.
 * 
 * L'oggetto apiOutcomeTestHelper include anche altre funzioni, che possono essere utili per 
 * la simulazione.
 * 
 * Per casi più complessi si può sempre usare mockApiErrorWrapper, definita qui sopra.
 * 
 * ----------------------------------------------------------------
 * NB: forse sarebbe bello includere una funzione (ad es. dentro apiOutcomeTestHelper)
 *     che faccia il jest.mock di pn-commons per moccare ApiErrorWrapper. 
 * Ma il jest.mock si deve fare assolutamente nel livello principale del file in cui
 * si vuole moccare una libreria, ho provato con più alternative, nessuna ha funzionato.
 * 
 * Carlos Lombardi, 2022.09.06
 */
export const simpleMockForApiErrorWrapper = mockApiErrorWrapper(() => mockComponent);

type AppState = {
  loading: { result: boolean, tasks: any };
  messages: { errors: IAppMessage[], success: IAppMessage[] }
};

type ApiOutcomeTestHelperType = {
  setStandardMock: () => void,
  clearMock: () => void,
  errorMessageForAction: (action: string) => IAppMessage;
  appStateWithMessageForAction: (action: string) => AppState;
  expectApiErrorComponent: (screen: any) => void,
  expectApiOKComponent: (screen: any) => void,
}

function errorMessageForAction(action: string): IAppMessage {
  return { id: "toto", blocking: false, message: "Errore", title: "Errore", toNotify: true, action, alreadyShown: true };
}

export const apiOutcomeTestHelper: ApiOutcomeTestHelperType = {
  // setta il mock del componente "vero e proprio" con un valore ben conosciuto
  setStandardMock: () => {
    mockComponent = <div>Ecco il componente</div>;
  },

  // pulisce il mock del componente "vero e proprio", in modo che il mock di ApiGuardError 
  // renderizza il vero componente in assenza di errori di API
  clearMock: () => {
    mockComponent = undefined;
  },

  // costruisce un oggetto che rappresenta un errore di API legato a un'action specifica,
  // utile per simulare errori di API
  errorMessageForAction,

  // costruisce l'intero valore dello slice appState con un errore di API legato a un'action specifica,
  // utile per simulare errori di API
  appStateWithMessageForAction: (action: string) => ({ 
    loading: {result: false, tasks: {}}, 
    messages: { errors: [errorMessageForAction(action)], success: [] }
  }),

  // verifica che si sia renderizzato il componente di errore e non quello "vero e proprio",
  // assumendo che sono stati moccati tramite simpleMockForApiErrorWrapper 
  // e apiOutcomeTestHelper.setStandardMock
  expectApiErrorComponent: (screen: any) => {
    const apiErrorComponent = screen.queryByText("Api Error");
    const notificheComponent = screen.queryByText("Ecco il componente");
    expect(apiErrorComponent).toBeTruthy();
    expect(notificheComponent).toEqual(null);
  },

  // verifica che si sia renderizzato il componente "vero e proprio" e non quello di errore,
  // assumendo che sono stati moccati tramite apiOutcomeTestHelper.setStandardMock
  // e simpleMockForApiErrorWrapper 
  expectApiOKComponent: (screen: any) => {
    const apiErrorComponent = screen.queryByText("Api Error");
    const notificheComponent = screen.queryByText("Ecco il componente");
    expect(apiErrorComponent).toEqual(null);
    expect(notificheComponent).toBeTruthy();
  },
}
