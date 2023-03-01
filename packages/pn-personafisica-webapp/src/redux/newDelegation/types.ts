import { Party } from '../../models/party';

export interface newDelegation {
  created: boolean;
  error: boolean;
  entities: Array<Party>;
  blockLoading: boolean;
}

export interface filterEntitiesBE {
  paNameFilter?: string;
  blockLoading?: boolean;
}
