import { ApiKeyStatus, GetApiKeysResponse } from '../../../models/ApiKeys';

export const mockApiKeysFromBE: GetApiKeysResponse = {
  items: [
    {
      id: '9e522ef5-a024-4dbd-8a59-3e090c637659',
      name: 'Rimborso e multe',
      lastUpdate: '21/09/2022',
      groups: ['Gruppo1', 'Gruppo2', 'Gruppo3', 'Gruppo4', 'Gruppo5'],
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
      name: 'Cartelle esattoriali',
      lastUpdate: '22/09/2022',
      groups: ['Gruppo1', 'Gruppo2', 'Gruppo3'],
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
      name: 'Rimborsi',
      lastUpdate: '22/09/2022',
      groups: ['Gruppo1', 'Gruppo2', 'Gruppo3'],
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

export const mockApiKeysForFE = mockApiKeysFromBE.items.map((item) => ({
  ...item,
  apiKey: item.id,
}));
