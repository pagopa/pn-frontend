import {
  PublicKeyStatus,
  PublicKeyStatusHistory,
  VirtualKeyStatus,
} from '../generated-client/pg-apikeys';

export type GetApiKeysParams = {
  limit?: number;
  lastKey?: string;
  createdAt?: string;
  showPublicKey?: boolean;
};

export enum ModalApiKeyView {
  NONE = 'NONE',
  CREATE = 'CREATE',
  VIEW = 'VIEW',
  BLOCK = 'BLOCK',
  ROTATE = 'ROTATE',
  DELETE = 'DELETE',
}

export type ApiKeyColumnData = {
  name?: string;
  value?: string;
  date?: string;
  status?: PublicKeyStatus | VirtualKeyStatus;
  statusHistory?: Array<PublicKeyStatusHistory>;
  menu: string;
};
