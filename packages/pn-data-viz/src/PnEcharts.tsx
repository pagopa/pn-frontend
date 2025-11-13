/* eslint-disable functional/no-let */
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import type { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import type { ComposeOption, SetOptionOpts } from 'echarts/core';
import { getInstanceByDom, init, registerTheme, use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

import CircleIcon from '@mui/icons-material/Circle';
import { Box, Checkbox, FormControl, FormControlLabel, Stack, Typography } from '@mui/material';

import senderDashboard from './theme/senderDashboard';

type ECOption = ComposeOption<
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
>;

export interface PnEChartsProps {
  option: ECOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: 'light' | 'dark' | object;
  legend?: Array<string>;
  dataTestId?: string;
}

export function PnECharts({
  option,
  style,
  settings,
  loading,
  theme,
  legend,
  dataTestId,
}: Readonly<PnEChartsProps>): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);

  const toggleSerie = (name: string) => {
    if (!chartRef.current) {
      return;
    }
    const chart = getInstanceByDom(chartRef.current);
    if (!chart) {
      return;
    }
    chart.dispatchAction({
      type: 'legendToggleSelect',
      name,
    });
  };

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }
    let selectedTheme = 'defaultTheme';

    registerTheme('defaultTheme', senderDashboard);
    if (typeof theme === 'object') {
      registerTheme('customTheme', theme);
      selectedTheme = 'customTheme';
    }
    use([
      CanvasRenderer,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      BarChart,
      LineChart,
      PieChart,
    ]);
    const chart = init(chartRef.current, selectedTheme, { renderer: 'canvas' });

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    // Should we implement a debounce?
    function resizeChart() {
      chart.resize();
    }
    window.addEventListener('resize', resizeChart);

    // Return cleanup function
    return () => {
      chart.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (!chartRef.current) {
      return;
    }

    const options = {
      aria: {
        show: true,
      },
      ...option,
    };
    const chart = getInstanceByDom(chartRef.current);
    if (!chart) {
      return;
    }
    chart.setOption(options, settings);
  }, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    // Show/hide loading
    if (!chartRef.current) {
      return;
    }
    const chart = getInstanceByDom(chartRef.current);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    loading === true ? chart?.showLoading() : chart?.hideLoading();
  }, [loading, theme]);

  const legendContent = useMemo(
    () =>
      legend?.map((item, index) => {
        const color = (option.color as Array<string>)?.[index] ?? '';
        const circleSx = {
          color,
          width: 10,
          height: 10,
          mr: 1,
        };
        return (
          <FormControl key={item} data-testid="legendItem">
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => toggleSerie(item)}
                  defaultChecked
                  sx={{
                    color,
                    '&.Mui-checked': {
                      color,
                    },
                  }}
                />
              }
              label={
                <>
                  <CircleIcon sx={circleSx} />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '1rem', letterSpacing: '0.15px' }}
                    color="text.secondary"
                  >
                    {item}
                  </Typography>
                </>
              }
            />
          </FormControl>
        );
      }),
    [theme]
  );

  return (
    <>
      <Box ref={chartRef} sx={style} data-testid={dataTestId} />
      {legend && (
        <Stack
          direction={'row'}
          alignContent={'center'}
          justifyContent={'center'}
          display={'flex'}
          data-testid="legendContainer"
        >
          {legendContent}
        </Stack>
      )}
    </>
  );
}
