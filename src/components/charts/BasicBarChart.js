import { BarChart } from "@mui/x-charts/BarChart";

export default function BasicBars({}) {
  // --- Initial Raw Data Structure ---
  const rawData = [
    { group: "A", series1: 4, series2: 1, series3: 2 },
    { group: "B", series1: 3, series2: 6, series3: 5 },
    { group: "C", series1: 5, series2: 3, series3: 6 },
  ];

  // ----------------------------------------------------
  // Step-by-Step Transformation using JavaScript's reduce
  // ----------------------------------------------------

  const initialSeriesStructure = {
    series1: [],
    series2: [],
    series3: [],
    groups: [], // To build the xAxis data array
  };
  const processedData = rawData.reduce((acc, current) => {
    // 1. Collect the X-axis labels (groups)
    acc.groups.push(current.group);

    // 2. Collect the series values for each series
    acc.series1.push(current.series1);
    acc.series2.push(current.series2);
    acc.series3.push(current.series3);

    return acc;
  }, initialSeriesStructure);
  const xAxisData = processedData.groups;
  const seriesData = [
    { data: processedData.series1, label: "Sales Q1" }, // Added labels for clarity
    { data: processedData.series2, label: "Sales Q2" },
    { data: processedData.series3, label: "Sales Q3" },
  ];
  return (
    <BarChart
      // Pass the collected group names here
      xAxis={[{ scaleType: "band", data: xAxisData }]}
      // Pass the organized series data here
      series={seriesData}
      // Add a legend to show the labels!
      height={300}
      margin={{ top: 20, right: 10, bottom: 20, left: 10 }}
    />
  );
}
