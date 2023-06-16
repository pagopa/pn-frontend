import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  GridProps,
  SxProps,
  Typography,
} from '@mui/material';
import { Fragment } from 'react';

import { CardElement, CardAction, Item } from '../../types';

type Props = {
  /* Card header elements */
  cardHeader: [CardElement, CardElement | null];
  /* Card body elements */
  cardBody: Array<CardElement>;
  /* Card data */
  cardData: Array<Item>;
  /* Card actions */
  cardActions?: Array<CardAction>;
  /** Custom style */
  sx?: SxProps;
  /** Custom header grid props */
  headerGridProps?: GridProps;
};

const cardStyle = {
  '& .card-header': {
    padding: 0,
  },
  '& .card-actions': {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
};

const ItemsCard = ({ cardHeader, cardBody, cardData, cardActions, sx, headerGridProps }: Props) => {
  const cardHeaderTitle = (item: Item) => (
    <Grid container spacing={2} direction="row" alignItems="center" {...headerGridProps}>
      <Grid
        item
        sx={{ fontSize: '14px', fontWeight: 400 }}
        data-testid="cardHeaderLeft"
        {...cardHeader[0].gridProps}
      >
        {cardHeader[0].getLabel(item[cardHeader[0].id], item)}
      </Grid>
      {cardHeader[1] && (
        <Grid
          item
          sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right' }}
          data-testid="cardHeaderRight"
          {...cardHeader[1].gridProps}
        >
          {cardHeader[1].getLabel(item[cardHeader[1].id], item)}
        </Grid>
      )}
    </Grid>
  );

  return (
    <Box sx={{ ...cardStyle, ...sx }}>
      {cardData.map((data) => (
        <Card
          key={data.id}
          raised
          data-testid="itemCard"
          sx={{
            mb: 2,
            p: 3,
          }}
        >
          <CardHeader title={cardHeaderTitle(data)} className="card-header" />
          <CardContent sx={{ padding: 0, mt: 2, ':last-child': { padding: 0 } }}>
            {cardBody.map((body) => (
              <Box key={body.id} sx={{ mb: 2 }}>
                {(!body.hideIfEmpty ||
                  (body.hideIfEmpty && body.getLabel(data[body.id], data))) && (
                  <Fragment>
                    <Typography
                      sx={{ fontWeight: 'bold' }}
                      variant="caption"
                      data-testid="cardBodyLabel"
                    >
                      {body.label}
                    </Typography>
                    {!body.notWrappedInTypography && (
                      <Typography variant="body2" data-testid="cardBodyValue">
                        {body.getLabel(data[body.id], data)}
                      </Typography>
                    )}
                    {body.notWrappedInTypography && (
                      <div data-testid="cardBodyValue">{body.getLabel(data[body.id], data)}</div>
                    )}
                  </Fragment>
                )}
              </Box>
            ))}
          </CardContent>
          <CardActions disableSpacing className="card-actions">
            {cardActions &&
              cardActions.map((action) => (
                <Box
                  key={action.id}
                  onClick={() => action.onClick(data)}
                  data-testid="cardAction"
                  sx={{ ml: 'auto' }}
                >
                  {action.component}
                </Box>
              ))}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default ItemsCard;
