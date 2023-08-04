import { GetNewApiKeyResponse } from '../../../models/ApiKeys';
import { NewApiKey } from '../types';

export const newApiKeyForBE: NewApiKey = {
  name: 'mock-name',
  groups: ['mock-group'],
};

export const newApiKeyFromBE: GetNewApiKeyResponse = {
  id: 'mocked-api-key-id',
  apiKey: 'mocked-api-key',
};
