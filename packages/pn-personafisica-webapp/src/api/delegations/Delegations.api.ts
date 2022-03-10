import { AxiosPromise } from 'axios';
import { authClient } from '../axios';
import { Delegation } from '../../redux/delegation/types';

export const DelegatesApi = {
   /*
   * Get all the delegation for the authenticated user
   * @returns Promise array of delegations
   */
    getDelegations : ():AxiosPromise<Array<Delegation>> => (
        authClient.get('/delegations')
    )

};