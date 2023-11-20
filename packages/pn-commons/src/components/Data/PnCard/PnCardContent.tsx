import { Children, cloneElement, isValidElement } from 'react';

import { Box, CardContent } from '@mui/material';

import PnCardContentItem from './PnCardContentItem';

type Props = {
  testId?: string;
  children: React.ReactNode;
};

const PnCardContent: React.FC<Props> = ({ testId, children }) => {
  const contentItems = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnCardContentItem)
        .map((child) =>
          isValidElement(child) ? (
            <Box sx={{ mb: 2 }} key={child.key}>
              {cloneElement(child, { ...child.props, testId: `${testId}.content` })}
            </Box>
          ) : (
            child
          )
        )
    : [];

  if (contentItems.length === 0) {
    throw new Error('PnCardContent must have at least one child');
  }
  if (contentItems.length < Children.toArray(children).length) {
    throw new Error('PnCardContent must have only children of type PnCardContentItem');
  }

  return (
    <CardContent data-testid={testId} sx={{ padding: 0, mt: 2, ':last-child': { padding: 0 } }}>
      {contentItems}
    </CardContent>
  );
};

export default PnCardContent;
