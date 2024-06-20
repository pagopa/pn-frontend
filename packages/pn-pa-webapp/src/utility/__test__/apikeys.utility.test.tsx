import { vi } from 'vitest';

import { mockApiKeysDTO } from '../../__mocks__/ApiKeys.mock';
import { ApiKeyStatus } from '../../models/ApiKeys';
import { TooltipApiKey, getApiKeyStatusInfos } from '../apikeys.utility';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

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
