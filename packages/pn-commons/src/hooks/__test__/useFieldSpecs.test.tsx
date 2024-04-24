import { beDowntimeHistoryThreeIncidents } from '../../__mocks__/AppStatus.mock';
import { initLocalizationForTest, renderHook } from '../../test-utils';
import { useFieldSpecs } from '../useFieldSpecs';

describe('useFieldSpecs', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('add id field to data', () => {
    const { result } = renderHook(() => useFieldSpecs());
    const data = result.current.getRows(beDowntimeHistoryThreeIncidents);
    expect(data).toStrictEqual(
      beDowntimeHistoryThreeIncidents.result.map((downtime, i) => ({
        ...downtime,
        id: downtime.startDate + i.toString(),
      }))
    );
  });

  it('get field startDate', () => {
    const { result } = renderHook(() => useFieldSpecs());
    const data = result.current.getField('startDate');
    expect(data).toStrictEqual({
      id: 'startDate',
      label: `appStatus - downtimeList.columnHeader.startDate`,
    });
  });

  it('get field endDate', () => {
    const { result } = renderHook(() => useFieldSpecs());
    const data = result.current.getField('endDate');
    expect(data).toStrictEqual({
      id: 'endDate',
      label: `appStatus - downtimeList.columnHeader.endDate`,
    });
  });

  it('get field functionality', () => {
    const { result } = renderHook(() => useFieldSpecs());
    const data = result.current.getField('functionality');
    expect(data).toStrictEqual({
      id: 'functionality',
      label: `appStatus - downtimeList.columnHeader.functionality`,
    });
  });

  it('get field legalFactId', () => {
    const { result } = renderHook(() => useFieldSpecs());
    const data = result.current.getField('legalFactId');
    expect(data).toStrictEqual({
      id: 'legalFactId',
      label: `appStatus - downtimeList.columnHeader.legalFactId`,
    });
  });

  it('get field status', () => {
    const { result } = renderHook(() => useFieldSpecs());
    const data = result.current.getField('status');
    expect(data).toStrictEqual({
      id: 'status',
      label: `appStatus - downtimeList.columnHeader.status`,
    });
  });
});
