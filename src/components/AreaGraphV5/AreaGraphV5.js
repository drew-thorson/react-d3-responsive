import React from "react";
import { array, bool, number, string } from "prop-types";
import { scaleLinear, scaleOrdinal, scaleTime } from "d3-scale";
import { area as d3area } from "d3-shape";
import { schemeCategory10 } from "d3-scale-chromatic";
import { max, min } from "d3-array";
import { axisBottom, axisLeft, axisRight } from "d3-axis";
import { Margin, LineTypes } from "../Utilities/propTypes";
import { normalizeDate, interpolateCurve } from "../Utilities/chartUtils";
import ResponsiveWrapper from "../Utilities/ResponsiveWrapper";
import Axis from "../Utilities/Axis";
import AxisLabel from "../Utilities/AxisLabel";
import Grid from "../Utilities/Grid";
import Legend from "../Utilities/Legend";
import Dots from "../Utilities/DataPoints";

class AreaGraphV5 extends React.Component {
  static propTypes = {
    /** Adds additional class name(s). */
    className: string,

    /** Override colors for area fill e.g. `["#084b62", "yellow", "#ab264b"]`. The number of colors should match the number of data series. */
    colors: array,

    /** Data to be graphed. */
    data: array.isRequired,

    /** If set to either x or y, that axis will be displayed with a % at the end of the axis numbers. */
    dataPercent: string,

    /** Tooltip date format display [d3.js v3 time api](https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Formatting.md#format). */
    dataPointDateFormat: string,

    /** Data type date, percent, or number. This will format the number the right way for d3. */
    dataType: string,

    /** Date format being passed via data [d3.js v5 time api](https://github.com/d3/d3-time-format#api-reference). */
    dateFormat: string,

    /** Display horizontal grid lines when set to true. */
    displayHorizontalGridLines: bool,

    /** Display legend when set to true. */
    displayLegend: bool,

    /** Display vertical grid lines when set to true. */
    displayVerticalGridLines: bool,

    /** Graph height. */
    height: number,

    /** Globally unique and descriptive HTML ID. Used by QA for automated testing. */
    htmlId: string,

    /** Label key-value pair key value in data. */
    labelKey: string,

    /** Line display type of `cardinal`, `linear`, `step`, `step-after`, or `step-before`. */
    lineType: LineTypes,

    /** Graph area margin. Example: `{top: 5, left: 5, bottom: 5, right: 5}` */
    margin: Margin,

    /** Remove first and last data point. */
    removeFirstAndLast: bool,

    /** Stroke color. */
    strokeColor: string,

    /** Graph title. */
    title: string,

    /** Tooltip background color. */
    tooltipBgColor: string,

    /** Graph max-width. */
    width: number,

    /** X Axis label. */
    xAxisLabel: string,

    /** X axis key-value pair key value. */
    xDataKey: string.isRequired,

    /** X Axis date label format if dataType is a date. [d3.js v3 time api](https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Formatting.md#format). */
    xFormat: string,

    /** X Axis tooltip label. */
    xToolTipLabel: string,

    /** Y Axis label. */
    yAxisLabel: string,

    /** Y axis key-value pair key value. */
    yDataKey: string.isRequired,

    /** Set Y maximum value to be displayed. */
    yMax: number,

    /** Set Y padding for min and max value. */
    yMaxBuffer: number,

    /** Set Y minimum value to be displayed. */
    yMin: number,

    /** Y Axis tooltip label. */
    yToolTipLabel: string
  };

  static defaultProps = {
    dateFormat: "%m-%d-%Y",
    displayHorizontalGridLines: true,
    displayLegend: true,
    height: 500,
    lineType: "linear",
    margin: {
      top: 10,
      right: 40,
      bottom: 30,
      left: 40
    },
    parentMinWidth: 300
  };

