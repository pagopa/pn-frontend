import React from 'react';
import { ApiErrorGuardGeneral } from "../components/ApiError/ApiErrorGuard";

/**
 * Per testare un componente che usa ApiErrorGuard, penso che non serve moccare ApiErrorGuard al completo,
 * perché la logica di renderizzare sia il componente "normale" sia ApiError serve.
 * Penso che invece sia meglio moccare i componenti "normale" e di errore.
 * 
 * Perciò ho creato questa funzione mockApiErrorGuard, che riceve in parametro appunto questi componenti.
 * - Il componente "normale" l'ho lasciato come funzione, perché a seconda di quello che si vuol testare potrebbe
 *   essere diverso in ogni test. Definito come funzione, si esegue ad ogni volta che viene invocato il mock 
 *   di ApiErrorGuard. Se non viene passato, o la funzione ritorna undefined, allora si usa lo stesso
 *   componente "normale" del componente/page che si sta testando.
 * - Il componente di errore l'ho lasciato fisso, se non viene passato si usa <div>Api Error</div>
 */
 export function mockApiErrorGuard(
  mockNormalComponentFn?: () => (JSX.Element | undefined),
  mockApiErrorComponent?: JSX.Element,
) { 
  return ({ apiId, children }: { apiId: string, children: React.ReactNode }) => <ApiErrorGuardGeneral 
      apiId={apiId} 
      errorComponent={mockApiErrorComponent || <div>Api Error</div>} 
    >
      {(mockNormalComponentFn && mockNormalComponentFn()) || children } 
    </ApiErrorGuardGeneral>;
}
