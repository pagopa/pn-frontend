enum ApiKeyStatus {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  ROTATED = 'ROTATED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

enum ApiKeyActions {
  BLOCK = 'BLOCK',
  ENABLE = 'ENABLE',
}

enum ApiKeyAlgorithm {
  RS256 = 'RS256',
}

export type PublicKeyBaseParams = {
  kid: string;
  issuer: string;
};

export type PublicKeys = {
  items: Array<PublicKey>;
  lastKey: string;
  createdAt: string;
  total: number;
};

type PublicKey = {
  name: string;
  value: string;
  createdAt: string;
  status: ApiKeyStatus;
  statusHistory: Array<StatusHistoryApikey>;
} & PublicKeyBaseParams;

type StatusHistoryApikey = {
  status: ApiKeyStatus;
  date: string;
  changedByDenomination: string;
};

export type GetPublicKeysParams = {
  limit?: number;
  lastkey?: string;
  createdAte?: string;
  showPublicKey?: boolean;
};

export type NewApiKeyRequest = {
  name: string;
  publicKey: string;
  exponent: string;
  algorithm: ApiKeyAlgorithm;
};

export type UpdateApiKeyStatusRequest = {
  kid: string;
  status: ApiKeyActions;
};
