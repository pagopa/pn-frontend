import React from 'react';

import { Box } from '@mui/material';

export interface IItemsCardActionProps {
  testId?: string;
  handleOnClick?: () => void;
  children?: React.ReactNode;
}

const ItemsCardAction: React.FC<IItemsCardActionProps> = ({ testId, children, handleOnClick }) => (
  <Box onClick={() => handleOnClick && handleOnClick()} data-testid={testId} sx={{ ml: 'auto' }}>
    {children}
  </Box>
);
export default ItemsCardAction;
