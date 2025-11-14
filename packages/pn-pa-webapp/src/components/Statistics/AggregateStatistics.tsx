import * as _ from 'lodash-es';
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
  legend,
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
        const elem = (_.isArray(params) ? params[0] : params) as {
          marker: string;
          name: string;
          data: { value: number };
        };
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
        style={{ ...sx, height: '400px' }}
        legend={data.map((item) => item.name)}
        dataTestId="Aggregate"
      />
    );
  }
  return (
    <PnECharts
      key="Aggregate"
      option={option}
      style={{ ...sx, height: '400px' }}
      dataTestId="Aggregate"
    />
  );
};

export default AggregateStatistics;
