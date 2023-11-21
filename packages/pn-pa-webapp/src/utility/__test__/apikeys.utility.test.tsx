import { mockApiKeysDTO, mockApiKeysForFE, mockGroups } from '../../__mocks__/ApiKeys.mock';
import { ApiKeyStatus } from '../../models/ApiKeys';
import { TooltipApiKey, apikeysMapper, getApiKeyStatusInfos } from '../apikeys.utility';

const fakeTranslationFunction = (str: string) => str;

describe('test apikeys utilities', () => {
  it('getApiKeyStatusInfos', () => {
    const statusInfo = getApiKeyStatusInfos(
      ApiKeyStatus.ENABLED,
      mockApiKeysForFE.items[0].statusHistory,
      fakeTranslationFunction
    );
    expect(statusInfo).toStrictEqual({
      color: 'success',
      label: 'status.enabled',
      description: 'status.enabled-description',
      tooltip: TooltipApiKey(mockApiKeysForFE.items[0].statusHistory, fakeTranslationFunction),
    });
  });

  it('apikeysMapper', () => {
    const mappedApikeys = apikeysMapper(mockApiKeysDTO.items, mockGroups);
    expect(mappedApikeys).toStrictEqual(mockApiKeysForFE.items);
  });
});
