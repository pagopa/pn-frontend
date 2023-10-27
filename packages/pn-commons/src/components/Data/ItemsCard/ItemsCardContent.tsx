import React, { Fragment } from 'react';

import { Box, Typography } from '@mui/material';

import { CardElement } from '../../../models';

export interface IItemsCardContentProps {
  body: CardElement;
  children: React.ReactNode;
}

const ItemsCardContent: React.FC<IItemsCardContentProps> = ({ body, children }) => (
  <Box sx={{ mb: 2 }}>
    {(!body.hideIfEmpty || (body.hideIfEmpty && children)) && (
      <Fragment>
        <Typography sx={{ fontWeight: 'bold' }} variant="caption" data-testid="cardBodyLabel">
          {body.label}
        </Typography>
        {!body.notWrappedInTypography && (
          <Typography variant="body2" data-testid="cardBodyValue">
            {children}
          </Typography>
        )}
        {body.notWrappedInTypography && <div data-testid="cardBodyValue">{children}</div>}
      </Fragment>
    )}
  </Box>
);

export default ItemsCardContent;
