import { PublicKeyRow } from '../generated-client/pg-apikeys';

export type GetApiKeysParams = {
  limit?: number;
  lastKey?: string;
  createdAt?: string;
  showPublicKey?: boolean;
};

export enum ModalApiKeyView {
  NONE = 'NONE',
  VIEW = 'VIEW',
  BLOCK = 'BLOCK',
  ROTATE = 'ROTATE',
  DELETE = 'DELETE',
}

export type PublicKeysColumnData = PublicKeyRow & { menu: string };
