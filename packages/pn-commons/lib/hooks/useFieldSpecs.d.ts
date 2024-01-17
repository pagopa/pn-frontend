import { Column, Downtime, DowntimeLogPage, Row } from '../models';
export declare function useFieldSpecs(): {
    getField: (fieldId: keyof Downtime) => Omit<Column<Downtime>, 'width'>;
    getRows: (downtimeLog: DowntimeLogPage) => Array<Row<Downtime>>;
};
