import { Children, ReactElement, isValidElement } from 'react';

import { Box, CardContent } from '@mui/material';

import PnCardContentItem from './PnCardContentItem';

type Props = {
  testId?: string;
  children: ReactElement | Array<ReactElement>;
};

const PnCardContent: React.FC<Props> = ({ testId, children }) => {
  // check on children
  // PnCardContent can have only children of type PnCardContentItem
  // the cast ReactElement | Array<ReactElement> of property children
  // ensures that the PnCardContent can have two defined children (not null and not undefined)
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }
    if (element.type !== PnCardContentItem) {
      throw new Error('PnCardContent must have only children of type PnCardContentItem');
    }
  });

  return (
    <CardContent data-testid={testId} sx={{ padding: 0, mt: 2, ':last-child': { padding: 0 } }}>
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
