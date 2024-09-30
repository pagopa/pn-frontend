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

enum IssuerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type PublicKeyBaseParams = {
  kid: string;
  issuer: string;
};

export type VirtualKeyBaseParams = {
  id: string;
  virtualKey: string;
};

type ApiKeysResponseDetails = {
  lastKey: string;
  createdAt: string;
  total: number;
};

export type PublicKeys = {
  items: Array<PublicKey>;
} & ApiKeysResponseDetails;

export type VirtualKeys = {
  items: Array<VirtualKey>;
} & ApiKeysResponseDetails;

type PublicKey = {
  name: string;
  value: string;
  createdAt: string;
  status: ApiKeyStatus;
  statusHistory: Array<StatusHistoryApikey>;
} & PublicKeyBaseParams;

type VirtualKey = {
  id: string;
  name: string;
  value: string;
  lastUpdate: string;
  user: {
    denomination: string;
    fiscalCode: string;
  };
  status: ApiKeyStatus;
};

type StatusHistoryApikey = {
  status: ApiKeyStatus;
  date: string;
  changedByDenomination: string;
};

export type CheckIssuerStatus = {
  issuer: {
    isPresent: boolean;
    issuerStatus: IssuerStatus;
  };
  tosAccepted: boolean;
};

export type GetApiKeysParams = {
  limit?: number;
  lastkey?: string;
  createdAte?: string;
  showPublicKey?: boolean;
};

export type NewPublicApiKeyRequest = {
  name: string;
  publicKey: string;
  exponent: string;
  algorithm: ApiKeyAlgorithm;
};

export type UpdateApiKeyStatusRequest = {
  kid: string;
  status: ApiKeyActions;
};

export type RotateApiKeyRequest = {
  kid: string;
} & NewPublicApiKeyRequest;

export type NewVirtualApiKeyRequest = {
  name: string;
};
