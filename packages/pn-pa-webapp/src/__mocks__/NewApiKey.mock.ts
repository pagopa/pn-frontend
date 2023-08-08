import { NewApiKeyBE, GetNewApiKeyResponse } from '../models/ApiKeys';

export const newApiKeyDTO: NewApiKeyBE = {
  name: 'mock-name',
  groups: ['mock-group'],
};

export const newApiKeyResponse: GetNewApiKeyResponse = {
  id: 'mocked-api-key-id',
  apiKey: 'mocked-api-key',
};
