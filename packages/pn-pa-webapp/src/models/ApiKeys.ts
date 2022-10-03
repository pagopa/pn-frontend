export interface ApiKey {
  name: string;
  apiKey: string;
  lastModify: string;
  groups: Array<string>;
  status: string;
  statusHistory: Array<ApiKeyStatusHistory>;
}

export interface ApiKeyStatusHistory {
  status: ApiKeyStatus;
  by: string;
  date: string;
}

export type ApiKeyColumn = 'name' | 'apiKey' | 'lastModify' | 'groups' | 'status' | 'history';

export enum ApiKeyStatus {
  CREATED = 'CREATED',
  ENABLED = 'ENABLED',
  BLOCKED = 'BLOCKED',
  ROTATED = 'ROTATED',
}