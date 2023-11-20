import { Children, cloneElement, isValidElement } from 'react';

import { TableHead, TableRow } from '@mui/material';

import PnTableHeaderCell from './PnTableHeaderCell';

type Props = {
  testId?: string;
  children: React.ReactNode;
};

const PnTableHeader: React.FC<Props> = ({ testId, children }) => {
  const columns = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnTableHeaderCell)
        .map((child) =>
          isValidElement(child)
            ? cloneElement(child, { ...child.props, testId: `${testId}.cell` })
            : child
        )
    : [];

  if (columns.length === 0) {
    throw new Error('PnTableHeader must have at least one child');
  }

  if (columns.length < Children.toArray(children).length) {
    throw new Error('PnTableHeader must have only children of type PnTableHeaderCell');
  }

  return (
    <TableHead role="rowgroup" data-testid={testId}>
      <TableRow role="row">{columns}</TableRow>
    </TableHead>
  );
};

export default PnTableHeader;
