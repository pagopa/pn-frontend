import { EChartsOption } from 'echarts/';

export const option: EChartsOption = {
  tooltip: {
    trigger: 'axis',
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
