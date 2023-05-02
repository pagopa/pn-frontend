import { ApiKeyStatus, ApiKeyStatusHistory } from '../../models/ApiKeys';
import { TooltipApiKey, apikeysMapper, getApiKeyStatusInfos } from '../apikeys.utility';
import { mockGroups, mockApiKeysForFE, mockApiKeysFromBE } from '../../redux/apiKeys/__test__/test-utils';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));


describe('test apikeys utilities', () => {
  const statusHistory: Array<ApiKeyStatusHistory> = [
    {
      status: ApiKeyStatus.CREATED,
      changedByDenomination: 'mocked-denomination-1',
      date: 'mocked-date-1',
    },
    {
      status: ApiKeyStatus.BLOCKED,
      changedByDenomination: 'mocked-denomination-2',
      date: 'mocked-date-2',
    },
    {
      status: ApiKeyStatus.ENABLED,
      changedByDenomination: 'mocked-denomination-3',
      date: 'mocked-date-3',
    },
  ];

  it('test getApiKeyStatusInfos', () => {
    const statusInfo = getApiKeyStatusInfos(ApiKeyStatus.ENABLED, statusHistory);
    expect(statusInfo).toStrictEqual({
      color: 'success',
      label: 'status.enabled',
      description: 'status.enabled-description',
      tooltip: TooltipApiKey(statusHistory),
    })
  });

  it('test apikeysMapper', () => {
    const mappedApikeys = apikeysMapper(mockApiKeysFromBE.items, mockGroups);
    expect(mappedApikeys).toStrictEqual(mockApiKeysForFE);
  });
});