import { Fragment } from 'react';

import { Box, Typography } from '@mui/material';

import { CardElement } from '../../../types';

type Props = {
  body: CardElement;
};

const ItemsCardContent: React.FC<Props> = ({ body, children }) => (
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
