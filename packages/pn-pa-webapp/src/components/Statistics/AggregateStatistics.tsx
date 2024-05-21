import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

export type AggregateDataItem = {
  title: string;
  value: number;
};

type Props = {
  values: Array<AggregateDataItem>;
  options?: PnEChartsProps['option'];
  sx?: CSSProperties;
};

const AggregateStatistics: React.FC<Props> = ({ values, options, sx }) => {
  const { t } = useTranslation(['statistics']);
  const data: Array<{ value: number; name: string }> = values.map((item) => ({
    value: item.value,
    name: item.title,
  }));

  const option: PnEChartsProps['option'] = {
    tooltip: {
      trigger: 'item',
    },
    toolbox: {
      feature: {
        saveAsImage: {
          show: true,
          title: t('save_as_image'),
          name: 'chart',
          backgroundColor: 'white',
          pixelRatio: 2,
        },
      },
    },
    legend: {
      bottom: '0%',
      left: 'center',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '2%',
      containLabel: true,
    },
    series: [
      {
        // name: 'Notifiche',
        type: 'pie',
        radius: ['60%', '100%'],
        center: ['50%', '90%'],
        startAngle: 180,
        endAngle: 360,
        data,
      },
    ],
    ...options,
  };

  return <PnECharts key="Aggregate" option={option} style={sx} />;
};

export default AggregateStatistics;
