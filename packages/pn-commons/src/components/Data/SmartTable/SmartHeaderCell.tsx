import { PnTableHeaderCellProps } from '../PnTable/PnTableHeaderCell';

const SmartHeaderCell = <T,>({
  children,
}: Omit<PnTableHeaderCellProps<T>, 'handleClick' | 'sort'>) => <>{children}</>;

export default SmartHeaderCell;
