import { SxProps, TableCell } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { buttonNakedInheritStyle } from '../../../utility';

export type PnTableBodyCellProps = {
  testId?: string;
  cellProps?: SxProps;
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
    sx={{
      ...cellProps!,
      borderBottom: 'none',
    }}
  >
    {onClick ? <ButtonNaked sx={buttonNakedInheritStyle}>{children}</ButtonNaked> : <>{children}</>}
  </TableCell>
);
export default PnTableBodyCell;
