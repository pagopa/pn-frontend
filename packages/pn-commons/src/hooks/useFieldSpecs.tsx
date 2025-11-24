import { useCallback } from 'react';

import { Downtime, DowntimeLogHistory } from '../models/AppStatus';
import { Column, Row } from '../models/PnTable';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

export function useFieldSpecs() {
  const getField = useCallback((fieldId: keyof Downtime): Omit<Column<Downtime>, 'width'> => {
    if (fieldId === 'startDate' || fieldId === 'endDate') {
      return {
        id: fieldId,
        label: getLocalizedOrDefaultLabel('appStatus', `downtimeList.columnHeader.${fieldId}`),
      };
    }
    if (fieldId === 'functionality') {
      return {
        id: 'functionality',
        label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.functionality'),
      };
    }
    if (fieldId === 'legalFactId') {
      return {
        id: 'legalFactId',
        label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.legalFactId'),
      };
    }
    return {
      id: 'status',
      label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.status'),
    };
  }, []);

  const getRows = useCallback(
    (downtimeLog: DowntimeLogHistory): Array<Row<Downtime>> =>
      downtimeLog.result.map((n, i) => ({
        ...n,
        id: n.startDate + i.toString(),
      })),
    []
  );

  return {
    getField,
    getRows,
  };
}
