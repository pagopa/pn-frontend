import { ReactChild, ReactFragment } from 'react';

import { Box, SxProps, TableCell } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { buttonNakedInheritStyle } from '../../../utility';

export type PnTableBodyCellProps = {
  testId?: string;
  cellProps?: SxProps;
  onClick?: () => void;
  children: ReactChild | ReactFragment;
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
    onClick={onClick}
  >
    {onClick && (
      <>
        {/* Even there is a onClick function on the TableCell, leave ButtonNaked below as is.
            This makes spacebar key with accessibility to trigger the onClick function.
            The ButtonNaked "inherits" the onClick action from the outer TableCell, so that is not necessary to replicate it. */}
        <ButtonNaked sx={buttonNakedInheritStyle}>{children}</ButtonNaked>
      </>
    )}
    {!onClick && <Box>{children}</Box>}
  </TableCell>
);
export default PnTableBodyCell;
