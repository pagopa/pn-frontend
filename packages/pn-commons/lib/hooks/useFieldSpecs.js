import { useCallback } from 'react';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
export function useFieldSpecs() {
    const getField = useCallback((fieldId) => {
        if (fieldId === 'startDate' || fieldId === 'endDate') {
            return {
                id: fieldId,
                label: getLocalizedOrDefaultLabel('appStatus', `downtimeList.columnHeader.${fieldId}`),
            };
        }
        if (fieldId === 'knownFunctionality') {
            return {
                id: 'knownFunctionality',
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
    const getRows = useCallback((downtimeLog) => downtimeLog.downtimes.map((n, i) => ({
        ...n,
        id: n.startDate + i.toString(),
    })), []);
    return {
        getField,
        getRows,
    };
}
