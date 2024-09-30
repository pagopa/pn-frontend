import { ApiKeyStatus, PublicKeys, VirtualKeys } from '../models/ApiKeys';

export const publicKeys: PublicKeys = {
  items: [
    {
      kid: '92461124-9cc2-4608-a0d4-63a98b75c8f1',
      issuer: 'PG-d0f52c7d-76d5-4520-8971-edffeb5b46d5',
      name: 'public-key-1',
      value: 'string',
      createdAt: '2024-09-30T12:53:02.405Z',
      status: ApiKeyStatus.ROTATED,
      statusHistory: [
        {
          status: ApiKeyStatus.ROTATED,
          date: '2024-09-30T12:53:02.405Z',
          changedByDenomination: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
        },
      ],
    },
    {
      kid: '92461124-9cc2-4608-a0d4-63a98b75c8f1',
      issuer: 'PG-d0f52c7d-76d5-4520-8971-edffeb5b46d5',
      name: 'public-key-2',
      value: 'string',
      createdAt: '2024-09-30T12:53:02.405Z',
      status: ApiKeyStatus.BLOCKED,
      statusHistory: [
        {
          status: ApiKeyStatus.BLOCKED,
          date: '2024-09-30T12:53:02.405Z',
          changedByDenomination: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
        },
      ],
    },
  ],
  total: 2,
};

export const virtualKeys: VirtualKeys = {
  items: [
    {
      id: 'string',
      name: 'string',
      value: 'string',
      lastUpdate: '2024-09-30T13:15:03.178Z',
      user: {
        denomination: 'string',
        fiscalCode: 'string',
      },
      status: ApiKeyStatus.CREATED,
    },
    {
      id: 'string',
      name: 'string',
      value: 'string',
      lastUpdate: '2024-09-30T13:10:03.178Z',
      user: {
        denomination: 'string',
        fiscalCode: 'string',
      },
      status: ApiKeyStatus.ROTATED,
    },
  ],
  total: 2,
};
