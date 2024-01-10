import { ApiKeyStatus, ApiKeys } from '../models/ApiKeys';
import { GroupStatus, UserGroup } from '../models/user';
import { apikeysMapper } from '../utility/apikeys.utility';

export const mockGroups: Array<UserGroup> = [
  {
    id: 'mock-id-1',
    name: 'mock-group-1',
    description: 'mock-description-1',
    status: GroupStatus.ACTIVE,
  },
  {
    id: 'mock-id-2',
    name: 'mock-group-2',
    description: 'mock-description-2',
    status: GroupStatus.ACTIVE,
  },
  {
    id: 'mock-id-3',
    name: 'mock-group-3',
    description: 'mock-description-3',
    status: GroupStatus.ACTIVE,
  },
  {
    id: 'mock-id-4',
    name: 'mock-group-4',
    description: 'mock-description-4',
    status: GroupStatus.ACTIVE,
  },
];

export const mockApiKeysDTO: ApiKeys<string> = {
  items: [
    {
      id: '9e522ef5-a024-4dbd-8a59-3e090c637659',
      value: '9e522ef5-a024-4dbd-8a59-3e090c637650',
      name: 'Rimborso e multe',
      lastUpdate: '21/09/2022',
      groups: ['mock-group-1', 'mock-group-2', 'mock-group-3', 'mock-group-4', 'mock-group-5'],
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
      groups: ['mock-group-2'],
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
      groups: ['mock-group-3'],
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

export const mockApiKeysForFE: ApiKeys<UserGroup> = {
  ...mockApiKeysDTO,
  items: apikeysMapper([...mockApiKeysDTO.items], mockGroups),
};
