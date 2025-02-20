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
  const virus_detected_errors = sData[DigitaErrorTypes.VIRUS_DETECTED].count;
  const server_pec_comunication_errors = sData[DigitaErrorTypes.SERVER_PEC_COMUNICATION].count;
  const sending_pec_errors = sData[DigitaErrorTypes.SENDING_PEC].count;
  const malformed_pec_address_errors = sData[DigitaErrorTypes.MALFORMED_PEC_ADDRESS].count;

  const data: Array<AggregateErrorDetailDataItem> = [
    {
      title: t('digital_errors_detail.delivery_title'),
      description: t('digital_errors_detail.delivery_description'),
      value: delivery_errors,
      color: GraphColors.lightRed,
    },
    {
      title: t('digital_errors_detail.pec_title'),
      description: t('digital_errors_detail.pec_description'),
      value: pec_errors,
      color: GraphColors.darkRed,
    },
    {
      title: t('digital_errors_detail.rejected_title'),
      description: t('digital_errors_detail.rejected_description'),
      value: rejected_errors,
      color: GraphColors.pink,
    },
    {
      title: t('digital_errors_detail.virus_detected_title'),
      description: t('digital_errors_detail.virus_detected_description'),
      value: virus_detected_errors,
      color: GraphColors.lightYellow,
    },
    {
      title: t('digital_errors_detail.server_pec_comunication_title'),
      description: t('digital_errors_detail.server_pec_comunication_description'),
      value: server_pec_comunication_errors,
      color: GraphColors.gold,
    },
    {
      title: t('digital_errors_detail.sending_pec_title'),
      description: t('digital_errors_detail.sending_pec_description'),
      value: sending_pec_errors,
      color: GraphColors.goldenYellow,
    },
    {
      title: t('digital_errors_detail.malformed_pec_address_title'),
      description: t('digital_errors_detail.malformed_pec_address_description'),
      value: malformed_pec_address_errors,
      color: GraphColors.oliveBrown,
    },
  ];

  const isEmpty = data.every((item) => item.value === 0);

  const aggregateData = data.filter((item) => item.value > 0);

  const color = aggregateData.map((item) => item.color);

  const options: PnEChartsProps['option'] = {
    color,
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={0} data-testid="digitalErrorsDetail">
      <Grid container direction={{ lg: 'row', xs: 'column' }} spacing={3}>
        <Grid item lg={isEmpty ? 12 : 5} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
          <Typography variant="h6" component="h3">
            {t('digital_errors_detail.title')}
          </Typography>
          {!isEmpty && (
            <>
              <Typography sx={{ my: 3 }} variant="body1" color="text.primary">
                {t('digital_errors_detail.description')}
              </Typography>
              <List>
                {aggregateData.map((item) => {
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
            </>
          )}
        </Grid>
        <Grid item lg={isEmpty ? 12 : 7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
          {isEmpty ? (
            <EmptyStatistics />
          ) : (
            <AggregateStatistics
              values={aggregateData}
              options={options}
              startAngle={180}
              endAngle={-180}
              radius={['30%', '90%']}
              center={['50%', '50%']}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DigitalErrorsDetailStatistics;
