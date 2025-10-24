import { TableCell, TableCellProps } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { buttonNakedInheritStyle } from '../../../utility/styles.utility';

export type PnTableBodyCellProps = {
  testId?: string;
  cellProps?: TableCellProps;
  onClick?: () => void;
  children: React.ReactNode;
};

const PnTableBodyCell: React.FC<PnTableBodyCellProps> = ({
  testId,
  cellProps,
  children,
  onClick,
}) => (
  <TableCell
    scope="col"
    data-testid={testId}
    {...cellProps}
    sx={{
      ...cellProps?.sx,
      borderBottom: 'none',
    }}
  >
    {onClick ? (
      <ButtonNaked onClick={onClick} sx={buttonNakedInheritStyle}>
        {children}
      </ButtonNaked>
    ) : (
      <>{children}</>
    )}
  </TableCell>
);
export default PnTableBodyCell;
