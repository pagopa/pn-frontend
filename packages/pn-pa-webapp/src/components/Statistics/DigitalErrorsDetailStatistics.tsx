/* eslint-disable functional/immutable-data */
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { PnEChartsProps } from '@pagopa-pn/pn-data-viz';

import {
  DigitaErrorTypes,
  GraphColors,
  IDigitalErrorsDetailStatistics,
} from '../../models/Statistics';
import AggregateStatistics, { AggregateDataItem } from './AggregateStatistics';
import EmptyStatistics from './EmptyStatistics';

type Props = {
  data: IDigitalErrorsDetailStatistics;
};

interface AggregateErrorDetailDataItem extends AggregateDataItem {
  description: string;
  color: string;
}

const DigitalErrorsDetailStatistics: React.FC<Props> = ({ data: sData }) => {
  const { t } = useTranslation(['statistics']);

  const delivery_errors = sData[DigitaErrorTypes.DELIVERY_ERROR].count;
  const pec_errors = sData[DigitaErrorTypes.INVALID_PEC].count;
  const rejected_errors = sData[DigitaErrorTypes.REJECTED].count;

  const delivery_title = t('digital_errors_detail.delivery_title');
  const delivery_description = t('digital_errors_detail.delivery_description');
  const pec_title = t('digital_errors_detail.pec_title');
  const pec_description = t('digital_errors_detail.pec_description');
  const rejected_title = t('digital_errors_detail.rejected_title');
  const rejected_description = t('digital_errors_detail.rejected_description');

  const data: Array<AggregateErrorDetailDataItem> = [
    {
      title: delivery_title,
      description: delivery_description,
      value: delivery_errors,
      color: GraphColors.lightRed,
    },
    {
      title: pec_title,
      description: pec_description,
      value: pec_errors,
      color: GraphColors.darkRed,
    },
    {
      title: rejected_title,
      description: rejected_description,
      value: rejected_errors,
      color: GraphColors.pink,
    },
  ];

  const isEmpty = !data.find((item) => item.value > 0);

  const aggregateData = [data[0], data[2], data[1]];

  const color = [GraphColors.lightRed, GraphColors.pink, GraphColors.darkRed];

  const options: PnEChartsProps['option'] = {
    color,
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
      <Grid container direction={{ lg: 'row', xs: 'column' }} spacing={3}>
        <Grid item lg={5} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
          <Typography variant="h6" component="h3">
            {t('digital_errors_detail.title')}
          </Typography>
          <Typography sx={{ my: 3 }} variant="body1" color="text.primary">
            {t('digital_errors_detail.description')}
          </Typography>
          <List>
            {data.map((item) => {
              const title = item.title;
              const description = item.description;
              const color = item.color;
              const avatarSx = {
                bgcolor: color,
                width: 10,
                height: 10,
              };
              return (
                <ListItem key={title}>
                  <ListItemAvatar sx={{ minWidth: 18 }}>
                    <Avatar sx={avatarSx}>&nbsp;</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={title} secondary={description} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
          {isEmpty ? (
            <EmptyStatistics description="empty.component_description" />
          ) : (
            <AggregateStatistics
              values={aggregateData}
              options={options}
              startAngle={180}
              endAngle={-180}
              radius={['30%', '90%']}
              center={['50%', '50%']}
              legend={false}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DigitalErrorsDetailStatistics;
