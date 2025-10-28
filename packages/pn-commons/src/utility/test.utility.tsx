import { IAppMessage } from '../models/AppMessage';

type AppState = {
  loading: { result: boolean; tasks: any };
  messages: { errors: Array<IAppMessage>; success: Array<IAppMessage> };
};

type ApiOutcomeTestHelperType = {
  errorMessageForAction: (action: string) => IAppMessage;
  appStateWithMessageForAction: (action: string) => AppState;
};

function errorMessageForAction(action: string): IAppMessage {
  return {
    id: 'toto',
    blocking: false,
    message: 'Errore',
    title: 'Errore',
    showTechnicalData: false,
    toNotify: true,
    action,
    alreadyShown: true,
  };
}

export const apiOutcomeTestHelper: ApiOutcomeTestHelperType = {
  // costruisce un oggetto che rappresenta un errore di API legato a un'action specifica,
  // utile per simulare errori di API
  errorMessageForAction,

  // costruisce l'intero valore dello slice appState con un errore di API legato a un'action specifica,
  // utile per simulare errori di API
  appStateWithMessageForAction: (action: string) => ({
    loading: { result: false, tasks: {} },
    messages: { errors: [errorMessageForAction(action)], success: [] },
  }),
};
