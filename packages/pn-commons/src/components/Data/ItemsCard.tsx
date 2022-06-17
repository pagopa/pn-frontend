import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  SxProps,
  Typography,
} from '@mui/material';
import { Fragment } from 'react';

import { CardElement, CardAction } from '../../types/ItemsCard';
import { Item } from '../../types/ItemsTable';

type Props = {
  /* Card header elements */
  cardHeader: [CardElement, CardElement];
  /* Card body elements */
  cardBody: Array<CardElement>;
  /* Card data */
  cardData: Array<Item>;
  /* Card actions */
  cardActions?: Array<CardAction>;
  /** Custom style */
  sx?: SxProps;
};

const ItemsCard = ({ cardHeader, cardBody, cardData, cardActions, sx }: Props) => {
  const cardHeaderTitle = (item: Item) => (
    <Grid container spacing={2} direction="row" alignItems="center">
      <Grid item xs={5} sx={{ fontSize: '14px', fontWeight: 400 }} data-testid="cardHeaderLeft">
        {cardHeader[0].getLabel(item[cardHeader[0].id], item)}
      </Grid>
      <Grid
        item
        xs={7}
        sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right' }}
        data-testid="cardHeaderRight"
      >
        {cardHeader[1].getLabel(item[cardHeader[1].id], item)}
      </Grid>
    </Grid>
  );

  return (
    <Box sx={sx}>
      {cardData.map((data) => (
        <Card
          key={data.id}
          raised
          data-testid="itemCard"
          sx={{
            marginBottom: '16px',
            padding: '24px',
          }}
        >
          <CardHeader title={cardHeaderTitle(data)} className="card-header" />
          <CardContent sx={{ padding: 0, marginTop: '16px', ':last-child': { padding: 0 } }}>
            {cardBody.map((body) => (
              <Box key={body.id} sx={{ marginBottom: '16px' }}>
                {(!body.hideIfEmpty || (body.hideIfEmpty && body.getLabel(data[body.id]))) && (
                  <Fragment>
                    <Typography variant="caption-semibold" data-testid="cardBodyLabel">
                      {body.label}
                    </Typography>
                    {!body.notWrappedInTypography && (
                      <Typography variant="body2" data-testid="cardBodyValue">
                        {body.getLabel(data[body.id])}
                      </Typography>
                    )}
                    {body.notWrappedInTypography && body.getLabel(data[body.id])}
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
                  sx={{ marginLeft: 'auto' }}
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
