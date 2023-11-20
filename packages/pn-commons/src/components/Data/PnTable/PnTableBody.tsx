import { Children, cloneElement, isValidElement } from 'react';

import { TableBody } from '@mui/material';

import PnTableBodyRow from './PnTableBodyRow';

type Props = {
  testId?: string;
  children: React.ReactNode;
};

const PnTableBody: React.FC<Props> = ({ testId, children }) => {
  const rows = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnTableBodyRow)
        .map((child) =>
          isValidElement(child)
            ? cloneElement(child, { ...child.props, testId: `${testId}.row` })
            : child
        )
    : [];

  if (rows.length === 0) {
    throw new Error('PnTableBody must have at least one child');
  }

  if (rows.length < Children.toArray(children).length) {
    throw new Error('PnTableBody must have only children of type PnTableBodyRow');
  }

  return (
    <TableBody sx={{ backgroundColor: 'background.paper' }} role="rowgroup" data-testid={testId}>
      {rows}
    </TableBody>
  );
};

export default PnTableBody;
