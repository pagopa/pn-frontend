import { ApiKeyStatus } from "../../../models/ApiKeys";

export const mockApiKeysForFE = [{
  name: 'Rimborso e multe',
  apiKey: '2389230894230842038423084230984346213876',
  lastModify: '21/09/2022',
  groups: [ 'Gruppo1', 'Gruppo2', 'Gruppo3', 'Gruppo4', 'Gruppo5' ],
  status: ApiKeyStatus.ENABLED,
  statusHistory: [
    {
      status: ApiKeyStatus.CREATED,
      date: '13/09/2022',
      by: 'Maria Rossi',
    },
    {
      status: ApiKeyStatus.BLOCKED,
      date: '13/09/2022',
      by: 'Maria Rossi',
    },
    {
      status: ApiKeyStatus.ENABLED,
      date: '13/09/2022',
      by: 'Maria Rossi',
    },
  ],
},
{
  name: 'Cartelle esattoriali',
  apiKey: '5607829357421908347846434762348625342374',
  lastModify: '22/09/2022',
  groups: [ 'Gruppo1', 'Gruppo2', 'Gruppo3' ],
  status: ApiKeyStatus.BLOCKED,
  statusHistory: [
    {
      status: ApiKeyStatus.CREATED,
      date: '13/09/2022',
      by: 'Maria Rossi',
    },
    {
      status: ApiKeyStatus.BLOCKED,
      date: '13/09/2022',
      by: 'Maria Rossi',
    },
    {
      status: ApiKeyStatus.ENABLED,
      date: '13/09/2022',
      by: 'Maria Rossi',
    },
  ],
},
{
  name: 'Rimborsi',
  apiKey: '9985683485954867234873452349257596875496',
  lastModify: '22/09/2022',
  groups: [ 'Gruppo1', 'Gruppo2', 'Gruppo3' ],
  status: ApiKeyStatus.ROTATED,
  statusHistory: [
    {
      status: ApiKeyStatus.CREATED,
      date: '13/09/2022',
      by: 'Maria Rossi',
    },
    {
      status: ApiKeyStatus.BLOCKED,
      date: '13/09/2022',
      by: 'Maria Rossi',
    },
    {
      status: ApiKeyStatus.ENABLED,
      date: '13/09/2022',
      by: 'Maria Rossi',
    },
  ],
}];