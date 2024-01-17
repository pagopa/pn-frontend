function errorMessageForAction(action) {
    return {
        id: 'toto',
        blocking: false,
        message: 'Errore',
        title: 'Errore',
        toNotify: true,
        action,
        alreadyShown: true,
    };
}
export const apiOutcomeTestHelper = {
    // costruisce un oggetto che rappresenta un errore di API legato a un'action specifica,
    // utile per simulare errori di API
    errorMessageForAction,
    // costruisce l'intero valore dello slice appState con un errore di API legato a un'action specifica,
    // utile per simulare errori di API
    appStateWithMessageForAction: (action) => ({
        loading: { result: false, tasks: {} },
        messages: { errors: [errorMessageForAction(action)], success: [] },
    }),
};
