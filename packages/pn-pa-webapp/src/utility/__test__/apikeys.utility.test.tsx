import { mockApiKeysDTO } from '../../__mocks__/ApiKeys.mock';
import { ApiKeyStatus } from '../../models/ApiKeys';
import { TooltipApiKey, getApiKeyStatusInfos } from '../apikeys.utility';

describe('test apikeys utilities', () => {
  it('getApiKeyStatusInfos', () => {
    const statusInfo = getApiKeyStatusInfos(
      ApiKeyStatus.ENABLED,
      mockApiKeysDTO.items[0].statusHistory
    );
    expect(statusInfo).toStrictEqual({
      color: 'success',
      label: 'status.enabled',
      description: 'status.enabled-description',
      tooltip: <TooltipApiKey history={mockApiKeysDTO.items[0].statusHistory} />,
    });
  });
});
