import senderDashboard from "./theme/senderDashboard";
import {
  Avatar,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
} from "@mui/material";
import { init, getInstanceByDom, registerTheme } from "echarts";
import type { EChartOption, ECharts, SetOptionOpts } from "echarts";
import { useRef, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";

export interface PnEChartsProps {
  option: EChartOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark" | object;
  legend?: Array<string>;
}

export function PnECharts({
  option,
  style,
  settings,
  loading,
  theme,
  legend,
}: PnEChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);
  // Initialize chart
  let chart: ECharts | undefined;

  const toggleSerie = (name: string) => {
    chart?.dispatchAction({
      type: "legendToggleSelect",
      name,
    });
  };

  useEffect(() => {
    if (chartRef.current !== null) {
      let selectedTheme = "defaultTheme";

      registerTheme("defaultTheme", senderDashboard);
      if (typeof theme === "object") {
        registerTheme("customTheme", theme);
        selectedTheme = "customTheme";
      }
      chart = init(chartRef.current, selectedTheme, { renderer: "canvas" });
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    // Should we implement a debounce?
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const options = {
        aria: {
          show: true,
        },
        ...option,
      };
      const chart = getInstanceByDom(chartRef.current);
      chart?.setOption(options, settings);
    }
  }, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading, theme]);

  const legendContent = useMemo(() => legend?.map((item, index) => {
    const color = option.color?.[index] ?? "";
    const avatarSx = {
      bgcolor: color,
      width: 10,
      height: 10,
    };
    return (
      <ListItem key={item} sx={{ width: "auto" }}>
        <Checkbox
          onChange={() => toggleSerie(item)}
          defaultChecked
          sx={{
            color,
            "&.Mui-checked": {
              color,
            },
          }}
        />
        <ListItemAvatar sx={{ minWidth: 18 }}>
          <Avatar sx={avatarSx}>&nbsp;</Avatar>
        </ListItemAvatar>
        <ListItemText secondary={item} />
      </ListItem>
    );
  }), [theme]);

  return (
    <>
      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "400px",
          flexGrow: 1,
          ...style,
        }}
      />
      {legend && (
        <Stack
          direction={"row"}
          alignContent={"center"}
          justifyContent={"center"}
          display={"flex"}
        >
          {legendContent}
        </Stack>
      )}
    </>
  );
}
