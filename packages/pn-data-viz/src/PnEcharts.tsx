import { init, getInstanceByDom } from "echarts";
import type { EChartOption, ECharts, SetOptionOpts } from "echarts";
import React, { useRef, useEffect } from "react";
import type { CSSProperties } from "react";

export interface PnEChartsProps {
	option: EChartOption;
	style?: CSSProperties;
	settings?: SetOptionOpts;
	loading?: boolean;
	theme?: "light" | "dark";
}

export function PnECharts({
	option,
	style,
	settings,
	loading,
	theme,
}: PnEChartsProps): JSX.Element {
	const chartRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Initialize chart
		let chart: ECharts | undefined;
		if (chartRef.current !== null) {
			chart = init(chartRef.current, theme);
		}

		// Add chart resize listener
		// ResizeObserver is leading to a bit janky UX
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
			const chart = getInstanceByDom(chartRef.current);
			chart?.setOption(option, settings);
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

	return (
		<div ref={chartRef} style={{ width: "100%", height: "100%", ...style }} />
	);
}
