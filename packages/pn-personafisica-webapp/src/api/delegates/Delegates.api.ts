import { AxiosPromise } from 'axios';
import { authClient } from '../axios';
import { Delegation } from '../../redux/delegation/types';

export const DelegationsApi = {
  /**
   * Create a new delegate for the authenticated user
   * @param  {Delegation} delegation
   * @returns Promise
    createDelegate : (delegation: Delegation):Promise<any> => (
        authClient.post('/delegation', delegation)
    )
    */

  /**
   * Get all the delegates for the authenticated user
   * @returns Promise array of delegates
   */
  getDelegate: (): AxiosPromise<Array<Delegation>> => authClient.get('/delegates'),
};
