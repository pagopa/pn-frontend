import { Party } from '../../models/party';

export interface newDelegation {
  created: boolean;
  error: boolean;
  entities: Array<Party>;
}

export interface filterEntitiesBE {
  paNameFilter?: string;
}
