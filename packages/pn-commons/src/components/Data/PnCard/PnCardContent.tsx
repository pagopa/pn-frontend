import { Children, isValidElement } from 'react';

import { Box, CardContent, SxProps } from '@mui/material';

import { checkChildren } from '../../../utility/children.utility';
import PnCardContentItem from './PnCardContentItem';

type Props = {
  testId?: string;
  children: React.ReactNode;
  sx?: SxProps;
};

const PnCardContent: React.FC<Props> = ({ testId, children, sx }) => {
  // check on children
  checkChildren(children, [{ cmp: PnCardContentItem }], 'PnCardContent');

  return (
    <CardContent
      data-testid={testId}
      sx={{ padding: 0, mt: 2, ':last-child': { padding: 0 }, ...sx }}
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <Box sx={{ mb: 2 }} key={child.key}>
            {child}
          </Box>
        ) : (
          child
        )
      )}
    </CardContent>
  );
};

export default PnCardContent;
