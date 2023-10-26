import { Box, SxProps, TableCell } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { buttonNakedInheritStyle } from '../../../utility';

export interface IPnTableBodyCellProps {
  testId?: string;
  cellProps?: SxProps;
  onClick?: () => void;
  children?: React.ReactNode;
  disableAccessibility?: boolean;
}

const PnTableBodyCell: React.FC<IPnTableBodyCellProps> = ({
  testId = 'cell',
  cellProps,
  children,
  onClick,
  disableAccessibility,
}) => (
  <TableCell
    role="cell"
    data-testid={testId}
    sx={{
      ...cellProps!,
      borderBottom: 'none',
    }}
    onClick={onClick}
  >
    {onClick && (
      <>
        {/* Even there is a onClick function on the TableCell, leave ButtonNaked below as is.
            This makes spacebar key with accessibility to trigger the onClick function.
            The ButtonNaked "inherits" the onClick action from the outer TableCell, so that is not necessary to replicate it. */}
        <ButtonNaked
          data-testid={`${testId}.button`}
          tabIndex={disableAccessibility ? -1 : 0}
          sx={buttonNakedInheritStyle}
        >
          {children}
        </ButtonNaked>
      </>
    )}
    {!onClick && <Box tabIndex={disableAccessibility ? -1 : 0}>{children}</Box>}
  </TableCell>
);
export default PnTableBodyCell;
