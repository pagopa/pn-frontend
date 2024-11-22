import { vi } from 'vitest';

import { publicKeys } from '../../__mocks__/ApiKeys.mock';
import { PublicKeyStatus } from '../../generated-client/pg-apikeys';
import { TooltipApiKey, getApiKeyStatusInfos } from '../apikeys.utility';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('test apikeys utilities', () => {
  it('getApiKeyStatusInfos Active', () => {
    const statusInfo = getApiKeyStatusInfos(
      PublicKeyStatus.Active,
      publicKeys.items[0].statusHistory
    );
    expect(statusInfo).toStrictEqual({
      color: 'success',
      label: 'status.active',
      tooltip: <TooltipApiKey history={publicKeys.items[0].statusHistory!} />,
    });
  });

  it('getApiKeyStatusInfos Blocked', () => {
    const statusInfo = getApiKeyStatusInfos(
      PublicKeyStatus.Blocked,
      publicKeys.items[0].statusHistory
    );
    expect(statusInfo).toStrictEqual({
      color: 'default',
      label: 'status.blocked',
      tooltip: <TooltipApiKey history={publicKeys.items[0].statusHistory!} />,
    });
  });

  it('getApiKeyStatusInfos Rotated', () => {
    const statusInfo = getApiKeyStatusInfos(
      PublicKeyStatus.Rotated,
      publicKeys.items[0].statusHistory
    );
    expect(statusInfo).toStrictEqual({
      color: 'warning',
      label: 'status.rotated',
      tooltip: <TooltipApiKey history={publicKeys.items[0].statusHistory!} />,
    });
  });

  it('should not return tooltip if statusHistory is undefined (virtual key case)', () => {
    const statusInfo = getApiKeyStatusInfos(PublicKeyStatus.Active);
    expect(statusInfo).toStrictEqual({
      color: 'success',
      label: 'status.active',
      tooltip: undefined,
    });
  });
});
