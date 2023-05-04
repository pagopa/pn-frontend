import { UserGroup } from "./user";

export interface ApiKeyDTO {
  id: string;
  name: string;
  value: string;
  lastUpdate: string;
  groups: Array<string>;
  status: ApiKeyStatus;
  statusHistory: Array<ApiKeyStatusHistory>;
}

export interface ApiKey {
  id: string;
  name: string;
  value: string;
  lastUpdate: string;
  groups: Array<UserGroup>;
  status: ApiKeyStatus;
  statusHistory: Array<ApiKeyStatusHistory>;
}

export interface ApiKeyStatusHistory {
  status: ApiKeyStatus;
  changedByDenomination: string;
  date: string;
}

export type ApiKeyColumn = 'name' | 'value' | 'lastUpdate' | 'groups' | 'status' | 'history' | 'contextMenu';

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

export enum ModalApiKeyView {
  NONE = 'NONE',
  VIEW = 'VIEW',
  BLOCK = 'BLOCK',
  ENABLE = 'ENABLE',
  ROTATE = 'ROTATE',
  DELETE = 'DELETE',
  VIEW_GROUPS_ID = 'VIEW_GROUPS_ID',
}

export interface GetApiKeysResponse {
  items: Array<ApiKeyDTO>;
}

export interface GetNewApiKeyResponse {
  id: string;
  apiKey: string;
}

export interface NewApiKeyBE {
  name: string;
  groups: Array<string>;
}

export interface ApiKeyStatusBE {
  apiKey: string;
  status: ApiKeySetStatus;
}