import { SxProps, TableCell, Theme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { TableCellProps } from '../../../models/PnTable';
import { ValueMode } from '../../../models/SmartTable';
import { buttonNakedInheritStyle } from '../../../utility/styles.utility';

export type PnTableBodyCellProps = {
  testId?: string;
  mode?: ValueMode;
  cellProps?: TableCellProps;
  onClick?: () => void;
  children: React.ReactNode;
};

const strategies: Record<ValueMode, SxProps<Theme>> = {
  truncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  wrap: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
};

const PnTableBodyCell: React.FC<PnTableBodyCellProps> = ({
  testId,
  mode,
  cellProps,
  children,
  onClick,
}) => (
  <TableCell
    scope="col"
    data-testid={testId}
    {...cellProps}
    sx={{
      ...(mode && strategies[mode]),
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
