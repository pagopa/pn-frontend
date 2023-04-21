import { ApiKey, ApiKeyStatus, GetApiKeysResponse } from '../../../models/ApiKeys';
import { GroupStatus, UserGroup } from '../../../models/user';

export const mockApiKeysForFE: Array<ApiKey> = [
  {
    id: '9e522ef5-a024-4dbd-8a59-3e090c637659',
    value: '9e522ef5-a024-4dbd-8a59-3e090c637650',
    name: 'Rimborso e multe',
    lastUpdate: '21/09/2022',
    groups: [
      {
        id: 'mock-id-1',
        name: 'mock-1',
        description: 'mock-description-1',
        status: GroupStatus.ACTIVE,
      },
      {
        id: 'mock-id-2',
        name: 'mock-2',
        description: 'mock-description-2',
        status: GroupStatus.ACTIVE,
      },
      {
        id: 'mock-id-3',
        name: 'mock-3',
        description: 'mock-description-3',
        status: GroupStatus.ACTIVE,
      },
      {
        id: 'mock-id-4',
        name: 'mock-4',
        description: 'mock-description-4',
        status: GroupStatus.ACTIVE,
      },
    ],
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
    groups: [
      {
        id: 'mock-id-2',
        name: 'mock-2',
        description: 'mock-description-2',
        status: GroupStatus.ACTIVE,
      },
    ],
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
    groups: [
      {
        id: 'mock-id-3',
        name: 'mock-3',
        description: 'mock-description-3',
        status: GroupStatus.ACTIVE,
      },
    ],
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
];

export const mockGroups: Array<UserGroup> = [
  {
    id: 'mock-id-1',
    name: 'mock-1',
    description: 'mock-description-1',
    status: GroupStatus.ACTIVE,
  },
  {
    id: 'mock-id-2',
    name: 'mock-2',
    description: 'mock-description-2',
    status: GroupStatus.ACTIVE,
  },
  {
    id: 'mock-id-3',
    name: 'mock-3',
    description: 'mock-description-3',
    status: GroupStatus.ACTIVE,
  },
  {
    id: 'mock-id-4',
    name: 'mock-4',
    description: 'mock-description-4',
    status: GroupStatus.ACTIVE,
  },
];
export const mockApiKeysFromBE: GetApiKeysResponse = {
  items: [
    {
      id: '9e522ef5-a024-4dbd-8a59-3e090c637659',
      value: '9e522ef5-a024-4dbd-8a59-3e090c637650',
      name: 'Rimborso e multe',
      lastUpdate: '21/09/2022',
      groups: ['mock-1', 'mock-2', 'mock-3', 'mock-4'],
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
      groups: ['mock-2'],
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
      groups: ['mock-3'],
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
};
