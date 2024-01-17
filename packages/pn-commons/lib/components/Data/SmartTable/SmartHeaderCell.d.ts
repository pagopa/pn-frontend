/// <reference types="react" />
import { PnTableHeaderCellProps } from '../PnTable/PnTableHeaderCell';
declare const SmartHeaderCell: <T>({ children, }: Omit<PnTableHeaderCellProps<T>, "sort" | "handleClick">) => JSX.Element;
export default SmartHeaderCell;
