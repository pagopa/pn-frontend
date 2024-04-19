import { ApiKeyStatus, ApiKeys, NewApiKeyRequest, NewApiKeyResponse } from '../models/ApiKeys';

export const mockGroups: Array<{ id: string; name: string }> = [
  {
    id: 'mock-id-1',
    name: 'mock-group-1',
  },
  {
    id: 'mock-id-2',
    name: 'mock-group-2',
  },
  {
    id: 'mock-id-3',
    name: 'mock-group-3',
  },
  {
    id: 'mock-id-4',
    name: 'mock-group-4',
  },
];

export const mockApiKeysDTO: ApiKeys = {
  items: [
    {
      id: '9e522ef5-a024-4dbd-8a59-3e090c637659',
      value: '9e522ef5-a024-4dbd-8a59-3e090c637650',
      name: 'Rimborso e multe',
      lastUpdate: '21/09/2022',
      groups: mockGroups,
      status: ApiKeyStatus.ENABLED,
      statusHistory: [
        {
          status: ApiKeyStatus.CREATED,
          date: '13/09/2022',
          changedByDenomination: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.BLOCKED,
          date: '13/09/2022',
          changedByDenomination: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.ENABLED,
          date: '13/09/2022',
          changedByDenomination: 'Maria Rossi',
        },
      ],
    },
    {
      id: '9e522ef5-a024-4dbd-8a59-3e090c637651',
      value: '9e522ef5-a024-4dbd-8a59-3e090c637652',
      name: 'Cartelle esattoriali',
      lastUpdate: '22/09/2022',
      groups: [mockGroups[1]],
      status: ApiKeyStatus.BLOCKED,
      statusHistory: [
        {
          status: ApiKeyStatus.CREATED,
          date: '13/09/2022',
          changedByDenomination: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.BLOCKED,
          date: '13/09/2022',
          changedByDenomination: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.ENABLED,
          date: '13/09/2022',
          changedByDenomination: 'Maria Rossi',
        },
      ],
    },
    {
      id: '9e522ef5-a024-4dbd-8a59-3e090c637653',
      value: '9e522ef5-a024-4dbd-8a59-3e090c637654',
      name: 'Rimborsi',
      lastUpdate: '22/09/2022',
      groups: [mockGroups[2]],
      status: ApiKeyStatus.ROTATED,
      statusHistory: [
        {
          status: ApiKeyStatus.CREATED,
          date: '13/09/2022',
          changedByDenomination: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.BLOCKED,
          date: '13/09/2022',
          changedByDenomination: 'Maria Rossi',
        },
        {
          status: ApiKeyStatus.ENABLED,
          date: '13/09/2022',
          changedByDenomination: 'Maria Rossi',
        },
      ],
    },
  ],
  total: 14,
  lastKey: '9e522ef5-a024-4dbd-8a59-3e090c637653',
  lastUpdate: '22/09/2022',
};

export const newApiKeyDTO: NewApiKeyRequest = {
  name: 'mock-name',
  groups: ['mock-id-1'],
};

export const newApiKeyResponse: NewApiKeyResponse = {
  id: 'mocked-api-key-id',
  apiKey: 'mocked-api-key',
};
