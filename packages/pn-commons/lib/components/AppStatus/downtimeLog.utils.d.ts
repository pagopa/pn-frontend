import { CardElement, Column, DowntimeLogPage, Item } from '../../models';
export declare function booleanStringToBoolean(booleanString: string): boolean;
export declare function adaptFieldSpecToMobile(desktopFieldSpec: Omit<Column<DowntimeLogColumn>, 'width'>): CardElement;
export type DowntimeLogColumn = 'startDate' | 'endDate' | 'functionality' | 'legalFactId' | 'status' | '';
export declare function useFieldSpecs({ getDowntimeLegalFactDocumentDetails, }: {
    getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
}): {
    getDateFieldSpec: (fieldId: DowntimeLogColumn, inTwoLines: boolean) => Omit<Column<DowntimeLogColumn>, 'width'>;
    getFunctionalityFieldSpec: () => Omit<Column<DowntimeLogColumn>, 'width'>;
    getLegalFactIdFieldSpec: () => Omit<Column<DowntimeLogColumn>, 'width'>;
    getStatusFieldSpec: () => Omit<Column<DowntimeLogColumn>, 'width'>;
    getRows: (downtimeLog: DowntimeLogPage) => Array<Item>;
};
