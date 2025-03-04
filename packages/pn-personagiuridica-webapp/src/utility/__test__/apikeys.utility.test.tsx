import { formatDate } from '@pagopa-pn/pn-commons';

import { publicKeys } from '../../__mocks__/ApiKeys.mock';
import { render } from '../../__test__/test-utils';
import { PublicKeyStatus, PublicKeyStatusHistory } from '../../generated-client/pg-apikeys';
import { TooltipApiKey, getApiKeyStatusInfos } from '../apikeys.utility';

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

  it('render TooltipApiKey', () => {
    const history: Array<PublicKeyStatusHistory> = [
      {
        status: PublicKeyStatus.Blocked,
        date: '2024-09-30T17:00:00.00Z',
        changedByDenomination: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
      },
      {
        status: PublicKeyStatus.Rotated,
        date: '2024-09-30T12:00:00.000Z',
        changedByDenomination: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
      },
      {
        status: PublicKeyStatus.Active,
        date: '2024-09-30T11:00:00.000Z',
        changedByDenomination: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
      },
      {
        status: PublicKeyStatus.Created,
        date: '2024-09-30T09:00:00.000Z',
        changedByDenomination: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
      },
    ];
    const { container } = render(<TooltipApiKey history={history} />);

    for (const h of history) {
      expect(container).toHaveTextContent(
        `tooltip.${h.status !== PublicKeyStatus.Active ? h.status?.toLowerCase() : 'enabled'}-in`
      );
      expect(container).toHaveTextContent(h.date ? formatDate(h.date) : '');
    }
  });
});
