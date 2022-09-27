import { AnyAsyncThunk, RejectedWithValueActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers';

/**
 * Implementa un ThunkAction (cioè la funzione che dev'essere passata a createAsyncThunk)
 * che in caso di errore lancia l'action .rejected.
 * Si aspetta come parametro l'azione che deve eseguire (che tipicamente coinvolge chiamate API).
 * 
 * Ecco un caso semplice (ma non triviale)
 * 
  export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
    'getDomicileInfo',
    performThunkAction(async () => (await ContactsApi.getDigitalAddresses()).legal)
  );
 * 
 * L'utilizzo di performThunkAction evita la necessità di fare il solito try/catch nella definizione della ThunkAction
 * 
  export const getDomicileInfo = createAsyncThunk<Array<DigitalAddress>>(
    'getDomicileInfo',
    async (_, { rejectWithValue }) => {
      try {
        return (await ContactsApi.getDigitalAddresses()).legal
      } catch (e) {
        return rejectWithValue(e);
      }
    }
  );

 * Ovviamente questo serve *soltanto* se l'azione nel catch non fa altro che chiamare rejectWithValue,
 * in qualsiasi altro caso si deve implementare il try/catch nell'action specifica.
 * 
 * D'altro canto, la funzione che si passa verso performThunkAction può avere parametri, e può realizzare azione più complesse
 * che chiamare un'API senza parametri, o con i parametri che vengono passati. Un esempio

  export const acceptDelegation = createAsyncThunk<
    AcceptDelegationResponse,
    { id: string; code: string }
  >('acceptDelegation', 
    performThunkAction(async ({id, code}: { id: string; code: string }) => {
      const data = {
        verificationCode: code,
      };
      return await DelegationsApi.acceptDelegation(id, data);
    })
  );

 * ----------------------------------------------------------------------------------------
 * ATTENZIONE!!
 * Anche se l'azione è semplice, non si deve tralasciare l'arrow function. 
 * Ad es., in un caso come questo
 * 
  export const getReceivedNotifications = createAsyncThunk<
    GetNotificationsResponse,
    GetNotificationsParams
  >(DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS, 
    performThunkAction((params) => NotificationsApi.getReceivedNotifications(params))   // OK
  );
 * 
 * non si deve semplificare come di seguito
 * 
  export const getReceivedNotifications = createAsyncThunk<
    GetNotificationsResponse,
    GetNotificationsParams
  >(DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS, 
    performThunkAction(NotificationsApi.getReceivedNotifications)         // da evitare assolutamente
  );
 * 
 * Infatti la versione semplificata è perfettamente funzionante, 
 * *ma* se un un test si vuole moccare NotificationsApi.getReceivedNotifications, il mock di jest.spyOn
 * non si applica se getReceivedNotifications viene utilizzata in questo modo.
 * Un po' frustrante a mio avviso, ma è proprio così.
 *
 */
export function performThunkAction<T, U>(action: (params: T) => Promise<U> ) {
  return async (_params: T, { rejectWithValue }: { rejectWithValue: RejectedWithValueActionFromAsyncThunk<AnyAsyncThunk>}) => {
    try {
      return await action(_params);
    } catch (e) {
      return rejectWithValue(e);
    }
  };
}