  render() {
    const {
      colors,
      data,
      dataType,
      displayHorizontalGridLines,
      displayLegend,
      legendValues,
      height,
      margin,
      parentWidth,
      parentMinWidth,
      lineType,
      xDataKey,
      yDataKey,
      xAxisLabel,
      yAxisLabel
    } = this.props;

    const ticks = 10;

    const svgDimensions = {
      width: Math.max(parentWidth, parentMinWidth),
      height: height
    };

    const normalizeDateFormat =
      dataType === "date" ? normalizeDate(this.props) : data;

    const xLabelHeightOffset = xAxisLabel ? 30 : 0;
    const yLabelWidthOffset = yAxisLabel ? 20 : 0;

    const colorScheme = colors
      ? scaleOrdinal().range(colors)
      : scaleOrdinal(schemeCategory10);

    const calcWidth = svgDimensions.width - margin.left - margin.right;
    const calcHeight =
      svgDimensions.height - margin.top - margin.bottom - xLabelHeightOffset;

    const legend = legendValues
      ? legendValues.map(value => ({ label: value }))
      : data.map(legend => ({ label: legend.label }));

    let xScale;

    dataType === "date" ? (xScale = scaleTime()) : (xScale = scaleLinear());

    xScale
      .rangeRound([0, calcWidth])
      .domain([
        min(normalizeDateFormat, d => min(d.values, d2 => d2[xDataKey])),
        max(normalizeDateFormat, d => max(d.values, d2 => d2[xDataKey]))
      ]);

    const yScale = scaleLinear()
      .rangeRound([calcHeight, 0])
      .domain([0, max(data, d => max(d.values, d2 => d2[yDataKey]))])
      .nice();

    const area = d3area()
      .curve(interpolateCurve(lineType))
      .x(d => xScale(d[xDataKey]))
      .y1(d => yScale(d[yDataKey]))
      .y0(calcHeight);

    const yGrid = axisRight(yScale)
      .ticks(ticks)
      .tickSize(calcWidth)
      .tickFormat("");

    return (
      <>
        <svg width={svgDimensions.width} height={svgDimensions.height}>
          <g
            transform={`translate(${margin.left + yLabelWidthOffset}, ${
              margin.top
            })`}
          >
            <Axis
              className="axis axis--x"
              height={calcHeight}
              axis={axisBottom(xScale).ticks(10)}
              axisType="x"
            />
            {xAxisLabel && (
              <AxisLabel
                height={calcHeight}
                width={calcWidth}
                axisLabel={xAxisLabel}
                axisType="x"
              />
            )}
            <g className="axis axis--y">
              <Axis
                height={calcHeight}
                axis={axisLeft(yScale).ticks(ticks)}
                axisType="y"
              />
              {/* Note: In the actual example 'Frequency' is a child of the above 'g' and it doesn't render.
               * Changing it to a sibiling allows it to render and having the axis as an empty 'g' means that it will also play nicer with react:
               * "The easiest way to avoid conflicts is to prevent the React component from updating.
               * You can do this by rendering elements that React has no reason to update, like an empty <div />."
               * https://reactjs.org/docs/integrating-with-other-libraries.html
               */}
              {displayHorizontalGridLines && (
                <Grid height={calcHeight} grid={yGrid} gridType="y" />
              )}
            </g>
            {yAxisLabel && (
              <AxisLabel
                height={calcHeight}
                width={calcWidth}
                axisLabel={yAxisLabel}
                axisType="y"
              />
            )}
            {normalizeDateFormat.map((d, i) => (
              <g key={d.label}>
                <path
                  key={d.label}
                  d={area(d.values)}
                  fill={colorScheme(i)}
                  // stroke="#333"
                  opacity=".9"
                  strokeWidth={3}
                />
                <Dots
                  data={d.values}
                  x={xScale}
                  y={yScale}
                  stroke="#333"
                  fill={colorScheme(i)}
                  xDataKey={xDataKey}
                  yDataKey={yDataKey}
                />
              </g>
            ))}
          </g>
        </svg>
        {displayLegend && <Legend data={legend} colors={colorScheme} />}
      </>
    );
  }
}

export default ResponsiveWrapper(AreaGraphV5);
