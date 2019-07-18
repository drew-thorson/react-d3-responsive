import { timeParse } from "d3-time-format";
import {
  curveCardinal,
  curveLinear,
  curveStep,
  curveStepAfter,
  curveStepBefore
} from "d3-shape";

// Returns formatted date when passed a string style date
export function normalizeDate(chartConfig) {
  // Format date for d3 to use
  const formattedDate = timeParse(chartConfig.dateFormat);
  const dataKey = chartConfig.xDataKey;

  return chartConfig.data.map(datapoints => {
    const dateToObject = datapoints.values.map(datapoint =>
      chartConfig.dataType === "date" && typeof datapoint[dataKey] === "string"
        ? {
            ...datapoint,
            [dataKey]: formattedDate(datapoint[dataKey])
          }
        : datapoint
    );
    return {
      ...datapoints,
      values: dateToObject
    };
  });
}

export function interpolateCurve(curveType) {
  let lineType;
  switch (curveType) {
    case "step":
      lineType = curveStep;
      break;
    case "step-after":
      lineType = curveStepAfter;
      break;
    case "step-before":
      lineType = curveStepBefore;
      break;
    case "cardinal":
      lineType = curveCardinal;
      break;
    default:
      lineType = curveLinear;
  }
  return lineType;
}
