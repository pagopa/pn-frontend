export interface ApiKey {
  name: string;
  apiKey: string;
  lastModify: string;
  groups: string;
  status: string;
}

export type ApiKeyColumn = 'name' | 'apiKey' | 'lastModify' | 'groups' | 'status';

export enum ApiKeyStatus {
  ENABLED = 'ENABLED',
  BLOCKED = 'BLOCKED',
  ROTATED = 'ROTATED',
}