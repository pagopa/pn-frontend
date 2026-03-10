import { mockApiKeysDTO } from '../../__mocks__/ApiKeys.mock';
import { ApiKeyStatus } from '../../models/ApiKeys';
import {
  TooltipApiKey,
  getApiKeyStatusHistoryLines,
  getApiKeyStatusInfos,
} from '../apikeys.utility';

describe('test apikeys utilities', () => {
  it('getApiKeyStatusInfos', () => {
    const t = (key: string) => key;

    const lines = getApiKeyStatusHistoryLines(t, mockApiKeysDTO.items[0].statusHistory);

    const statusInfo = getApiKeyStatusInfos(ApiKeyStatus.ENABLED, lines);

    expect(statusInfo).toStrictEqual({
      color: 'success',
      label: 'status.enabled',
      description: 'status.enabled-description',
      tooltip: <TooltipApiKey lines={lines} />,
    });
  });

  it('getApiKeyStatusHistoryLines', () => {
    const t = (key: string) => key;

    const history = [
      { status: ApiKeyStatus.CREATED, date: '2026-03-02T10:00:00.000Z' },
      { status: ApiKeyStatus.BLOCKED, date: '2026-03-04T10:00:00.000Z' },
    ];

    const lines = getApiKeyStatusHistoryLines(t, history as any);

    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('tooltip.created');
    expect(lines[1]).toContain('tooltip.blocked');
  });
});
