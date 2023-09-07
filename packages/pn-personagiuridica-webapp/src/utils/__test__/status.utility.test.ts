import { DelegationStatus, getDelegationStatusKeyAndColor } from '../status.utility';

describe('Status utility test', () => {
  it('tests getDelegationStatusKeyAndColor', () => {
    // pending status
    let result = getDelegationStatusKeyAndColor(DelegationStatus.PENDING);
    expect(result).toStrictEqual({
      color: 'warning',
      key: `deleghe.table.${DelegationStatus.PENDING}`,
    });
    // active status
    result = getDelegationStatusKeyAndColor(DelegationStatus.ACTIVE);
    expect(result).toStrictEqual({
      color: 'success',
      key: `deleghe.table.${DelegationStatus.ACTIVE}`,
    });
    // default status
    result = getDelegationStatusKeyAndColor(DelegationStatus.ACTIVE || DelegationStatus.PENDING);
    expect(result).toStrictEqual({
      color: 'success',
      key: `deleghe.table.active`,
    });
  });
});
