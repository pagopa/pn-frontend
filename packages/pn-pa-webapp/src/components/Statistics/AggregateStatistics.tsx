import { isArray } from 'lodash';
import { CSSProperties } from 'react';

import { PnECharts, PnEChartsProps } from '@pagopa-pn/pn-data-viz';

export type AggregateDataItem = {
  title: string;
  value: number;
};

type Props = {
  values: Array<AggregateDataItem>;
  startAngle?: number;
  endAngle?: number;
  radius?: [string, string];
  center?: [string, string];
  legend?: boolean;
  options?: PnEChartsProps['option'];
  sx?: CSSProperties;
};

const AggregateStatistics: React.FC<Props> = ({
  values,
  startAngle = 180,
  endAngle = 360,
  radius = ['60%', '100%'],
  center = ['50%', '90%'],
  legend = true,
  options,
  sx,
}) => {
  const data: Array<{ value: number; name: string }> = values.map((item) => ({
    value: item.value,
    name: item.title,
  }));

  const option: PnEChartsProps['option'] = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const elem = isArray(params) ? params[0] : params;
        return `<div style="word-break: break-word;white-space: pre-wrap;">${elem.marker}${
          elem.name
        } <b>${elem.data.value.toLocaleString()}</b>
        </div>`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '2%',
      containLabel: true,
    },
    series: [
      {
        type: 'pie',
        radius,
        center,
        startAngle,
        endAngle,
        data,
      },
    ],
    ...options,
  };

  if (legend) {
    // eslint-disable-next-line functional/immutable-data
    option.legend = {
      show: false,
    };
    return (
      <PnECharts
        key="Aggregate"
        option={option}
        style={sx}
        legend={data.map((item) => item.name)}
      />
    );
  }
  return <PnECharts key="Aggregate" option={option} style={sx} />;
};

export default AggregateStatistics;
