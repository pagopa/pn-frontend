import { FC, ReactNode, useRef, useState } from 'react';

import { Box, SxProps, TableCell, Theme } from '@mui/material';
import { MITooltip } from '@pagopa/mui-italia';

import { TableCellProps } from '../../../models/PnTable';
import { ValueMode } from '../../../models/SmartTable';

export type PnTableBodyCellProps = {
  testId?: string;
  mode?: ValueMode;
  cellProps?: TableCellProps;
  children: ReactNode;
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

const PnTableBodyCell: FC<PnTableBodyCellProps> = ({ testId, mode, cellProps, children }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const valueRef = useRef<HTMLSpanElement>(null);

  const checkOverflow = () => {
    const el = valueRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setIsTruncated(hasOverflow);
      return;
    }
    setIsTruncated(false);
  };

  return (
    <TableCell
      scope="col"
      data-testid={testId}
      {...cellProps}
      sx={{
        borderBottom: 'none',
      }}
    >
      <MITooltip title={children} disabled={!isTruncated}>
        <Box
          ref={valueRef}
          onMouseEnter={checkOverflow}
          onTouchStart={checkOverflow}
          tabIndex={isTruncated ? 0 : undefined}
          sx={{ ...(mode && strategies[mode]) }}
        >
          {children}
        </Box>
      </MITooltip>
    </TableCell>
  );
};

export default PnTableBodyCell;
