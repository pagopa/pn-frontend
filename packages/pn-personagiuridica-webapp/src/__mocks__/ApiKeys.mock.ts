import {
  BffPublicKeysCheckIssuerResponse,
  BffPublicKeysResponse,
  BffVirtualKeysResponse,
  PublicKeyStatus,
  PublicKeysIssuerResponseIssuerStatusEnum,
  VirtualKeyStatus,
} from '../generated-client/pg-apikeys';

export const publicKeys: BffPublicKeysResponse = {
  items: [
    {
      kid: '92461124-9cc2-4608-a0d4-63a98b75c8f1',
      issuer: 'PG-d0f52c7d-76d5-4520-8971-edffeb5b46d5',
      name: 'public-key-1',
      value: 'string',
      createdAt: '2024-09-30T12:53:02.405Z',
      status: PublicKeyStatus.Rotated,
      statusHistory: [
        {
          status: PublicKeyStatus.Rotated,
          date: '2024-09-30T12:53:02.405Z',
          changedByDenomination: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
        },
      ],
    },
    {
      kid: '92461124-9cc2-4608-a0d4-63a98b75c8g2',
      issuer: 'PG-d0f52c7d-76d5-4520-8971-edffeb5b46d5',
      name: 'public-key-2',
      value: 'string',
      createdAt: '2024-09-30T12:53:02.405Z',
      status: PublicKeyStatus.Blocked,
      statusHistory: [
        {
          status: PublicKeyStatus.Blocked,
          date: '2024-09-30T12:53:02.405Z',
          changedByDenomination: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
        },
      ],
    },
    {
      kid: '92461124-9cc2-4608-a0d4-63a98b75c8f2',
      issuer: 'PG-d0f52c7d-76d5-4520-8971-edffeb5b46d5',
      name: 'public-key-3',
      value: 'string',
      createdAt: '2024-09-30T17:53:02.405Z',
      status: PublicKeyStatus.Active,
    },
  ],
  total: 3,
};

export const virtualKeysOfUser: BffVirtualKeysResponse = {
  items: [
    {
      id: 'key-3',
      name: 'string',
      value: 'string',
      lastUpdate: '2024-09-30T17:10:03.178Z',
      status: VirtualKeyStatus.Enabled,
    },
    {
      id: 'key-4',
      name: 'string',
      value: 'string',
      lastUpdate: '2024-09-30T17:10:03.178Z',
      status: VirtualKeyStatus.Rotated,
    },
    {
      id: 'key-5',
      name: 'string',
      value: 'string',
      lastUpdate: '2024-09-30T23:10:03.178Z',
      status: VirtualKeyStatus.Blocked,
    },
  ],
  total: 3,
};

export const virtualKeys: BffVirtualKeysResponse = {
  items: [
    {
      id: 'key-1',
      name: 'string',
      value: 'string',
      lastUpdate: '2024-09-30T13:10:03.178Z',
      user: {
        denomination: 'Luca Bianchi',
        fiscalCode: 'BNCLCU89E08H501A',
      },
      status: VirtualKeyStatus.Rotated,
    },
    {
      id: 'key-2',
      name: 'string',
      value: 'string',
      lastUpdate: '2024-09-30T17:10:03.178Z',
      user: {
        denomination: 'Sara Verdi',
        fiscalCode: 'VRDSRA05S47H505C',
      },
      status: VirtualKeyStatus.Blocked,
    },
    ...virtualKeysOfUser.items.map((key) => ({
      ...key,
      user: {
        denomination: 'Mario Rossi',
        fiscalCode: 'RSSMRA93E04H502V',
      },
    })),
  ],
  total: 2 + virtualKeysOfUser.total!,
};

export const checkIssuerPublicKey: BffPublicKeysCheckIssuerResponse = {
  tosAccepted: true,
  issuer: {
    isPresent: true,
    issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Inactive,
  },
};
