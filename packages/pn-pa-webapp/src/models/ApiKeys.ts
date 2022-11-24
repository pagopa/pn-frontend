export interface ApiKey {
  id?: string;
  name: string;
  apiKey: string;
  lastUpdate: string;
  groups: Array<string>;
  status: string;
  statusHistory: Array<ApiKeyStatusHistory>;
}

export interface ApiKeyStatusHistory {
  status: ApiKeyStatus;
  changedByDenomination: string;
  date: string;
}

export type ApiKeyColumn = 'name' | 'apiKey' | 'lastUpdate' | 'groups' | 'status' | 'history';

export enum ApiKeySetStatus {
  BLOCK = 'BLOCK',
  ENABLE = 'ENABLE',
  ROTATE = 'ROTATE',
}

export enum ApiKeyStatus {
  CREATED = 'CREATED',
  ENABLED = 'ENABLED',
  BLOCKED = 'BLOCKED',
  ROTATED = 'ROTATED',
}

export enum modalApiKeyView {
  NONE = 'NONE',
  VIEW = 'VIEW',
  BLOCK = 'BLOCK',
  ENABLE = 'ENABLE',
  ROTATE = 'ROTATE',
  DELETE = 'DELETE',
}

export interface GetApiKeysResponse {
  items: Array<ApiKeyRow>;
}

export interface GetNewApiKeyResponse {
  id: string;
  "api-key": string;
}

interface ApiKeyRow {
  id: string;
  name: string;
  lastUpdate: string;
  groups: Array<string>;
  status: ApiKeyStatus;
  statusHistory: Array<ApiKeyStatusHistory>;
}
