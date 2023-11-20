import { Children, cloneElement, isValidElement } from 'react';

import { TableRow } from '@mui/material';

import PnTableBodyCell from './PnTableBodyCell';

interface Props {
  testId?: string;
  index: number;
  children: React.ReactNode;
}
const PnTableBodyRow: React.FC<Props> = ({ children, index, testId }) => {
  const columns = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnTableBodyCell)
        .map((child) =>
          isValidElement(child)
            ? cloneElement(child, { ...child.props, testId: `${testId}.cell` })
            : child
        )
    : [];

  if (columns.length === 0) {
    throw new Error('PnTableBodyRow must have at least one child');
  }

  if (columns.length < Children.toArray(children).length) {
    throw new Error('PnTableBodyRow must have only children of type PnTableBodyCell');
  }

  return (
    <TableRow id={testId} data-testid={testId} role="row" aria-rowindex={index + 1}>
      {columns}
    </TableRow>
  );
};

export default PnTableBodyRow;
