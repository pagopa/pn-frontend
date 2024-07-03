import { EChartOption } from 'echarts';

export const option: EChartOption = {
  tooltip: {
    trigger: 'axis',
    // formatter: (params) => {
    //   const elem = isArray(params) ? params[0] : params;
    //   return `<div style="word-break: break-word;white-space: pre-wrap;">${elem.marker}${
    //     elem.name
    //   } <b>${elem.data.value.toLocaleString()}</b>
    //   </div>`;
    // },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '1%',
    containLabel: true,
  },
  xAxis: {
    axisLabel: {
      show: true,
      interval: 0,
      rotate: 45,
      lineHeight: 20,
      margin: 40,
    },
    type: 'category',
    data: ['Data 1', 'Data 2'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [10, 20],
      type: 'bar',
    },
  ],
  color: ['red', 'blue'],
};
