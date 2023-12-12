import React from 'react';

import { mockApiKeysDTO, mockApiKeysForFE, mockGroups } from '../../__mocks__/ApiKeys.mock';
import { ApiKeyStatus } from '../../models/ApiKeys';
import { TooltipApiKey, apikeysMapper, getApiKeyStatusInfos } from '../apikeys.utility';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('test apikeys utilities', () => {
  it('getApiKeyStatusInfos', () => {
    const statusInfo = getApiKeyStatusInfos(
      ApiKeyStatus.ENABLED,
      mockApiKeysForFE.items[0].statusHistory
    );
    expect(statusInfo).toStrictEqual({
      color: 'success',
      label: 'status.enabled',
      description: 'status.enabled-description',
      tooltip: <TooltipApiKey history={mockApiKeysForFE.items[0].statusHistory} />,
    });
  });

  it('apikeysMapper', () => {
    const mappedApikeys = apikeysMapper(mockApiKeysDTO.items, mockGroups);
    expect(mappedApikeys).toStrictEqual(mockApiKeysForFE.items);
  });
});
