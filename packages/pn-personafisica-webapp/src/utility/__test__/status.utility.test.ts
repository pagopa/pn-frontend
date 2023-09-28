import { DelegationStatus, getDelegationStatusKeyAndColor } from '../status.utility';

describe('Status utility test', () => {
  it('tests getDelegationStatusKeyAndColor', () => {
    // pending status
    let result = getDelegationStatusKeyAndColor('pending');
    expect(result).toStrictEqual({
      color: 'warning',
      key: `deleghe.table.${DelegationStatus.PENDING}`,
    });
    // active status
    result = getDelegationStatusKeyAndColor('active');
    expect(result).toStrictEqual({
      color: 'success',
      key: `deleghe.table.${DelegationStatus.ACTIVE}`,
    });
    // default status
    result = getDelegationStatusKeyAndColor('unknown' as 'pending' | 'active');
    expect(result).toStrictEqual({
      color: 'info',
      key: ``,
    });
  });
});
