/* eslint-disable functional/no-let */
import { getInstanceByDom, init, registerTheme } from 'echarts';
import type { EChartOption, SetOptionOpts } from 'echarts';
import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

import {
  Avatar,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';

import senderDashboard from './theme/senderDashboard';

export interface PnEChartsProps {
  option: EChartOption;
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
        const color = option.color?.[index] ?? '';
        const avatarSx = {
          bgcolor: color,
          width: 10,
          height: 10,
          mr: 1
        };
        return (
          <FormControl key={item} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <FormControlLabel
              sx={{ width: 'auto' }}
              data-testid="legendItem"
              control={<Checkbox onChange={() => toggleSerie(item)}
                defaultChecked
                sx={{
                  color,
                  '&.Mui-checked': {
                    color,
                  },
                }}
              />}
              label={
                <Stack sx={{ minWidth: 18, flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar sx={avatarSx}>&nbsp;</Avatar>
                  <Typography variant='caption'
                    sx={{ fontSize: '1rem', letterSpacing: '0.15px' }}
                    color='text.secondary'
                  >{item}</Typography>
                </Stack>
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
