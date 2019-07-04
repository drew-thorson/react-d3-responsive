import d3 from "d3";

// Returns formatted date when passed a string style date
export function normalizeDate(chartConfig) {
  // Format date for d3 to use
  const formattedDate = d3.time.format(chartConfig.dateFormat).parse;
  const dataKey = chartConfig.xDataKey;

  return chartConfig.data.map(datapoint => {
    return chartConfig.dataType === "date" &&
      typeof datapoint[dataKey] === "string"
      ? { ...datapoint, [dataKey]: formattedDate(datapoint[dataKey]) }
      : datapoint;
  });
}
