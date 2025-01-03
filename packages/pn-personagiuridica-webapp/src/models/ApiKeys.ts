import {
  PublicKeyStatus,
  PublicKeyStatusHistory,
  UserDto,
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
  user?: UserDto;
  menu: string;
};

export const ExtendedVirtualKeyStatus = { ...VirtualKeyStatus, Disabled: 'DISABLED' } as const;
export type ExtendedVirtualKeyStatus =
  (typeof ExtendedVirtualKeyStatus)[keyof typeof ExtendedVirtualKeyStatus];
